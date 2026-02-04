import { useEffect, useState, useCallback } from "react";
import SEO from "@/components/SEO";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Edit, Trash2, Loader2, User, Twitter, Linkedin, Facebook, Globe, Mail } from "lucide-react";

interface FoundingMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  bio: string | null;
  display_order: number;
  twitter_handle: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  email: string | null;
  website_url: string | null;
}

interface MemberFormData {
  name: string;
  role: string;
  image_url: string;
  bio: string;
  display_order: number;
  twitter_handle: string;
  linkedin_url: string;
  facebook_url: string;
  email: string;
  website_url: string;
}

const emptyMember: MemberFormData = {
  name: '',
  role: '',
  image_url: '',
  bio: '',
  display_order: 0,
  twitter_handle: '',
  linkedin_url: '',
  facebook_url: '',
  email: '',
  website_url: '',
};

const ROLE_SUGGESTIONS = [
  "President",
  "Vice President",
  "Secretary General",
  "Financial Secretary",
  "Treasurer",
  "Public Relations Officer",
  "Director of Programs",
  "Director of Welfare",
  "Director of Socials",
  "Auditor",
  "Legal Adviser",
  "Patron",
  "Adviser",
];

const FoundingMembers = () => {
  const [members, setMembers] = useState<FoundingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<MemberFormData>(emptyMember);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleInputChange = useCallback((field: keyof MemberFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.role.trim()) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('founding_members')
        .insert({
          name: formData.name,
          role: formData.role,
          image_url: formData.image_url || null,
          bio: formData.bio || null,
          display_order: formData.display_order,
          twitter_handle: formData.twitter_handle || null,
          linkedin_url: formData.linkedin_url || null,
          facebook_url: formData.facebook_url || null,
          email: formData.email || null,
          website_url: formData.website_url || null,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Founding member added successfully" });
      setFormData(emptyMember);
      setIsAddDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('founding_members')
        .update({
          name: formData.name,
          role: formData.role,
          image_url: formData.image_url || null,
          bio: formData.bio || null,
          display_order: formData.display_order,
          twitter_handle: formData.twitter_handle || null,
          linkedin_url: formData.linkedin_url || null,
          facebook_url: formData.facebook_url || null,
          email: formData.email || null,
          website_url: formData.website_url || null,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({ title: "Success", description: "Founding member updated successfully" });
      setIsEditDialogOpen(false);
      setEditingId(null);
      setFormData(emptyMember);
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

  const openEditDialog = (member: FoundingMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      image_url: member.image_url || '',
      bio: member.bio || '',
      display_order: member.display_order,
      twitter_handle: member.twitter_handle || '',
      linkedin_url: member.linkedin_url || '',
      facebook_url: member.facebook_url || '',
      email: member.email || '',
      website_url: member.website_url || '',
    });
    setIsEditDialogOpen(true);
  };

  const renderFormContent = (isEdit: boolean) => (
    <ScrollArea className="max-h-[70vh]">
      <div className="space-y-6 p-1" onClick={(e) => e.stopPropagation()}>
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center">
          <ImageUpload
            currentUrl={formData.image_url}
            onUpload={(url) => handleInputChange('image_url', url)}
            folder="founding-members"
            label="Profile Photo"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Upload a clear headshot for best results
          </p>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor={`name-${isEdit ? 'edit' : 'add'}`}>Full Name *</Label>
            <Input
              id={`name-${isEdit ? 'edit' : 'add'}`}
              value={formData.name}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('name', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`role-${isEdit ? 'edit' : 'add'}`}>Role / Position *</Label>
            <Input
              id={`role-${isEdit ? 'edit' : 'add'}`}
              value={formData.role}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('role', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="e.g., President"
              list={`role-suggestions-${isEdit ? 'edit' : 'add'}`}
            />
            <datalist id={`role-suggestions-${isEdit ? 'edit' : 'add'}`}>
              {ROLE_SUGGESTIONS.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-1 mt-2">
              {ROLE_SUGGESTIONS.slice(0, 5).map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInputChange('role', role);
                  }}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Biography */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Biography
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor={`bio-${isEdit ? 'edit' : 'add'}`}>About (Optional)</Label>
            <Textarea
              id={`bio-${isEdit ? 'edit' : 'add'}`}
              value={formData.bio}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('bio', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="Write a short bio about this member. Include their achievements, interests, or contributions to AHSAC..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        <Separator />

        {/* Social Media Links */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Social Media & Contact
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor={`email-${isEdit ? 'edit' : 'add'}`} className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              id={`email-${isEdit ? 'edit' : 'add'}`}
              type="email"
              value={formData.email}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('email', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="member@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`twitter-${isEdit ? 'edit' : 'add'}`} className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> X (Twitter) Handle
            </Label>
            <Input
              id={`twitter-${isEdit ? 'edit' : 'add'}`}
              value={formData.twitter_handle}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('twitter_handle', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="@username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`linkedin-${isEdit ? 'edit' : 'add'}`} className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn URL
            </Label>
            <Input
              id={`linkedin-${isEdit ? 'edit' : 'add'}`}
              value={formData.linkedin_url}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('linkedin_url', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`facebook-${isEdit ? 'edit' : 'add'}`} className="flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Facebook URL
            </Label>
            <Input
              id={`facebook-${isEdit ? 'edit' : 'add'}`}
              value={formData.facebook_url}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('facebook_url', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="https://facebook.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`website-${isEdit ? 'edit' : 'add'}`} className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website
            </Label>
            <Input
              id={`website-${isEdit ? 'edit' : 'add'}`}
              value={formData.website_url}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('website_url', e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <Separator />

        {/* Display Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Display Settings
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor={`display_order-${isEdit ? 'edit' : 'add'}`}>Display Order</Label>
            <Input
              id={`display_order-${isEdit ? 'edit' : 'add'}`}
              type="number"
              value={formData.display_order}
              onChange={(e) => {
                e.stopPropagation();
                handleInputChange('display_order', parseInt(e.target.value) || 0);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first. Use 0 for top priority.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            isEdit ? handleUpdate() : handleAdd();
          }} 
          className="w-full" 
          disabled={isSaving || !formData.name.trim() || !formData.role.trim()}
          size="lg"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isEdit ? 'Save Changes' : 'Add Founding Member'}
        </Button>
      </div>
    </ScrollArea>
  );

  return (
    <>
      <SEO 
        title="Founding Members | AHSAC Admin"
        description="Manage founding members displayed on the website."
        path="/admin/founding-members"
        noindex
      />
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Founding Members</h1>
              <p className="text-muted-foreground">Manage founding members displayed on the website</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) setFormData(emptyMember);
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Founding Member</DialogTitle>
                  <DialogDescription>
                    Add a new founding member to showcase on the website's team section.
                  </DialogDescription>
                </DialogHeader>
                {renderFormContent(false)}
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Founding Members Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding the founding members of AHSAC to showcase them on your website.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="relative">
                    {member.image_url ? (
                      <div className="aspect-square">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                        #{member.display_order + 1}
                      </span>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
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

          {/* Edit Dialog - Separate from the grid to prevent re-renders */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData(emptyMember);
            }
          }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Founding Member</DialogTitle>
                <DialogDescription>
                  Update the details for this founding member.
                </DialogDescription>
              </DialogHeader>
              {renderFormContent(true)}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </>
  );
};

export default FoundingMembers;
