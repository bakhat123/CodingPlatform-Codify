// app/api/users/search/route.ts
import { NextResponse } from "next/server";
import User from "@/models/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    // Search for users whose username contains the query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive search
    })
      .limit(10)
      .select("username pfp"); // Only return username and profile picture

    return NextResponse.json({
      users: users.map((user) => ({
        username: user.username,
        pfp: user.pfp || null,
      })),
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
