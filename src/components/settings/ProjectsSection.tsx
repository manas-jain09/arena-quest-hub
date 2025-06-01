
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit2, Calendar, Link, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  start_date: string;
  end_date?: string;
  project_url?: string;
  image_url?: string;
}

interface ProjectsSectionProps {
  userId: string;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export function ProjectsSection({ userId, projects, setProjects }: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    technologies: [],
    start_date: '',
    end_date: '',
    project_url: '',
    image_url: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      start_date: '',
      end_date: '',
      project_url: '',
      image_url: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            technologies: formData.technologies,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            project_url: formData.project_url || null,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) {
          toast.error('Failed to update project');
          return;
        }

        setProjects(projects.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
        toast.success('Project updated successfully');
      } else {
        // Add new project
        const { data, error } = await supabase
          .from('projects')
          .insert([{
            user_id: userId,
            title: formData.title,
            description: formData.description,
            technologies: formData.technologies,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            project_url: formData.project_url || null,
            image_url: formData.image_url || null
          }])
          .select()
          .single();

        if (error) {
          toast.error('Failed to add project');
          return;
        }

        setProjects([...projects, data]);
        toast.success('Project added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Error saving project');
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id!);
    setIsAdding(true);
  };

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        toast.error('Failed to delete project');
        return;
      }

      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Error deleting project');
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
        <h4 className="font-medium">Projects</h4>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-arena-red hover:bg-arena-darkRed"
        >
          <Plus size={16} className="mr-1" />
          Add Project
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-title">Title *</Label>
              <Input
                id="project-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div>
              <Label htmlFor="project-url">Project URL</Label>
              <Input
                id="project-url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project-description">Description *</Label>
            <Textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-start">Start Date *</Label>
              <Input
                id="project-start"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="project-end">End Date</Label>
              <Input
                id="project-end"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Technologies</Label>
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
              {editingId ? 'Update' : 'Save'} Project
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h5 className="font-medium">{project.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {project.start_date} - {project.end_date || 'Present'}
                  </div>
                  {project.project_url && (
                    <div className="flex items-center gap-1">
                      <Link size={12} />
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Project
                      </a>
                    </div>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(project)} size="sm" variant="outline">
                  <Edit2 size={14} />
                </Button>
                <Button onClick={() => handleDelete(project.id!)} size="sm" variant="destructive">
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
