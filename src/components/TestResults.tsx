
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TestResult {
  input: string;
  expected: string;
  actual?: string;
  status: 'passed' | 'failed' | 'error' | 'pending';
  executionTime?: number;
}

interface TestResultsProps {
  results: TestResult[];
  isRunning: boolean;
}

export function TestResults({ results, isRunning }: TestResultsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <Card className="h-64 overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isRunning ? (
          <div className="flex items-center justify-center h-32">
            <div className="loading-spinner"></div>
            <span className="ml-2">Running tests...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Run your code to see test results
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Test Case {index + 1}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="text-sm capitalize">{result.status}</span>
                    {result.executionTime && (
                      <span className="text-xs text-gray-500">
                        {result.executionTime}ms
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-medium">Input: </span>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{result.input}</code>
                  </div>
                  <div>
                    <span className="font-medium">Expected: </span>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{result.expected}</code>
                  </div>
                  {result.actual && (
                    <div>
                      <span className="font-medium">Actual: </span>
                      <code className={`px-1 py-0.5 rounded ${
                        result.status === 'passed' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.actual}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
