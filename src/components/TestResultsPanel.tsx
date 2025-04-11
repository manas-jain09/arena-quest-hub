
import { Check, X } from 'lucide-react';

interface TestResult {
  testCaseId: string;
  passed: boolean;
  expected: string;
  output: string;
  input: string;
  points: number;
}

interface TestResultsPanelProps {
  results: TestResult[];
}

const TestResultsPanel = ({ results }: TestResultsPanelProps) => {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div
          key={result.testCaseId}
          className={`border rounded-md overflow-hidden ${
            result.passed ? 'border-green-200' : 'border-red-200'
          }`}
        >
          <div
            className={`p-3 flex justify-between items-center ${
              result.passed ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex items-center">
              {result.passed ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">Test Case #{index + 1}</span>
            </div>
            <div className={`font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.passed ? '+' : ''}
              {result.points} points
            </div>
          </div>

          <div className="p-3 space-y-3 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Input:</p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{result.input}</pre>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Expected Output:</p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{result.expected}</pre>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Your Output:</p>
              <pre
                className={`p-2 rounded text-sm overflow-x-auto ${
                  result.passed ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {result.output || '(No output)'}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestResultsPanel;
