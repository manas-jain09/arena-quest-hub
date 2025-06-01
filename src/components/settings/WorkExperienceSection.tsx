
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit2, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkExperience {
  id?: string;
  position: string;
  company: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  technologies: string[];
}

interface WorkExperienceSectionProps {
  userId: string;
  workExperience: WorkExperience[];
  setWorkExperience: (workExp: WorkExperience[]) => void;
}

export function WorkExperienceSection({ userId, workExperience, setWorkExperience }: WorkExperienceSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkExperience>({
    position: '',
    company: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    technologies: []
  });

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      technologies: []
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.position.trim() || !formData.company.trim() || !formData.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('work_experience')
          .update({
            position: formData.position,
            company: formData.company,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            location: formData.location || null,
            technologies: formData.technologies,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) {
          toast.error('Failed to update work experience');
          return;
        }

        setWorkExperience(workExperience.map(w => w.id === editingId ? { ...formData, id: editingId } : w));
        toast.success('Work experience updated successfully');
      } else {
        const { data, error } = await supabase
          .from('work_experience')
          .insert([{
            user_id: userId,
            position: formData.position,
            company: formData.company,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            location: formData.location || null,
            technologies: formData.technologies
          }])
          .select()
          .single();

        if (error) {
          toast.error('Failed to add work experience');
          return;
        }

        setWorkExperience([...workExperience, data]);
        toast.success('Work experience added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Error saving work experience');
    }
  };

  const handleEdit = (workExp: WorkExperience) => {
    setFormData(workExp);
    setEditingId(workExp.id!);
    setIsAdding(true);
  };

  const handleDelete = async (workId: string) => {
    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', workId);

      if (error) {
        toast.error('Failed to delete work experience');
        return;
      }

      setWorkExperience(workExperience.filter(w => w.id !== workId));
      toast.success('Work experience deleted successfully');
    } catch (error) {
      toast.error('Error deleting work experience');
    }
  };

  const addTechnology = (tech: string) => {
    if (tech.trim() && !formData.technologies.includes(tech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tech.trim()]
      });
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Work Experience</h4>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-arena-red hover:bg-arena-darkRed"
        >
          <Plus size={16} className="mr-1" />
          Add Experience
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work-position">Position *</Label>
              <Input
                id="work-position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="work-company">Company *</Label>
              <Input
                id="work-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="work-location">Location</Label>
            <Input
              id="work-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          <div>
            <Label htmlFor="work-description">Description</Label>
            <Textarea
              id="work-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work-start">Start Date *</Label>
              <Input
                id="work-start"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="work-end">End Date</Label>
              <Input
                id="work-end"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Technologies Used</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add technology (press Enter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTechnology((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {tech}
                  <button onClick={() => removeTechnology(index)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              {editingId ? 'Update' : 'Save'} Experience
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workExperience.map((work) => (
          <div key={work.id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h5 className="font-medium">{work.position}</h5>
                <p className="text-sm font-medium text-gray-700">{work.company}</p>
                {work.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} />
                    {work.location}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">{work.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar size={12} />
                  {work.start_date} - {work.end_date || 'Present'}
                </div>
                {work.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {work.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(work)} size="sm" variant="outline">
                  <Edit2 size={14} />
                </Button>
                <Button onClick={() => handleDelete(work.id!)} size="sm" variant="destructive">
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
