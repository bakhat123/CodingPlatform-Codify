import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    // Find user's tournament progress - updated query
    const userProgress = await UserProgress.findOne({ 
      userId: user._id,
      username: session.user.name
    });

    if (!userProgress) {
      return NextResponse.json({ code: null });
    }

    // Find the tournament progress entry
    const tournamentProgress = userProgress.tournamentHistory.find(
      tp => tp.tournamentId.toString() === (tournament._id as Types.ObjectId).toString()
    );

    if (!tournamentProgress) {
      return NextResponse.json({ code: null });
    }

    // Find the problem progress
    const problemProgress = tournamentProgress.problems.find(
      p => p.problemId.toString() === problemId
    );

    // If no problem progress found, return null
    if (!problemProgress) {
      return NextResponse.json({ 
        code: null,
        language: null,
        submissionCount: 0,
        lastSubmission: null
      });
    }

    // Return the last submitted code and language if they exist
    const lastSubmittedCode = problemProgress.lastSubmittedCode || 
      (problemProgress.submissions.length > 0 ? problemProgress.submissions[problemProgress.submissions.length - 1].code : null);

    const lastSubmittedLanguage = problemProgress.submissions.length > 0 ? 
      problemProgress.submissions[problemProgress.submissions.length - 1].language : null;

    return NextResponse.json({
      code: lastSubmittedCode,
      language: lastSubmittedLanguage,
      submissionCount: problemProgress.submissions.length,
      lastSubmission: problemProgress.submissions.length > 0 ? 
        problemProgress.submissions[problemProgress.submissions.length - 1] : null
    });

  } catch (error) {
    console.error("Error fetching user's code:", error);
    return NextResponse.json(
      { error: "Failed to fetch user's code" },
      { status: 500 }
    );
  }
}