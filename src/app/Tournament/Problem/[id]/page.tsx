"use client";
import React, { useEffect, useState, useCallback } from "react";
import CodeEditor from "./ui/CodeEditor";
import LanguageSelector from "./ui/LanguageSelector";
import OutputPanel from "./ui/OutputPanel";
import { Play, Code, FileText, CheckCircle, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ApiError {
  error: string;
}

interface UserCodeResponse {
  code?: string;
  language?: string;
  error?: string;
}

interface SubmitResponse {
  success?: boolean;
  points?: number;
  error?: string;
  allCompleted?: boolean;
  tournamentJustCompleted?: boolean;
}

interface TestCase {
  input: {
    [key: string]: string;  // Maps language to input string
  };
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  starterCode: {
    [key: string]: string;  // Maps language to starter code
  };
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  testCases: TestCase[];
}

interface TestResultItem {
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string; // Error can be optional
}

export default function TournamentProblemPage() {
  const { id } = useParams();
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [language, setLanguage] = useState<string>("javascript");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hasRunCode, setHasRunCode] = useState<boolean>(false);
  const [passedTests, setPassedTests] = useState<number>(0);
  const [totalTests, setTotalTests] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [testExecutionResults, setTestExecutionResults] = useState<TestResultItem[] | null>(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (!res.ok) {
          const errorData: ApiError = await res.json();
          throw new Error(errorData.error || "Problem not found");
        }

        const data: Problem = await res.json();
        setProblem(data);
        
        // Fetch user's last submitted code and language
        try {
          const codeResponse = await fetch(`/api/tournament/submit/code?problemId=${id}`);
          if (codeResponse.ok) {
            const codeData: UserCodeResponse = await codeResponse.json();
            console.log('Fetched code data:', codeData); // Debug log
            
            if (codeData.code) {
              // Set the language first
              if (codeData.language) {
                console.log('Setting language to:', codeData.language); // Debug log
                setLanguage(codeData.language);
              }
              // Then set the code
              setCode(codeData.code);
              return;
            }
          }
        } catch (codeError) {
          console.error("Error fetching user's code:", codeError);
        }

        // Only set starter code if no saved code was found
        if (data.starterCode && typeof data.starterCode === 'object') {
          const starterCode = data.starterCode[language];
          setCode(typeof starterCode === 'string' ? starterCode : '');
        }
      } catch (err) {
        console.error('Error in fetchProblem:', err);
        toast.error("Failed to load problem");
      }
    }

    if (id) {
      fetchProblem();
    }
  }, [id]);

  useEffect(() => {
    // Only set starter code if there's no saved code
    const checkAndSetStarterCode = async () => {
      try {
        const codeResponse = await fetch(`/api/tournament/submit/code?problemId=${id}`);
        if (codeResponse.ok) {
          const codeData: UserCodeResponse = await codeResponse.json();
          // Only set starter code if there's no saved code
          if (!codeData.code && problem?.starterCode && problem.starterCode[language]) {
            setCode(problem.starterCode[language]);
          }
        }
      } catch (error) {
        console.error("Error checking saved code:", error);
      }
    };

    if (id && problem) {
      checkAndSetStarterCode();
    }
  }, [problem, id, language]);

  // Add a new useEffect to handle language changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (problem?.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  const handleRun = useCallback(async () => {
    if (!problem) {
      setError("Problem data not loaded");
      return;
    }

    setIsRunning(true);
    setError("");
    setOutput("");
    setTestExecutionResults(null);
    setPassedTests(0);
    setTotalTests(problem.testCases.length);

    try {
      if (code.trim() === "") {
        throw new Error("Please enter some code to run");
      }

      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          language: language,
          testCases: problem.testCases.map(tc => ({
            input: tc.input[language],
            expectedOutput: tc.expectedOutput
          }))
        })
      });

      const data: { testResults: TestResultItem[], error?: string | null } = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      const passedCount = data.testResults.filter((result: TestResultItem) => result.passed).length;
      setPassedTests(passedCount);
      setTestExecutionResults(data.testResults);

      if (passedCount === problem.testCases.length) {
        // Submit solution to tournament
        try {
          const submitResponse = await fetch("/api/tournament/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              problemId: problem._id,
              code: code,
              language: language,
              passedTests: passedCount,
              totalTests: problem.testCases.length
            }),
          });
          const submitData: SubmitResponse = await submitResponse.json();
          if (submitResponse.ok && submitData.success) {
            toast.success(`Solution submitted! Earned ${submitData.points} points! 🎉`, {
              position: "top-right",
              autoClose: 3000,
            });
            if (submitData.allCompleted || submitData.tournamentJustCompleted) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 7000);
            }
          } else {
            toast.error(submitData.error || "Failed to submit solution.");
          }
        } catch (submitError: unknown) {
          toast.error(submitError instanceof Error ? submitError.message : "Error submitting solution.");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during execution.");
    } finally {
      setIsRunning(false);
      setHasRunCode(true);
      setShowResults(true);
    }
  }, [problem, code, language]);

  const handleToggleClick = () => {
    setShowResults(!showResults);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleRun();
    }
  }, [handleRun]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div 
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-t-2 border-blue-400 border-r-2 animate-spin mb-4"></div>
            <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Loading problem...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const difficultyColors = {
    'easy': { bg: 'bg-green-900/30', text: 'text-green-300', border: 'border-green-700' },
    'medium': { bg: 'bg-yellow-900/30', text: 'text-yellow-300', border: 'border-yellow-700' },
    'hard': { bg: 'bg-red-900/30', text: 'text-red-300', border: 'border-red-700' },
  };

  const difficultyStyle = difficultyColors[problem.difficulty];

  return (
    <>
      {showConfetti && <Confetti />}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 pb-20 mt-[80px]">
        <div className="max-w-7xl mx-auto space-y-4">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between mb-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700 shadow-lg relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 p-2 bg-blue-500/20 rounded-lg">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {problem.title}
                </h1>
                <div className="flex items-center mt-1 space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
                    {problem.difficulty.toUpperCase()}
                  </span>
                  <span className="text-blue-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {problem.points} points
                  </span>
                </div>
              </div>
            </div>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-200 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-400" />
                  Code Editor
                </h2>
                <div className="flex items-center text-xs text-gray-400">
                  <kbd className="px-1 py-0.5 mr-1 bg-gray-700 rounded">Ctrl</kbd>
                  +
                  <kbd className="px-1 py-0.5 ml-1 bg-gray-700 rounded">Enter</kbd>
                  <span className="ml-1">to run</span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                <div className="h-10 bg-gray-800/80 border-b border-gray-700 flex items-center px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-400">
                    {language === "javascript" ? "index.js" : 
                     language === "python" ? "main.py" : 
                     language === "cpp" ? "solution.cpp" : "Main.java"}
                  </div>
                </div>
                <CodeEditor 
                  code={typeof code === 'string' ? code : ''} 
                  setCode={setCode} 
                />
              </div>
              <motion.button
                onClick={handleRun}
                disabled={isRunning}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg mb-[30px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                {isRunning ? "Running..." : "Run Code"}
              </motion.button>
            </motion.div>

            <motion.div 
              className="relative h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-200 flex items-center">
                  {showResults ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                      Test Results
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2 text-blue-400" />
                      Problem Description
                    </>
                  )}
                </h2>
                <motion.button
                  onClick={handleToggleClick}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showResults ? (
                    <>
                      <FileText className="w-4 h-4 mr-1" />
                      Problem
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Results
                    </>
                  )}
                </motion.button>
              </div>

              <div className="h-[calc(100vh-8rem)] overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg relative z-0">
                <AnimatePresence mode="wait">
                  {!showResults ? (
                    <motion.div 
                      key="problem"
                      className="w-full h-full overflow-y-auto p-6 custom-scrollbar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white space-y-4">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          {problem.title}
                        </h2>
                        <div className="prose prose-invert max-w-none">
                          {problem.description.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-gray-300">{paragraph}</p>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="font-semibold text-lg mb-4 text-blue-400">Test Cases</h3>
                          {problem.testCases.map((testCase, i) => (
                            <motion.div 
                              key={i} 
                              className="bg-gray-900/80 p-4 rounded-lg mb-4 border border-gray-700"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-blue-300">Test Case {i + 1}</p>
                              </div>
                              <div className="mb-3">
                                <p className="font-medium text-gray-300 mb-1 text-sm">Input:</p>
                                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto text-gray-300 border border-gray-700">
                                  {testCase.input[language]}
                                </pre>
                              </div>
                              <div>
                                <p className="font-medium text-gray-300 mb-1 text-sm">Expected Output:</p>
                                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto text-gray-300 border border-gray-700">
                                  {testCase.expectedOutput}
                                </pre>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="results"
                      className="w-full h-full overflow-y-auto p-6 custom-scrollbar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {hasRunCode && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-white">Test Results</h3>
                            <div className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                              <span className="text-sm">
                                <span className="text-green-400">{passedTests}</span>
                                <span className="text-gray-400"> / </span>
                                <span className="text-blue-400">{totalTests}</span>
                                <span className="text-gray-400"> passed</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                            <motion.div 
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${(passedTests / totalTests) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            ></motion.div>
                          </div>
                        </div>
                      )}
                      
                      {testExecutionResults && testExecutionResults.map((result, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg border border-gray-700"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                              Test Case {index + 1}
                            </h3>
                            {result.passed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className="my-2 bg-gray-900 p-3 rounded-lg">
                            <p className="font-medium text-blue-300 mb-1">Input:</p>
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              {problem?.testCases[index]?.input[language] || "N/A"}
                            </pre>
                          </div>
                          <div className="my-2 bg-gray-900 p-3 rounded-lg">
                            <p className="font-medium text-blue-300 mb-1">Expected:</p>
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              {result.expectedOutput}
                            </pre>
                          </div>
                          <div className="my-2 bg-gray-900 p-3 rounded-lg">
                            <p className="font-medium text-blue-300 mb-1">Actual:</p>
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              {result.actualOutput}
                            </pre>
                          </div>
                          {result.error && (
                            <div className="my-2 bg-gray-900 p-3 rounded-lg">
                              <p className="font-medium text-red-300 mb-1">Error:</p>
                              <pre className="text-sm text-red-300 overflow-x-auto">
                                {result.error}
                              </pre>
                            </div>
                          )}
                          <div className={`mt-3 py-2 px-3 rounded-lg ${
                            result.passed ? "bg-green-900/40 text-green-400 border border-green-700" : "bg-red-900/40 text-red-400 border border-red-700"}
                          }`}>
                            <p className="font-semibold">
                              Status: {result.passed ? "Passed" : "Failed"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      <OutputPanel output={output} error={error} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}