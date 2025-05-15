// src/app/api/solution/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import Problem from "@/models/problem";
import TournamentProgress from "@/models/tournamentProgress";
import User from "@/models/users";
import TournamentWeek from "@/models/tournamentWeeks";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { problemId, code, language, passedTests, totalTests } = body;

    if (!problemId || !code || !language || passedTests === undefined || totalTests === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get the current tournament week
    const tournamentWeek = await TournamentWeek.findOne({ problems: problemId, isActive: true });
    if (!tournamentWeek) {
      return NextResponse.json({ error: "Problem not found in any active week" }, { status: 404 });
    }

    // Check if the user already has progress
    let userProgress = await TournamentProgress.findOne({ userId: user._id });
    
    if (!userProgress) {
      userProgress = new TournamentProgress({
        userId: user._id,
        totalPoints: 0,
        currentWeek: tournamentWeek.weekNumber,
        weekProgress: [{
          weekNumber: tournamentWeek.weekNumber,
          problems: [],
          completed: false,
          reward: {
            points: 0,
            diamonds: 0,
            medals: []
          }
        }]
      });
    }

    // Get the user's progress for the week
    let weekProgress = userProgress.weekProgress.find(
      (week) => week.weekNumber === tournamentWeek.weekNumber
    );

    if (!weekProgress) {
      weekProgress = {
        weekNumber: tournamentWeek.weekNumber,
        problems: [],
        completed: false,
        reward: {
          points: 0,
          diamonds: 0,
          medals: []
        }
      };
      userProgress.weekProgress.push(weekProgress);
    }

    // Check if the problem has already been solved
    let problemSolution = weekProgress.problems.find(
      (p) => p.problemId.toString() === problemId
    );

    const isSolved = passedTests === totalTests;
    const status = isSolved ? "solved" : "attempted";

    // Calculate earned points for solving the problem
    let earnedPoints = 0;
    if (isSolved && (!problemSolution || problemSolution.status !== "solved")) {
      earnedPoints = problem.points;
    }

    if (!problemSolution) {
      // Create new solution
      problemSolution = {
        problemId: new mongoose.Types.ObjectId(problemId),
        code,
        language,
        status,
        passedTests,
        totalTests,
        lastAttemptedAt: new Date()
      };
      weekProgress.problems.push(problemSolution);
    } else {
      // Update the existing solution
      problemSolution.code = code;
      problemSolution.language = language;
      problemSolution.status = status;
      problemSolution.passedTests = passedTests;
      problemSolution.totalTests = totalTests;
      problemSolution.lastAttemptedAt = new Date();
    }

    // Check if all problems are solved
    const weekProblems = await Problem.find({ _id: { $in: tournamentWeek.problems } });
    const solvedCount = weekProgress.problems.filter((p) => p.status === "solved").length;

    if (solvedCount === weekProblems.length) {
      // Mark week as completed and reward user
      weekProgress.completed = true;
      weekProgress.reward = tournamentWeek.rewards;

      // Update user diamonds
      user.diamonds = (parseInt(user.diamonds) + tournamentWeek.rewards.diamonds).toString();

      // Award medals
      tournamentWeek.rewards.medals.forEach((medal) => {
        if (!user.achievements.includes(medal)) {
          user.achievements.push(medal);
        }
      });

      await user.save();
    }

    // Update the total points of the user
    userProgress.totalPoints += earnedPoints;

    await userProgress.save();

    return NextResponse.json({
      success: true,
      earnedPoints,
      totalPoints: userProgress.totalPoints,
      weekCompleted: weekProgress.completed
    });
  } catch (error) {
    console.error("Error saving solution:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
