// src/app/api/solution/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import Problem from "@/models/problem";
import UserProgress, { ITournamentProgress, IProblemProgress, IUserProgress } from "@/models/userTournamentProgress";
import User from "@/models/users";
import Tournament, { ITournament } from "@/models/tournament";

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

    // Get the current active tournament that includes this problem
    const currentTournament: ITournament | null = await Tournament.findOne({ problems: problemId, status: 'active' });
    if (!currentTournament) {
      return NextResponse.json({ error: "Problem not found in any active tournament" }, { status: 404 });
    }

    let userProgress: IUserProgress | null = await UserProgress.findOne({ userId: user._id });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        userId: user._id,
        username: user.username,
        currentTournament: currentTournament._id as mongoose.Types.ObjectId,
        tournamentHistory: [],
        totalPointsAllTime: 0,
      });
    }

    // Find or create progress for the current tournament in tournamentHistory
    let currentTournamentProgress = userProgress.tournamentHistory.find(
      (th: ITournamentProgress) => th.tournamentId.equals(currentTournament!._id as mongoose.Types.ObjectId) 
    );

    if (!currentTournamentProgress) {
      const newTournamentProgressEntry: ITournamentProgress = {
        tournamentId: currentTournament._id as mongoose.Types.ObjectId,
        weekNumber: currentTournament.weekNumber,
        problems: [],
        totalPoints: 0,
        completedProblems: 0,
        diamondsEarned: 0,
        completed: false,
        weekCompleted: false
      };
      userProgress.tournamentHistory.push(newTournamentProgressEntry);
      currentTournamentProgress = userProgress.tournamentHistory[userProgress.tournamentHistory.length - 1];
    }
    
    if (!currentTournamentProgress) {
        return NextResponse.json({ error: "Failed to find or create tournament progress" }, { status: 500 });
    }

    // problemSolution is an IProblemProgress object
    const problemSolution = currentTournamentProgress.problems.find(
      (p: IProblemProgress) => p.problemId.toString() === problemId
    );

    const isSolved = passedTests === totalTests;
    // Determine status based on ISubmission status types
    const submissionStatus: IProblemProgress['status'] = isSolved ? "solved" : "attempted";

    let earnedPoints = 0;
    if (isSolved && (!problemSolution || problemSolution.status !== "solved")) {
      earnedPoints = problem.points;
    }

    if (!problemSolution) {
      const newProblemSolution: IProblemProgress = {
        problemId: new mongoose.Types.ObjectId(problemId),
        submissions: [{
          submittedAt: new Date(),
          code,
          language,
          status: isSolved ? 'accepted' : 'wrong_answer',
          passedTests,
          totalTests,
        }],
        pointsEarned: earnedPoints,
        status: submissionStatus, 
        firstSolvedAt: isSolved ? new Date() : undefined,
        lastSubmittedCode: code
      };
      currentTournamentProgress.problems.push(newProblemSolution);
    } else {
      // Add to existing submissions
      problemSolution.submissions.push({
        submittedAt: new Date(),
        code,
        language,
        status: isSolved ? 'accepted' : 'wrong_answer',
        passedTests,
        totalTests,
      });
      problemSolution.status = submissionStatus;
      problemSolution.lastSubmittedCode = code;
      if (isSolved && problemSolution.status !== 'solved') {
          if(!problemSolution.firstSolvedAt) problemSolution.firstSolvedAt = new Date();
          problemSolution.pointsEarned += earnedPoints;
      } else if (isSolved && problemSolution.status === 'solved'){
      }
    }

    // Update total points if points were earned in this submission
    if (earnedPoints > 0) {
        currentTournamentProgress.totalPoints += earnedPoints;
        userProgress.totalPointsAllTime += earnedPoints;
        if(isSolved) {
            currentTournamentProgress.completedProblems = currentTournamentProgress.problems.filter(p => p.status === 'solved').length;
        }
    }

    // --- REWARDS LOGIC NEEDS REVISITING BASED ON ITournament STRUCTURE ---
    // For now, assuming rewards (diamonds, medals) are handled differently or defined elsewhere
    // Example: Check if all problems in *this specific tournament* are solved
    const allProblemsInTournament = await Problem.find({ _id: { $in: currentTournament.problems } });
    const allCurrentTournamentProblemsSolved = currentTournamentProgress.problems.filter((p: IProblemProgress) => p.status === 'solved').length === allProblemsInTournament.length;

    if (allCurrentTournamentProblemsSolved && !currentTournamentProgress.completed) {
      currentTournamentProgress.completed = true;
      currentTournamentProgress.weekCompleted = true;

      // Placeholder for actual rewards, as ITournament doesn't have a direct .rewards field
      const awardedDiamonds = 100;
      currentTournamentProgress.diamondsEarned += awardedDiamonds;
      user.diamonds = (parseInt(user.diamonds || '0') + awardedDiamonds).toString();

      const exampleMedal: string = "Tournament Conqueror";
      if (!user.achievements.includes(exampleMedal)) {
        user.achievements.push(exampleMedal);
      }
      await user.save(); 
    }
    // --- END OF REWARDS LOGIC REVISIT PLACEHOLDER ---

    await userProgress.save();

    return NextResponse.json({
      success: true,
      earnedPoints,
      totalPoints: userProgress.totalPointsAllTime,
      weekCompleted: currentTournamentProgress.completed,
      problemStatus: problemSolution ? problemSolution.status : submissionStatus
    });
  } catch (error) {
    console.error("Error saving solution:", error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
