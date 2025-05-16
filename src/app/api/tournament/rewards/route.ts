import { NextResponse } from "next/server";
import Tournament from "@/models/tournament";
import User from "@/models/users";
import connectDB from "@/lib/mongodb";

export async function POST(_request: Request) {
  console.log(_request);
  try {
    await connectDB();

    // Find completed tournament
    const tournament = await Tournament.findOne({ status: 'completed' })
      .sort({ endDate: -1 }); // Get most recently completed
    
    if (!tournament) {
      return NextResponse.json(
        { error: "No completed tournament found" },
        { status: 404 }
      );
    }

    // Check if rewards have been claimed for the tournament already
    if (tournament.participants.every(p => p.rewardClaimed)) {
      return NextResponse.json(
        { error: "Rewards already claimed for this tournament" },
        { status: 400 }
      );
    }

    // Sort participants by points (descending)
    const sortedParticipants = [...tournament.participants].sort(
      (a, b) => b.points - a.points
    );

    // Award top 3 participants
    const rewards = [
      { username: sortedParticipants[0]?.username, gems: 300, achievement: "Multi-Chainer" },
      { username: sortedParticipants[1]?.username, gems: 200, achievement: "Multi-Chainer" },
      { username: sortedParticipants[2]?.username, gems: 100, achievement: "Multi-Chainer" }
    ];

    // Update users in the database and mark rewards as claimed
    for (const reward of rewards) {
      if (reward.username) {
        await User.findOneAndUpdate(
          { username: reward.username },
          { 
            $inc: { gems: reward.gems }, // Increment gems
            $addToSet: { achievements: reward.achievement } // Add achievement if not already present
          }
        );
        // Mark reward as claimed in the tournament document
        await Tournament.updateOne(
          { _id: tournament._id },
          { $set: { "participants.$[elem].rewardClaimed": true } },
          { arrayFilters: [{ "elem.username": reward.username }] }
        );
      }
    }

    return NextResponse.json({
      success: true,
      rewards
    });

  } catch (error) {
    console.error("Error processing rewards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
