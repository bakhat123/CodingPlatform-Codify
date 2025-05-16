import { NextRequest, NextResponse } from "next/server";
import Problem from "@/models/problem"; 
import connectDB from "@/lib/mongodb";

// Define the structure for plain lean objects
interface PlainTestCaseFromModel {
  input: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  expectedOutput: string;
}

interface PlainProblemData {
  _id: { toString(): string }; // Mongoose ObjectId has toString(), or string if lean already converts
  title: string;
  description: string;
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  testCases: PlainTestCaseFromModel[];
  id?: number; // from ProblemSchema, for findOne({ id: ... })
}



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await connectDB();
    
    // Log the ID for debugging
    console.log('Fetching problem with ID:', id);
    
    let problem: PlainProblemData | null = await Problem.findById(id).lean<PlainProblemData>();
    
    if (!problem) {
      // Ensure the type is consistent if found by numeric id
      problem = await Problem.findOne({ id: parseInt(id) }).lean<PlainProblemData>();
    }
    
    if (!problem) {
      console.log('Problem not found with ID:', id);
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
      testCases: problem.testCases.map((tc: PlainTestCaseFromModel) => ({
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