import { NextResponse } from "next/server";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

interface LanguageWrapper {
  prepareCode: (code: string, testInput: string) => string;
}

const LANGUAGE_WRAPPERS: Record<string, LanguageWrapper> = {
  javascript: {
    prepareCode: (code: string, testInput: string) => {
      return `${code}\nconsole.log(${testInput});`;
    }
  },
  python: {
    prepareCode: (code: string, testInput: string) => {
      return `${code}\nprint(${testInput})`;
    }
  },
  cpp: {
    prepareCode: (code: string, testInput: string) => {
      return `#include <iostream>
using namespace std;

${code}

int main() {
    cout << ${testInput} << endl;
    return 0;
}`;
    }
  },
  java: {
    prepareCode: (code: string, testInput: string) => {
      console.log('Original code:', code);
      console.log('Test input:', testInput);
      
      // Extract method body using improved regex
      // Look for public static return_type method_name(params) { ... }
      const methodMatch = code.match(/public\s+static\s+(\w+)\s+(\w+)\s*\(([^)]*)\)\s*{([\s\S]*)}/);
      
      let methodBody, returnType, methodName, params;
      
      if (methodMatch) {
        // If we found a complete method definition
        returnType = methodMatch[1];
        methodName = methodMatch[2];
        params = methodMatch[3];
        methodBody = methodMatch[4].trim();
        console.log(`Extracted complete method: ${returnType} ${methodName}(${params})`);
      } else {
        // If we didn't find a complete method, use the entire code as the method body
        methodBody = code.trim();
        // Assume method name from the test input if possible
        const methodCallMatch = testInput.match(/(\w+)\s*\(/);
        methodName = methodCallMatch ? methodCallMatch[1] : "sumTwoNumbers";
        returnType = "int"; // Default to int
        params = "int a, int b"; // Default parameters
      }
      
      // Fix indentation in method body by ensuring each line is properly indented
      methodBody = methodBody
        .split('\n')
        .map(line => line.trim())
        .join('\n        ');
      
      console.log('Extracted method body:', methodBody);
      
      const finalCode = `public class Solution {
    public static ${returnType} ${methodName}(${params}) {
        ${methodBody}
    }
    
    public static void main(String[] args) {
        System.out.println(${testInput});
    }
}`;
      
      console.log('Final prepared code:', finalCode);
      return finalCode;
    }
  }
};

const JUDGE0_API = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const RAPID_API_KEY = process.env.RAPID_API_KEY!;
const RAPID_API_HOST = process.env.RAPID_API_HOST!;

// Define the result structure
interface Judge0Result {
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  token?: string;
}

async function submitCode(sourceCode: string, languageId: number) {
  try {
    console.log(`Submitting code for language ID: ${languageId}`);
    const response = await fetch(`${JUDGE0_API}/submissions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-KEY": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        wait: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Judge0 submission failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error submitting code:", error);
    throw error;
  }
}

async function getResult(token: string): Promise<Judge0Result> {
  try {
    const response = await fetch(`${JUDGE0_API}/submissions/${token}`, {
      headers: {
        "X-RapidAPI-KEY": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get result: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching result:", error);
    throw error;
  }
}

// Add a function to normalize boolean outputs
function normalizeBooleanOutput(output: string, language: string): string {
  const lowerOutput = output.toLowerCase().trim();
  
  // Check if the output is a boolean value
  if (lowerOutput === 'true' || lowerOutput === 'false' || 
      lowerOutput === '1' || lowerOutput === '0' ||
      lowerOutput === 'True' || lowerOutput === 'False') {
    
    // Convert to standard format based on language
    switch (language) {
      case 'python':
        return lowerOutput === 'true' || lowerOutput === '1' ? 'True' : 'False';
      case 'cpp':
        return lowerOutput === 'true' || lowerOutput === 'True' ? '1' : '0';
      case 'java':
        return lowerOutput === 'true' || lowerOutput === 'True' ? 'true' : 'false';
      default: // javascript
        return lowerOutput === 'true' || lowerOutput === 'True' ? 'true' : 'false';
    }
  }
  
  return output;
}

export async function POST(request: Request) {
  try {
    const { code, language, testCases } = await request.json();
    
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS];
    
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }
    
    const languageWrapper = LANGUAGE_WRAPPERS[language as keyof typeof LANGUAGE_WRAPPERS];
    if (!languageWrapper) {
      return NextResponse.json(
        { error: "Language wrapper not found" },
        { status: 400 }
      );
    }
    
    // Process each test case
    const testResults = await Promise.all(
      testCases.map(async (testCase: any) => {
        const { input, expectedOutput } = testCase;
        
        // Prepare the code with the language-specific wrapper
        const preparedCode = languageWrapper.prepareCode(code, input);
        
        // Log the prepared code for debugging
        console.log(`Prepared code for ${language}:`, preparedCode);
        
        // Submit code and get results
        const submission = await submitCode(preparedCode, languageId);
        
        if (!submission.token) {
          throw new Error("No token received from Judge0");
        }
        
        // Poll for results
        let result: Judge0Result | undefined;
        const maxAttempts = 15;
        
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          result = await getResult(submission.token);
          
          // Check if processing is complete (status 1=In Queue, 2=Processing)
          if (result.status.id !== 1 && result.status.id !== 2) {
            break;
          }
        }
        
        if (!result) {
          throw new Error("Failed to get execution results");
        }
        
        // Check if there was a compilation error
        if (result.status.id === 6) {
          return {
            expectedOutput,
            actualOutput: result.compile_output || "Compilation error",
            passed: false,
            error: "Compilation error"
          };
        }
        
        // Check if there was a runtime error
        if (result.stderr) {
          return {
            expectedOutput,
            actualOutput: result.stderr || "Runtime error",
            passed: false,
            error: "Runtime error"
          };
        }
        
        // Get output
        const output = result.stdout?.trim() || "";
        const normalizedOutput = normalizeBooleanOutput(output, language);
        const normalizedExpectedOutput = normalizeBooleanOutput(expectedOutput, language);
        
        return {
          expectedOutput: normalizedExpectedOutput,
          actualOutput: normalizedOutput,
          passed: normalizedOutput === normalizedExpectedOutput,
          error: result.stderr || undefined
        };
      })
    );
    
    // Check for overall errors
    const hasErrors = testResults.some(result => result.error);
    
    return NextResponse.json({ 
      testResults,
      error: hasErrors ? "Some tests encountered errors" : null
    });
  } catch (error: unknown) {
    console.error("Execution error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}