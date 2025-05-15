import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Tournament from "@/models/tournament";
import connectDB from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if the session is valid and user is authenticated
  if (!session?.user?.name) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Find current active tournament
    const tournament = await Tournament.findOne({ status: 'active' });

    if (!tournament) {
      return NextResponse.json(
        { error: "No active tournament" },
        { status: 404 }
      );
    }

    const username = session.user.name;

    // Check if user already exists in participants
    const existingParticipant = tournament.participants.find(
      p => p.username === username
    );

    if (!existingParticipant) {
      // Add new participant with 0 points
      tournament.participants.push({
        username,
        points: 0
      });
      await tournament.save();
    }

    return NextResponse.json({
      success: true,
      username
    });
  } catch (error) {
    console.error("Error joining tournament:", error);
    return NextResponse.json(
      { error: "Failed to join tournament" },
      { status: 500 }
    );
  }
}

// Add this GET endpoint to retrieve all participants with their points
export async function GET() {
  try {
    await connectDB();

    // Find current active tournament
    const tournament = await Tournament.findOne({ status: 'active' });

    if (!tournament) {
      return NextResponse.json(
        { error: "No active tournament" },
        { status: 404 }
      );
    }

    // Sort participants by points in descending order
    const sortedParticipants = [...tournament.participants].sort(
      (a, b) => b.points - a.points
    );

    // Add position to each participant
    const participantsWithPosition = sortedParticipants.map((participant, index) => ({
      position: (index + 1).toString(),
      name: participant.username,
      points: participant.points.toString()
    }));

    return NextResponse.json({
      success: true,
      participants: participantsWithPosition
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}