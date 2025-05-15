import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/users';  // User model
import Leaderboard from '@/models/leaderboard';  // Leaderboard model
import dbConnect from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword } = await request.json();
    console.log("Received data:", { name, email, password, confirmPassword });

    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: 'Please fill all fields' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Please enter a valid email' }, { status: 400 });
    }

    if (confirmPassword !== password) {
      return NextResponse.json({ message: 'Password and confirm password do not match' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect(); 

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username: name,
      diamonds: "50",
      pfp: "",
      background: "",
      achievements: [],
      assets: {}
    });

    // Save the new user
    await newUser.save();

    // Create the Leaderboard entry with points set to 0
    const newLeaderboardEntry = new Leaderboard({
      userId: newUser._id,  // Reference to the newly created user
      points: 0,  // New user starts with 0 points
    });

    // Save the leaderboard entry
    await newLeaderboardEntry.save();

    console.log("User created and leaderboard entry added successfully.");
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
