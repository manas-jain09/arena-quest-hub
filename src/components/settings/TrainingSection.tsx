
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Training {
  id?: string;
  title: string;
  organization: string;
  description?: string;
  start_date: string;
  end_date?: string;
}

interface TrainingSectionProps {
  userId: string;
  trainings: Training[];
  setTrainings: (trainings: Training[]) => void;
}

export function TrainingSection({ userId, trainings, setTrainings }: TrainingSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Training>({
    title: '',
    organization: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      organization: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.organization.trim() || !formData.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('trainings')
          .update({
            title: formData.title,
            organization: formData.organization,
            description: formData.description || null,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) {
          toast.error('Failed to update training');
          return;
        }

        setTrainings(trainings.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
        toast.success('Training updated successfully');
      } else {
        const { data, error } = await supabase
          .from('trainings')
          .insert([{
            user_id: userId,
            title: formData.title,
            organization: formData.organization,
            description: formData.description || null,
            start_date: formData.start_date,
            end_date: formData.end_date || null
          }])
          .select()
          .single();

        if (error) {
          toast.error('Failed to add training');
          return;
        }

        setTrainings([...trainings, data]);
        toast.success('Training added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Error saving training');
    }
  };

  const handleEdit = (training: Training) => {
    setFormData(training);
    setEditingId(training.id!);
    setIsAdding(true);
  };

  const handleDelete = async (trainingId: string) => {
    try {
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', trainingId);

      if (error) {
        toast.error('Failed to delete training');
        return;
      }

      setTrainings(trainings.filter(t => t.id !== trainingId));
      toast.success('Training deleted successfully');
    } catch (error) {
      toast.error('Error deleting training');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Training & Courses</h4>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-arena-red hover:bg-arena-darkRed"
        >
          <Plus size={16} className="mr-1" />
          Add Training
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="training-title">Title *</Label>
              <Input
                id="training-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Training/Course title"
              />
            </div>
            <div>
              <Label htmlFor="training-org">Organization *</Label>
              <Input
                id="training-org"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Organization/Institution"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="training-description">Description</Label>
            <Textarea
              id="training-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you learned"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="training-start">Start Date *</Label>
              <Input
                id="training-start"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="training-end">End Date</Label>
              <Input
                id="training-end"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              {editingId ? 'Update' : 'Save'} Training
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {trainings.map((training) => (
          <div key={training.id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h5 className="font-medium">{training.title}</h5>
                <p className="text-sm font-medium text-gray-700">{training.organization}</p>
                {training.description && (
                  <p className="text-sm text-gray-600 mt-2">{training.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar size={12} />
                  {training.start_date} - {training.end_date || 'Present'}
                </div>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(training)} size="sm" variant="outline">
                  <Edit2 size={14} />
                </Button>
                <Button onClick={() => handleDelete(training.id!)} size="sm" variant="destructive">
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
