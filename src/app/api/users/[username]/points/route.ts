import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users";  // Import User model
import Leaderboard from "@/models/leaderboard";  // Import Leaderboard model

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[3];  // Extract username from URL

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    await dbConnect(); // Ensure DB is connected

    // Fetch userId from the User model using the username
    const user = await User.findOne({ username }).select("_id");  // Only select the userId (_id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get points from the leaderboard using userId
    const userPoints = await Leaderboard.findOne({ userId: user._id }).select("points");

    if (!userPoints) {
      return NextResponse.json({ error: "Points not found for the user" }, { status: 404 });
    }

    return NextResponse.json({ points: userPoints.points }, { status: 200 });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 });
  }
}
