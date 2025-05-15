import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import UserProgress, { IUserProgress, ITournamentProgress, IProblemProgress } from "@/models/userTournamentProgress";
import Tournament from "@/models/tournament";
import User from "@/models/users";
import Leaderboard from "@/models/leaderboard";
import mongoose from "mongoose";

// Add type for tournament
interface ITournament {
  _id: mongoose.Types.ObjectId;
  weekNumber: number;
  problems: Array<{
    _id: mongoose.Types.ObjectId;
    points: number;
    title: string;
  }>;
  participants: Array<{
    username: string;
    points: number;
    rewardClaimed?: boolean;
  }>;
}

// Define achievement medals
const achievementMedals: Record<string, string> = {
  'stash-whale': '🐳', // Example: Stash Whale achievement gets a whale emoji
  // Add other achievements and their medals here
  // e.g., 'first-solve': '🥇',
};

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId, code, language, passedTests, totalTests } = await req.json();

    await connectDB();

    // Find user and tournament
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the tournament type casting
    const tournament = await Tournament.findOne({ status: 'active' })
      .populate('problems') as unknown as ITournament & { 
        _id: mongoose.Types.ObjectId;
        save: () => Promise<ITournament>;
      };
    if (!tournament) {
      return NextResponse.json({ error: "No active tournament found" }, { status: 404 });
    }

    // Find or create user progress
    let userProgress = await UserProgress.findOne({ 
      userId: user._id,
      username: session.user.name
    });

    if (!userProgress) {
      userProgress = new UserProgress({
        userId: user._id,
        username: session.user.name,
        currentTournament: new mongoose.Types.ObjectId(tournament._id),
        tournamentHistory: [{
          tournamentId: new mongoose.Types.ObjectId(tournament._id),
          weekNumber: tournament.weekNumber,
          problems: [],
          totalPoints: 0,
          completedProblems: 0,
          diamondsEarned: 0,
          completed: false,
          weekCompleted: false
        }]
      });
    }

    // Find or create tournament progress
    let tournamentProgress: ITournamentProgress | undefined = userProgress.tournamentHistory.find(
      t => t.tournamentId.toString() === tournament._id.toString()
    );

    if (!tournamentProgress) {
      tournamentProgress = {
        tournamentId: new mongoose.Types.ObjectId(tournament._id),
        weekNumber: tournament.weekNumber,
        problems: [],
        totalPoints: 0,
        completedProblems: 0,
        diamondsEarned: 0,
        completed: false,
        weekCompleted: false
      };
      userProgress.tournamentHistory.push(tournamentProgress);
    }

    // Find or create problem progress
    let problemProgress = tournamentProgress.problems.find(
      p => p.problemId.toString() === problemId
    );

    // Create the submission object first
    const submission = {
      submittedAt: new Date(),
      code,
      language,
      status: passedTests === totalTests ? "accepted" as const : "wrong_answer" as const,
      passedTests,
      totalTests
    };

    if (!problemProgress) {
      // Create new problem progress with the submission included
      problemProgress = {
        problemId: new mongoose.Types.ObjectId(problemId),
        status: 'attempted',
        submissions: [submission], // Include the submission immediately
        pointsEarned: 0,
        firstSolvedAt: passedTests === totalTests ? new Date() : undefined,
        lastSubmittedCode: code
      };
      tournamentProgress.problems.push(problemProgress);
    } else {
      // Add submission to existing problem progress
      problemProgress.submissions.push(submission);
      problemProgress.lastSubmittedCode = code;
    }

    // Set problem as attempted if not already
    if (problemProgress.status === 'not_started') {
      problemProgress.status = 'attempted';
    }

    let diamondsAwarded = 0;
    let achievementAwardedName: string | null = null;
    let awardedMedal: string | null = null;
    let pointsAwarded = 0;
    let tournamentJustCompleted = false;

    // Update if solved and not already solved before
    if (passedTests === totalTests && problemProgress.status !== 'solved') {
      problemProgress.status = 'solved';
      problemProgress.firstSolvedAt = new Date();
      
      // Find the problem in the tournament to get its points
      const tournamentProblem = tournament.problems.find(p => 
        p._id.toString() === problemId
      ) as { _id: mongoose.Types.ObjectId; points: number } | undefined;
      
      if (tournamentProblem) {
        pointsAwarded = tournamentProblem.points || 0;
        problemProgress.pointsEarned = pointsAwarded;
        
        // Update tournament statistics
        tournamentProgress.totalPoints += pointsAwarded;
        tournamentProgress.completedProblems += 1;
      }

      // Update user's total points
      userProgress.totalPointsAllTime += pointsAwarded;

      // Update leaderboard
      let leaderboardEntry = await Leaderboard.findOne({ userId: user._id });
      if (!leaderboardEntry) {
        leaderboardEntry = new Leaderboard({
          userId: user._id,
          points: pointsAwarded
        });
      } else {
        leaderboardEntry.points += pointsAwarded;
      }
      await leaderboardEntry.save();

      // Update tournament participant points
      const participantIndex = tournament.participants.findIndex(p => p.username === session.user?.name);
      if (participantIndex !== -1) {
        tournament.participants[participantIndex].points += pointsAwarded;
      } else {
        // Add user to participants if not already there
        tournament.participants.push({
          username: session.user?.name || '',
          points: pointsAwarded,
          rewardClaimed: false
        });
      }
      
      // Check if all problems are solved now
      const allProblemsSolved = tournament.problems.length === tournamentProgress.completedProblems;
      
      // Only award diamonds if all problems have at least one accepted submission
      if (allProblemsSolved && !tournamentProgress.completed) {
        // Verify that all problems have at least one accepted submission
        const allProblemsHaveAcceptedSubmission = tournamentProgress.problems.every(problem => 
          problem.submissions.some(submission => 
            submission.status === 'accepted' && 
            submission.passedTests === submission.totalTests
          )
        );

        if (allProblemsHaveAcceptedSubmission) {
          // Mark tournament as completed for this user
          tournamentProgress.completed = true;
          tournamentProgress.weekCompleted = true;
          tournamentJustCompleted = true;
          
          // Award diamonds (300) 
          diamondsAwarded = 300;
          tournamentProgress.diamondsEarned += diamondsAwarded;
          userProgress.totalDiamondsEarned += diamondsAwarded;
          
          // Convert current diamonds to number, add the award, then convert back to string
          const currentDiamondsNum = parseInt(user.diamonds, 10) || 0;
          user.diamonds = (currentDiamondsNum + diamondsAwarded).toString();
          
          // Award achievement
          const stashWhaleAchievement = 'Multi-Chainer';
          if (!user.achievements.includes(stashWhaleAchievement)) {
            user.achievements.push(stashWhaleAchievement);
            achievementAwardedName = stashWhaleAchievement;
            awardedMedal = achievementMedals[stashWhaleAchievement] || '🏆';
          }
          
          // Update total tournaments stats
          userProgress.totalTournamentsParticipated += 1;
          
          // Update streak
          userProgress.currentStreak += 1;
          if (userProgress.currentStreak > userProgress.longestStreak) {
            userProgress.longestStreak = userProgress.currentStreak;
          }
          
          // Mark that the user has claimed their reward in tournament
          const userParticipantIndex = tournament.participants.findIndex(p => p.username === session.user?.name);
          if (userParticipantIndex !== -1) {
            tournament.participants[userParticipantIndex].rewardClaimed = true;
          }
          
          // Save user with diamonds and achievement update
          await user.save();
        }
      }
    }

    // Save changes
    await Promise.all([
      userProgress.save(),
      tournament.save()
    ]);

    return NextResponse.json({
      success: true,
      points: pointsAwarded,
      status: problemProgress.status,
      diamondsAwarded,
      achievement: achievementAwardedName ? { name: achievementAwardedName, medal: awardedMedal } : null,
      allCompleted: tournamentProgress.completed,
      tournamentJustCompleted
    });

  } catch (error: unknown) {
    console.error("Error submitting solution:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit solution", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}