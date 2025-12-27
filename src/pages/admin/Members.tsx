import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, Trash2, Download, Copy, Loader2 } from "lucide-react";

interface Member {
  id: string;
  full_name: string;
  matric_number: string;
  faculty_id: string | null;
  department: string;
  whatsapp_number: string;
  created_at: string;
  faculties: { name: string } | null;
}

interface Faculty {
  id: string;
  name: string;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    fetchFaculties();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*, faculties(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({ title: "Error", description: "Failed to fetch members", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    const { data } = await supabase.from('faculties').select('*').order('name');
    setFaculties(data || []);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('members')
        .update({
          full_name: editingMember.full_name,
          matric_number: editingMember.matric_number,
          faculty_id: editingMember.faculty_id,
          department: editingMember.department,
          whatsapp_number: editingMember.whatsapp_number,
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      toast({ title: "Success", description: "Member updated successfully" });
      setIsDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Member deleted successfully" });
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const exportWhatsAppNumbers = () => {
    const numbers = members.map((m) => m.whatsapp_number).join('\n');
    const blob = new Blob([numbers], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp_numbers.csv';
    a.click();
    toast({ title: "Exported", description: "WhatsApp numbers exported successfully" });
  };

  const copyNumbers = () => {
    const numbers = members.map((m) => m.whatsapp_number).join(', ');
    navigator.clipboard.writeText(numbers);
    toast({ title: "Copied", description: "WhatsApp numbers copied to clipboard" });
  };

  const filteredMembers = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.matric_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Members | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Members</h1>
              <p className="text-muted-foreground">Manage registered members</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyNumbers}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Numbers
              </Button>
              <Button variant="outline" onClick={exportWhatsAppNumbers}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Matric No.</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No members found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.full_name}</TableCell>
                            <TableCell>{member.matric_number}</TableCell>
                            <TableCell>{member.faculties?.name || '-'}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell>{member.whatsapp_number}</TableCell>
                            <TableCell>
                              {new Date(member.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog open={isDialogOpen && editingMember?.id === member.id} onOpenChange={(open) => {
                                  setIsDialogOpen(open);
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
                                      <DialogTitle>Edit Member</DialogTitle>
                                    </DialogHeader>
                                    {editingMember && (
                                      <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                          <Label>Full Name</Label>
                                          <Input
                                            value={editingMember.full_name}
                                            onChange={(e) =>
                                              setEditingMember({ ...editingMember, full_name: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Matric Number</Label>
                                          <Input
                                            value={editingMember.matric_number}
                                            onChange={(e) =>
                                              setEditingMember({ ...editingMember, matric_number: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Faculty</Label>
                                          <Select
                                            value={editingMember.faculty_id || ''}
                                            onValueChange={(value) =>
                                              setEditingMember({ ...editingMember, faculty_id: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select faculty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {faculties.map((f) => (
                                                <SelectItem key={f.id} value={f.id}>
                                                  {f.name}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Department</Label>
                                          <Input
                                            value={editingMember.department}
                                            onChange={(e) =>
                                              setEditingMember({ ...editingMember, department: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>WhatsApp Number</Label>
                                          <Input
                                            value={editingMember.whatsapp_number}
                                            onChange={(e) =>
                                              setEditingMember({ ...editingMember, whatsapp_number: e.target.value })
                                            }
                                          />
                                        </div>
                                        <Button onClick={handleUpdate} className="w-full" disabled={isSaving}>
                                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                          Save Changes
                                        </Button>
                                      </div>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default Members;
