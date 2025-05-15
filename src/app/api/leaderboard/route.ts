import { NextRequest, NextResponse } from 'next/server';
import Leaderboard from '@/models/leaderboard';
import User from '@/models/users';

const PRIZES: Record<number, number> = {
  1: 750,
  2: 500,
  3: 250,
  4: 100,
  5: 90,
  6: 80,
  7: 70,
  8: 50,
  9: 70,
  10: 40,
};

interface LeaderboardResponse {
  ratings: {
    id: number;
    place: string;
    username: string;
    points: number;
    prize: number;
  }[];
  userRank?: number;
  totalUsers: number;
}

export async function GET(req: NextRequest) {
  try {
    // Get username from query parameters
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username');

    // Get all entries sorted by points
    const allEntries = await Leaderboard.find()
      .sort({ points: -1 }) // Sort in descending order by points
      .populate({
        path: 'userId',
        select: 'username',
        model: User
      })
      .lean();

    // Get top 10 for leaderboard
    const ratings = allEntries.slice(0, 10).map((entry, index) => ({
      id: index + 1,
      place: (index + 1).toString(),
      username: (entry.userId as any)?.username || 'Anonymous',
      points: entry.points,
      prize: PRIZES[index + 1] || 0
    }));

    // Find user rank if username provided
    let userRank: number | undefined;
    if (username) {
      // Find user entry by username
      const userEntry = allEntries.find(entry => 
        (entry.userId as any)?.username === username
      );

      if (userEntry) {
        let rank = 1; // Start with the first rank
        let lastPoints = -1; // To compare with the previous user's points

        // Iterate through all entries to calculate the rank
        for (let i = 0; i < allEntries.length; i++) {
          const entry = allEntries[i];

          // If points are different, the rank needs to be updated
          if (entry.points !== lastPoints) {
            rank = i + 1; // Set the rank to the current index + 1
          }

          // If we find the user in the leaderboard
          if ((entry.userId as any)?.username === username) {
            userRank = rank; // Set the rank of the user
            break;
          }

          lastPoints = entry.points; // Update lastPoints for next iteration
        }
      }
    }

    return NextResponse.json({
      ratings,
      userRank,
      totalUsers: allEntries.length
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
