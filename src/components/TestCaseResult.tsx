
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
      className="border border-[#2D3548] rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-[#252B3B] hover:bg-[#2D3548] transition-colors">
        <div className="flex items-center gap-2">
          {result.status === 'passed' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="text-gray-200">
            Test Case {result.id} 
            {result.input === "Hidden" && " (Hidden)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={result.status === 'passed' ? 'text-green-400' : 'text-red-400'}>
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
      <CollapsibleContent className="border-t border-[#2D3548] bg-[#1A1F2C]">
        <div className="p-3 space-y-2 text-sm">
          {result.input !== "Hidden" && (
            <div>
              <div className="font-medium text-gray-400">Input:</div>
              <pre className="mt-1 p-2 bg-[#252B3B] rounded overflow-x-auto text-gray-300 font-mono">{result.input}</pre>
            </div>
          )}
          
          {result.expected !== "Hidden" && (
            <div>
              <div className="font-medium text-gray-400">Expected Output:</div>
              <pre className="mt-1 p-2 bg-[#252B3B] rounded overflow-x-auto text-gray-300 font-mono">{result.expected}</pre>
            </div>
          )}
          
          {result.actual !== "Hidden" && result.status === 'failed' && (
            <div>
              <div className="font-medium text-gray-400">Your Output:</div>
              <pre className="mt-1 p-2 bg-[#252B3B] rounded overflow-x-auto text-gray-300 font-mono">{result.actual}</pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
