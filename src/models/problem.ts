// src/models/problem.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface ITestCase extends Document {
  input: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  expectedOutput: string;
}

interface IProblem extends Document {
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
  testCases: ITestCase[];
}

const TestCaseSchema = new Schema<ITestCase>({
  input: {
    javascript: { type: String, required: true },
    python: { type: String, required: true },
    cpp: { type: String, required: true },
    java: { type: String, required: true }
  },
  expectedOutput: { type: String, required: true }
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  starterCode: {
    javascript: { type: String, required: true },
    python: { type: String, required: true },
    cpp: { type: String, required: true },
    java: { type: String, required: true }
  },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['easy', 'medium', 'hard'] 
  },
  points: { type: Number, required: true },
  testCases: [TestCaseSchema]
});

// Add index for faster queries
ProblemSchema.index({ _id: 1 });

// Prevent model overwrite upon hot-reload
const Problem: Model<IProblem> = 
  mongoose.models.Problem || 
  mongoose.model<IProblem>("Problem", ProblemSchema);

export default Problem;