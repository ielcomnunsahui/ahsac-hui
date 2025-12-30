import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, Trash2, UserMinus, Loader2, GraduationCap, Download } from "lucide-react";

interface Member {
  id: string;
  full_name: string;
  matric_number: string;
  department: string;
  faculty_id: string | null;
  department_id: string | null;
  whatsapp_number: string;
  expected_graduation_year: number | null;
  user_id: string | null;
  faculties: { name: string } | null;
}

interface Alumni {
  id: string;
  full_name: string;
  matric_number: string;
  department: string;
  whatsapp_number: string | null;
  graduation_year: number | null;
  created_at: string;
}

const Alumni = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [showGraduateDialog, setShowGraduateDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const { data: alumni = [], isLoading: alumniLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alumni")
        .select("*")
        .order("graduation_year", { ascending: false });
      if (error) throw error;
      return data as Alumni[];
    },
  });

  const { data: graduatingMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ["graduating-members"],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from("members")
        .select("*, faculties(name)")
        .lte("expected_graduation_year", currentYear)
        .order("expected_graduation_year");
      if (error) throw error;
      return data as Member[];
    },
  });

  const graduateMutation = useMutation({
    mutationFn: async (member: Member) => {
      // Insert into alumni
      const { error: insertError } = await supabase.from("alumni").insert({
        full_name: member.full_name,
        matric_number: member.matric_number,
        department: member.department,
        faculty_id: member.faculty_id,
        department_id: member.department_id,
        whatsapp_number: member.whatsapp_number,
        graduation_year: member.expected_graduation_year || new Date().getFullYear(),
        user_id: member.user_id,
      });
      if (insertError) throw insertError;

      // Delete from members
      const { error: deleteError } = await supabase
        .from("members")
        .delete()
        .eq("id", member.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      queryClient.invalidateQueries({ queryKey: ["graduating-members"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setSelectedMember(null);
      toast.success("Member moved to alumni successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteAlumniMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alumni").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      toast.success("Alumni record deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const exportAlumni = () => {
    const csv = [
      ["Name", "Matric Number", "Department", "Graduation Year", "WhatsApp"].join(","),
      ...alumni.map((a) =>
        [a.full_name, a.matric_number, a.department, a.graduation_year || "", a.whatsapp_number || ""].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ahsac_alumni_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Alumni exported successfully");
  };

  const filteredAlumni = alumni.filter(
    (a) =>
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.matric_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGraduating = graduatingMembers.filter(
    (m) =>
      m.full_name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.matric_number.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Alumni | AHSAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Alumni Management</h1>
              <p className="text-muted-foreground">
                Manage graduated members ({alumni.length} alumni)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGraduateDialog(true)}>
                <UserMinus className="h-4 w-4 mr-2" />
                Graduate Members
              </Button>
              <Button variant="outline" onClick={exportAlumni}>
                <Download className="h-4 w-4 mr-2" />
                Export Alumni
              </Button>
            </div>
          </div>

          {/* Graduating Members Dialog */}
          <Dialog open={showGraduateDialog} onOpenChange={setShowGraduateDialog}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Graduate Members to Alumni</DialogTitle>
                <DialogDescription>
                  Select members who have graduated to move them to the alumni list.
                  Showing members with expected graduation year ≤ {new Date().getFullYear()}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                  {membersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredGraduating.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No graduating members found
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Matric</TableHead>
                          <TableHead>Graduation Year</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGraduating.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.full_name}</TableCell>
                            <TableCell>{member.matric_number}</TableCell>
                            <TableCell>{member.expected_graduation_year || "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <GraduationCap className="h-4 w-4 mr-1" />
                                    Graduate
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Move to Alumni?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will move {member.full_name} to the alumni list and remove them from active members.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => graduateMutation.mutate(member)}>
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGraduateDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Alumni List */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alumni..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {alumniLoading ? (
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
                        <TableHead>Department</TableHead>
                        <TableHead>Graduation Year</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlumni.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No alumni found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAlumni.map((alumnus) => (
                          <TableRow key={alumnus.id}>
                            <TableCell className="font-medium">{alumnus.full_name}</TableCell>
                            <TableCell>{alumnus.matric_number}</TableCell>
                            <TableCell>{alumnus.department}</TableCell>
                            <TableCell>{alumnus.graduation_year || "-"}</TableCell>
                            <TableCell>{alumnus.whatsapp_number || "-"}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Alumni Record?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete {alumnus.full_name}'s alumni record.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteAlumniMutation.mutate(alumnus.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

export default Alumni;
