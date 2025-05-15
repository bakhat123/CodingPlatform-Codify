// src/models/userTournamentProgress.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for a single problem submission
export interface ISubmission {
  submittedAt: Date;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  passedTests: number;
  totalTests: number;
  errorMessage?: string;
  executionTime?: number;
}

// Interface for a problem's progress
export interface IProblemProgress {
  problemId: mongoose.Types.ObjectId;
  submissions: ISubmission[];
  pointsEarned: number;
  status: 'not_started' | 'attempted' | 'solved';
  firstSolvedAt?: Date;
  lastSubmittedCode?: string;
}

// Interface for a tournament's progress
export interface ITournamentProgress {
  tournamentId: mongoose.Types.ObjectId;
  weekNumber: number;
  problems: IProblemProgress[];
  totalPoints: number;
  completedProblems: number;
  diamondsEarned: number;
  completed: boolean;
  weekCompleted: boolean;
}

// Main interface for user's overall tournament history
export interface IUserProgress extends Document {
  username: string;
  userId: mongoose.Types.ObjectId;
  currentTournament: mongoose.Types.ObjectId;
  tournamentHistory: ITournamentProgress[];
  totalPointsAllTime: number;
  totalTournamentsParticipated: number;
  totalTop3Finishes: number;
  totalDiamondsEarned: number;
  bestRank: number;
  currentStreak: number;
  longestStreak: number;
  rank?: number;  // Weekly rank
}

// Schema for a single submission
const SubmissionSchema = new mongoose.Schema({
  submittedAt: { type: Date, default: Date.now },
  code: { type: String, required: true },
  language: { type: String, required: true, default: 'javascript' },
  status: { 
    type: String, 
    enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
    required: true 
  },
  passedTests: { type: Number, default: 0 },
  totalTests: { type: Number, required: true },
  errorMessage: { type: String },
  executionTime: { type: Number } // in milliseconds
}, { _id: false });

// Schema for a problem's progress
const ProblemProgressSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  submissions: [SubmissionSchema],
  pointsEarned: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['not_started', 'attempted', 'solved'], 
    default: 'not_started' 
  },
  firstSolvedAt: { type: Date },
  lastSubmittedCode: { type: String }
}, { _id: false });

// Schema for a tournament's progress
const TournamentProgressSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  weekNumber: { type: Number, required: true },
  problems: [ProblemProgressSchema],
  totalPoints: { type: Number, default: 0 },
  completedProblems: { type: Number, default: 0 },
  diamondsEarned: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  weekCompleted: { type: Boolean, default: false }
}, { _id: false });

// Main schema for user's overall tournament history
const UserProgressSchema: Schema<IUserProgress> = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentTournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  tournamentHistory: [TournamentProgressSchema],
  totalPointsAllTime: { type: Number, default: 0 },
  totalTournamentsParticipated: { type: Number, default: 0 },
  totalTop3Finishes: { type: Number, default: 0 },
  totalDiamondsEarned: { type: Number, default: 0 },
  bestRank: { type: Number, default: 999999 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  rank: { type: Number },  // Weekly rank
}, { timestamps: true });

// Add indexes for efficient queries
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ username: 1 });
UserProgressSchema.index({ 'tournamentHistory.tournamentId': 1 });

const UserProgress: Model<IUserProgress> = 
  mongoose.models.UserProgress || 
  mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgress;