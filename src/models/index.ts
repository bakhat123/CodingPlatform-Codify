// src/models/index.ts
import mongoose from "mongoose";
import Problem from "./problem"; // Load Problem first
import Tournament from "./tournament"; // Then Tournament

export { Problem, Tournament };