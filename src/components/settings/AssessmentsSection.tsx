
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit2, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Assessment {
  id?: string;
  title: string;
  provider: string;
  score: string;
  max_score: string;
  assessment_date: string;
  certificate_url?: string;
}

interface AssessmentsSectionProps {
  userId: string;
  assessments: Assessment[];
  setAssessments: (assessments: Assessment[]) => void;
}

export function AssessmentsSection({ userId, assessments, setAssessments }: AssessmentsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Assessment>({
    title: '',
    provider: '',
    score: '',
    max_score: '',
    assessment_date: '',
    certificate_url: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      provider: '',
      score: '',
      max_score: '',
      assessment_date: '',
      certificate_url: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.provider.trim() || !formData.score.trim() || !formData.assessment_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('assessments')
          .update({
            title: formData.title,
            provider: formData.provider,
            score: formData.score,
            max_score: formData.max_score,
            assessment_date: formData.assessment_date,
            certificate_url: formData.certificate_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) {
          toast.error('Failed to update assessment');
          return;
        }

        setAssessments(assessments.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
        toast.success('Assessment updated successfully');
      } else {
        const { data, error } = await supabase
          .from('assessments')
          .insert([{
            user_id: userId,
            title: formData.title,
            provider: formData.provider,
            score: formData.score,
            max_score: formData.max_score,
            assessment_date: formData.assessment_date,
            certificate_url: formData.certificate_url || null
          }])
          .select()
          .single();

        if (error) {
          toast.error('Failed to add assessment');
          return;
        }

        setAssessments([...assessments, data]);
        toast.success('Assessment added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Error saving assessment');
    }
  };

  const handleEdit = (assessment: Assessment) => {
    setFormData(assessment);
    setEditingId(assessment.id!);
    setIsAdding(true);
  };

  const handleDelete = async (assessmentId: string) => {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) {
        toast.error('Failed to delete assessment');
        return;
      }

      setAssessments(assessments.filter(a => a.id !== assessmentId));
      toast.success('Assessment deleted successfully');
    } catch (error) {
      toast.error('Error deleting assessment');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Assessments & Tests</h4>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-arena-red hover:bg-arena-darkRed"
        >
          <Plus size={16} className="mr-1" />
          Add Assessment
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessment-title">Title *</Label>
              <Input
                id="assessment-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Assessment/Test title"
              />
            </div>
            <div>
              <Label htmlFor="assessment-provider">Provider *</Label>
              <Input
                id="assessment-provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="Organization/Platform"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="assessment-score">Score *</Label>
              <Input
                id="assessment-score"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="85"
              />
            </div>
            <div>
              <Label htmlFor="assessment-max">Max Score</Label>
              <Input
                id="assessment-max"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="assessment-date">Date *</Label>
              <Input
                id="assessment-date"
                type="date"
                value={formData.assessment_date}
                onChange={(e) => setFormData({ ...formData, assessment_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assessment-cert-url">Certificate URL</Label>
            <Input
              id="assessment-cert-url"
              value={formData.certificate_url}
              onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              {editingId ? 'Update' : 'Save'} Assessment
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h5 className="font-medium">{assessment.title}</h5>
                <p className="text-sm font-medium text-gray-700">{assessment.provider}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Score: {assessment.score}{assessment.max_score && `/${assessment.max_score}`}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {assessment.assessment_date}
                  </div>
                </div>
                {assessment.certificate_url && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                    <ExternalLink size={12} />
                    <a href={assessment.certificate_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(assessment)} size="sm" variant="outline">
                  <Edit2 size={14} />
                </Button>
                <Button onClick={() => handleDelete(assessment.id!)} size="sm" variant="destructive">
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
