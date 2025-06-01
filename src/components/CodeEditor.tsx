
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Send } from 'lucide-react';
import { LanguageTemplate } from '@/types/coding';

interface CodeEditorProps {
  templates: LanguageTemplate[];
  onRunCode: (code: string, language: string) => void;
  onSubmitCode: (code: string, language: string) => void;
}

export function CodeEditor({ templates, onRunCode, onSubmitCode }: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');

  const currentTemplate = templates.find(t => t.language === selectedLanguage);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const template = templates.find(t => t.language === language);
    if (template) {
      setCode(template.template_code);
    }
  };

  const handleRun = () => {
    onRunCode(code, selectedLanguage);
  };

  const handleSubmit = () => {
    onSubmitCode(code, selectedLanguage);
  };

  // Initialize code with template when component mounts
  if (code === '' && currentTemplate) {
    setCode(currentTemplate.template_code);
  }

  const languageLabels: Record<string, string> = {
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C'
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.language} value={template.language}>
                    {languageLabels[template.language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRun}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmit}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-96 p-4 font-mono text-sm border-none resize-none focus:outline-none bg-gray-50"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </CardContent>
    </Card>
  );
}
