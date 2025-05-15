import { NextResponse } from "next/server";
import Problem from "@/models/problem";
import connectDB from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Log the ID for debugging
    console.log('Fetching problem with ID:', params.id);
    
    // Try to find problem by _id first
    let problem = await Problem.findById(params.id).lean();
    
    // If not found, try to find by numeric id
    if (!problem) {
      problem = await Problem.findOne({ id: parseInt(params.id) }).lean();
    }
    
    if (!problem) {
      console.log('Problem not found with ID:', params.id);
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }
    
    // Transform the problem data to match the expected format
    const transformedProblem = {
      _id: problem._id.toString(),
      title: problem.title,
      description: problem.description,
      starterCode: problem.starterCode,
      difficulty: problem.difficulty,
      points: problem.points,
      testCases: problem.testCases.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }))
    };
    
    // Log successful fetch
    console.log('Successfully fetched problem:', problem.title);
    
    return NextResponse.json(transformedProblem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}