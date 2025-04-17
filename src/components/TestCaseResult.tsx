
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TestResultProps {
  result: {
    id: number;
    input: string;
    expected: string;
    actual: string;
    status: 'passed' | 'failed';
    points: number;
  };
}

export const TestCaseResult: React.FC<TestResultProps> = ({ result }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          {result.status === 'passed' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="text-gray-900">
            Test Case {result.id} 
            {result.input === "Hidden" && " (Hidden)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={result.status === 'passed' ? 'text-green-600' : 'text-red-600'}>
            {result.status === 'passed' ? `+${result.points} points` : '0 points'}
          </span>
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-gray-200">
        <div className="p-4 space-y-4">
          {result.input !== "Hidden" && (
            <div>
              <div className="font-medium text-gray-700 mb-2">Input:</div>
              <pre className="p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800">{result.input}</pre>
            </div>
          )}
          
          {result.expected !== "Hidden" && (
            <div>
              <div className="font-medium text-gray-700 mb-2">Expected Output:</div>
              <pre className="p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800">{result.expected}</pre>
            </div>
          )}
          
          {result.actual !== "Hidden" && result.status === 'failed' && (
            <div>
              <div className="font-medium text-gray-700 mb-2">Your Output:</div>
              <pre className="p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800">{result.actual}</pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
