
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit2, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
}

interface CertificatesSectionProps {
  userId: string;
  certificates: Certificate[];
  setCertificates: (certificates: Certificate[]) => void;
}

export function CertificatesSection({ userId, certificates, setCertificates }: CertificatesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Certificate>({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_url: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_url: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issue_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('certificates')
          .update({
            title: formData.title,
            issuer: formData.issuer,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            credential_url: formData.credential_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) {
          toast.error('Failed to update certificate');
          return;
        }

        setCertificates(certificates.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
        toast.success('Certificate updated successfully');
      } else {
        const { data, error } = await supabase
          .from('certificates')
          .insert([{
            user_id: userId,
            title: formData.title,
            issuer: formData.issuer,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            credential_url: formData.credential_url || null
          }])
          .select()
          .single();

        if (error) {
          toast.error('Failed to add certificate');
          return;
        }

        setCertificates([...certificates, data]);
        toast.success('Certificate added successfully');
      }

      resetForm();
    } catch (error) {
      toast.error('Error saving certificate');
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData(certificate);
    setEditingId(certificate.id!);
    setIsAdding(true);
  };

  const handleDelete = async (certificateId: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateId);

      if (error) {
        toast.error('Failed to delete certificate');
        return;
      }

      setCertificates(certificates.filter(c => c.id !== certificateId));
      toast.success('Certificate deleted successfully');
    } catch (error) {
      toast.error('Error deleting certificate');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Certifications</h4>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-arena-red hover:bg-arena-darkRed"
        >
          <Plus size={16} className="mr-1" />
          Add Certificate
        </Button>
      </div>

      {isAdding && (
        <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cert-title">Title *</Label>
              <Input
                id="cert-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Certificate title"
              />
            </div>
            <div>
              <Label htmlFor="cert-issuer">Issuer *</Label>
              <Input
                id="cert-issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="Issuing organization"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cert-issue">Issue Date *</Label>
              <Input
                id="cert-issue"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cert-expiry">Expiry Date</Label>
              <Input
                id="cert-expiry"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cert-url">Credential URL</Label>
            <Input
              id="cert-url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              {editingId ? 'Update' : 'Save'} Certificate
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h5 className="font-medium">{certificate.title}</h5>
                <p className="text-sm font-medium text-gray-700">{certificate.issuer}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    Issued: {certificate.issue_date}
                  </div>
                  {certificate.expiry_date && (
                    <div className="flex items-center gap-1">
                      Expires: {certificate.expiry_date}
                    </div>
                  )}
                </div>
                {certificate.credential_url && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                    <ExternalLink size={12} />
                    <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View Credential
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(certificate)} size="sm" variant="outline">
                  <Edit2 size={14} />
                </Button>
                <Button onClick={() => handleDelete(certificate.id!)} size="sm" variant="destructive">
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
