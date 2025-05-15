import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract username from URL path
    const url = new URL(req.url);
    const username = url.pathname.split('/')[3]; // Gets the username part from /api/users/[username]/sidebar

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).select("pfp background");
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pfp: user.pfp,
      background: user.background,
      pfpUrl: user.pfp 
        ? `/assets/images/Store/${user.pfp}.png` 
        : "/default-pfp.png",
      backgroundUrl: user.background
        ? `/assets/images/Store/${user.background}.jpg`
        : "/default-bg.jpg",
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    // Extract username from URL path
    const url = new URL(req.url);
    const username = url.pathname.split('/')[3]; // Gets the username part from /api/users/[username]/sidebar

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    const { pfp, background } = await req.json();

    const updateData: { pfp?: string; background?: string } = {};
    if (pfp) updateData.pfp = pfp;
    if (background) updateData.background = background;

    const user = await User.findOneAndUpdate(
      { username },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pfp: user.pfp,
      background: user.background,
      pfpUrl: user.pfp
        ? `/assets/images/Store/${user.pfp}.png`
        : "/default-pfp.png",
      backgroundUrl: user.background
        ? `/assets/images/Store/${user.background}.jpg`
        : "/fortnite.jpg",
    });
  } catch (error) {
    console.error("Error updating assets:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}