import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/profile";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find profile
    const profile = await Profile.findOne({ username }).lean().exec();

    if (!profile) {
      // Create new profile
      const newProfile = await Profile.create({ username });
      return NextResponse.json(newProfile);
    }

    return NextResponse.json(profile);
  }
  catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    const { username } = params;
    const { followerUsername, targetUsername } = await request.json();

    if (!followerUsername || !targetUsername) {
      return NextResponse.json(
        { error: "Both follower and target usernames are required" },
        { status: 400 }
      );
    }

    // Find target profile
    let targetProfile = await Profile.findOne({ username: targetUsername });

    // Create profile if it doesn't exist
    if (!targetProfile) {
      targetProfile = await Profile.create({
        username: targetUsername,
        followers: []
      });
    }

    // Find follower profile or create it
    let followerProfile = await Profile.findOne({ username: followerUsername });
    if (!followerProfile) {
      followerProfile = await Profile.create({
        username: followerUsername,
        following: []
      });
    }

    // Check if already following
    const isAlreadyFollowing = targetProfile.followers?.includes(followerUsername);

    // Update arrays
    if (isAlreadyFollowing) {
      // Unfollow logic
      targetProfile.followers = targetProfile.followers.filter((f: string) => f !== followerUsername);
      if (followerProfile.following) {
        followerProfile.following = followerProfile.following.filter((f: string) => f !== targetUsername);
      }
    } else {
      // Follow logic
      if (!targetProfile.followers) {
        targetProfile.followers = [];
      }
      targetProfile.followers.push(followerUsername);

      if (!followerProfile.following) {
        followerProfile.following = [];
      }
      followerProfile.following.push(targetUsername);
    }

    // Save changes
    await targetProfile.save();
    await followerProfile.save();

    return NextResponse.json({
      isFollowing: !isAlreadyFollowing,
      newFollowerCount: targetProfile.followers.length
    });
  } catch (error) {
    console.error("Error updating follow status:", error);
    return NextResponse.json(
      { error: "Failed to update follow status" },
      { status: 500 }
    );
  }
}