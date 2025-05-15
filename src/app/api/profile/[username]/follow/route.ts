import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/profile";

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    
    // Properly destructure params
    const targetUsername = params.username;
    const { followerUsername } = await request.json();

    // Validate inputs
    if (!followerUsername || !targetUsername) {
      return NextResponse.json(
        { error: "Both followerUsername and target username are required" },
        { status: 400 }
      );
    }

    // Check if users exist
    const [targetProfile, followerProfile] = await Promise.all([
      Profile.findOne({ username: targetUsername }),
      Profile.findOne({ username: followerUsername })
    ]);

    if (!targetProfile || !followerProfile) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Check current follow status
    const isFollowing = targetProfile.followers.includes(followerUsername);

    // Update both profiles without transaction
    if (isFollowing) {
      // Unfollow
      await Promise.all([
        Profile.updateOne(
          { username: targetUsername },
          { $pull: { followers: followerUsername } }
        ),
        Profile.updateOne(
          { username: followerUsername },
          { $pull: { following: targetUsername } }
        )
      ]);
    } else {
      // Follow
      await Promise.all([
        Profile.updateOne(
          { username: targetUsername },
          { $addToSet: { followers: followerUsername } }
        ),
        Profile.updateOne(
          { username: followerUsername },
          { $addToSet: { following: targetUsername } }
        )
      ]);
    }

    // Get updated counts
    const [updatedTarget, updatedFollower] = await Promise.all([
      Profile.findOne({ username: targetUsername }),
      Profile.findOne({ username: followerUsername })
    ]);

    return NextResponse.json({
      isFollowing: !isFollowing,
      newFollowerCount: updatedTarget?.followers.length || 0,
      newFollowingCount: updatedFollower?.following.length || 0
    });

  } catch (error) {
    console.error("Error in follow operation:", error);
    return NextResponse.json(
      { error: "Failed to process follow request" },
      { status: 500 }
    );
  }
}