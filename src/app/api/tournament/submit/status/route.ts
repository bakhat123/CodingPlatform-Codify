import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserProgress from "@/models/userTournamentProgress";
import Tournament from "@/models/tournament";
import User from "@/models/users";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const problemId = searchParams.get('problemId');

    if (!problemId) {
      return NextResponse.json({ error: "Problem ID is required" }, { status: 400 });
    }

    await connectDB();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the current active tournament
    const tournament = await Tournament.findOne({ status: 'active' });
    if (!tournament) {
      return NextResponse.json({ error: "No active tournament found" }, { status: 404 });
    }

    // Find user's tournament progress - querying by username instead
    const userProgress = await UserProgress.findOne({ 
      userId: user._id,
      username: session.user.name
    });

    if (!userProgress) {
      return NextResponse.json({ 
        isSolved: false,
        tournamentCompleted: false
      });
    }

    // Find the tournament progress entry
    const tournamentProgress = userProgress.tournamentHistory.find(
      tp => tp.tournamentId.toString() === (tournament._id as Types.ObjectId).toString()
    );

    if (!tournamentProgress) {
      return NextResponse.json({ 
        isSolved: false,
        tournamentCompleted: false
      });
    }

    // Find the problem progress
    const problemProgress = tournamentProgress.problems.find(
      p => p.problemId.toString() === problemId
    );

    return NextResponse.json({
      isSolved: problemProgress?.status === 'solved' || false,
      tournamentCompleted: tournamentProgress.completed || false,
      completedProblems: tournamentProgress.completedProblems || 0,
      totalProblems: tournament.problems.length || 0
    });

  } catch (error) {
    console.error("Error checking problem status:", error);
    return NextResponse.json(
      { error: "Failed to check problem status" },
      { status: 500 }
    );
  }
}