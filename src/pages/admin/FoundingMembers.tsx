import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Loader2, User } from "lucide-react";

interface FoundingMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  bio: string | null;
  display_order: number;
}

const emptyMember: Omit<FoundingMember, 'id'> = {
  name: '',
  role: '',
  image_url: '',
  bio: '',
  display_order: 0,
};

const FoundingMembers = () => {
  const [members, setMembers] = useState<FoundingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState(emptyMember);
  const [editingMember, setEditingMember] = useState<FoundingMember | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching founding members:', error);
      toast({ title: "Error", description: "Failed to fetch founding members", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMember.name.trim() || !newMember.role.trim()) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('founding_members')
        .insert({
          name: newMember.name,
          role: newMember.role,
          image_url: newMember.image_url || null,
          bio: newMember.bio || null,
          display_order: newMember.display_order,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Founding member added successfully" });
      setNewMember(emptyMember);
      setIsAddDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMember) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('founding_members')
        .update({
          name: editingMember.name,
          role: editingMember.role,
          image_url: editingMember.image_url,
          bio: editingMember.bio,
          display_order: editingMember.display_order,
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      toast({ title: "Success", description: "Founding member updated successfully" });
      setIsEditDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this founding member?")) return;

    try {
      const { error } = await supabase.from('founding_members').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Founding member deleted successfully" });
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const MemberForm = ({ 
    member, 
    onChange, 
    onSubmit, 
    submitLabel 
  }: { 
    member: Omit<FoundingMember, 'id'> | FoundingMember; 
    onChange: (field: string, value: any) => void; 
    onSubmit: () => void; 
    submitLabel: string;
  }) => (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label>Name *</Label>
        <Input
          value={member.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Full name"
        />
      </div>
      <div className="space-y-2">
        <Label>Role *</Label>
        <Input
          value={member.role}
          onChange={(e) => onChange('role', e.target.value)}
          placeholder="e.g., President, Secretary"
        />
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={member.image_url || ''}
          onChange={(e) => onChange('image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={member.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Short biography..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Display Order</Label>
        <Input
          type="number"
          value={member.display_order}
          onChange={(e) => onChange('display_order', parseInt(e.target.value) || 0)}
        />
      </div>
      <Button onClick={onSubmit} className="w-full" disabled={isSaving}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Founding Members | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Founding Members</h1>
              <p className="text-muted-foreground">Manage founding members displayed on the website</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Founding Member</DialogTitle>
                </DialogHeader>
                <MemberForm
                  member={newMember}
                  onChange={(field, value) => setNewMember({ ...newMember, [field]: value })}
                  onSubmit={handleAdd}
                  submitLabel="Add Member"
                />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No founding members added yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                        <p className="text-sm text-primary">{member.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <Dialog open={isEditDialogOpen && editingMember?.id === member.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setEditingMember(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Founding Member</DialogTitle>
                          </DialogHeader>
                          {editingMember && (
                            <MemberForm
                              member={editingMember}
                              onChange={(field, value) => setEditingMember({ ...editingMember, [field]: value })}
                              onSubmit={handleUpdate}
                              submitLabel="Save Changes"
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default FoundingMembers;
