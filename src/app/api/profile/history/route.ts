import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import UserProgress from "@/models/userTournamentProgress";
import Problem from "@/models/problem";
import Tournament from "@/models/tournament";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get username from query parameters
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Find user's tournament progress
    const userProgress = await UserProgress.findOne({ username });

    if (!userProgress) {
      return NextResponse.json({ history: [] });
    }

    // Get all solved problems from tournament history
    const solvedProblems = [];
    
    for (const tournament of userProgress.tournamentHistory) {
      const tournamentInfo = await Tournament.findById(tournament.tournamentId);
      
      for (const problem of tournament.problems) {
        if (problem.status === 'solved') {
          const problemDetails = await Problem.findById(problem.problemId);
          if (problemDetails) {
            solvedProblems.push({
              id: problem.problemId,
              title: problemDetails.title,
              difficulty: problemDetails.difficulty,
              weekNumber: tournament.weekNumber,
              tournamentTitle: tournamentInfo?.title || `Week ${tournament.weekNumber}`,
              solvedAt: problem.firstSolvedAt,
              points: problem.pointsEarned,
              language: problem.submissions[problem.submissions.length - 1]?.language || 'unknown',
              submissions: problem.submissions.length
            });
          }
        }
      }
    }

    // Sort by solved date (most recent first)
    solvedProblems.sort((a, b) => {
      const dateA = a.solvedAt ? new Date(a.solvedAt).getTime() : 0;
      const dateB = b.solvedAt ? new Date(b.solvedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ history: solvedProblems });

  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
} 