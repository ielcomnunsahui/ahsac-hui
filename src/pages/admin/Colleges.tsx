import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Building2, GraduationCap, BookOpen, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  faculty_id: string;
}

interface Faculty {
  id: string;
  name: string;
  college_id: string | null;
  departments: Department[];
}

interface College {
  id: string;
  name: string;
  faculties: Faculty[];
}

const Colleges = () => {
  const queryClient = useQueryClient();
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  
  // Form states
  const [collegeName, setCollegeName] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ["colleges-full"],
    queryFn: async () => {
      const { data: collegesData, error: collegesError } = await supabase
        .from("colleges")
        .select("*")
        .order("display_order");
      if (collegesError) throw collegesError;

      const { data: facultiesData, error: facultiesError } = await supabase
        .from("faculties")
        .select("*")
        .order("display_order");
      if (facultiesError) throw facultiesError;

      const { data: departmentsData, error: departmentsError } = await supabase
        .from("departments")
        .select("*")
        .order("display_order");
      if (departmentsError) throw departmentsError;

      // Build hierarchy
      return collegesData.map((college) => ({
        ...college,
        faculties: facultiesData
          .filter((f) => f.college_id === college.id)
          .map((faculty) => ({
            ...faculty,
            departments: departmentsData.filter((d) => d.faculty_id === faculty.id),
          })),
      })) as College[];
    },
  });

  // Mutations
  const addCollegeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("colleges").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setIsAddCollegeOpen(false);
      setCollegeName("");
      toast.success("College added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateCollegeMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("colleges").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setEditingCollege(null);
      toast.success("College updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteCollegeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("colleges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      toast.success("College deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addFacultyMutation = useMutation({
    mutationFn: async ({ name, collegeId }: { name: string; collegeId: string }) => {
      const { error } = await supabase.from("faculties").insert({ name, college_id: collegeId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setIsAddFacultyOpen(false);
      setFacultyName("");
      setSelectedCollegeId(null);
      toast.success("Faculty added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateFacultyMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("faculties").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setEditingFaculty(null);
      toast.success("Faculty updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faculties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      toast.success("Faculty deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addDepartmentMutation = useMutation({
    mutationFn: async ({ name, facultyId }: { name: string; facultyId: string }) => {
      const { error } = await supabase.from("departments").insert({ name, faculty_id: facultyId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setIsAddDepartmentOpen(false);
      setDepartmentName("");
      setSelectedFacultyId(null);
      toast.success("Department added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("departments").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      setEditingDepartment(null);
      toast.success("Department updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("departments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges-full"] });
      toast.success("Department deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <Helmet>
        <title>Colleges & Departments | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold">Colleges & Departments</h1>
              <p className="text-muted-foreground">Manage academic structure hierarchy</p>
            </div>
            <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add College
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add College</DialogTitle>
                  <DialogDescription>Create a new college to organize faculties.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>College Name</Label>
                    <Input
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g., College of Health Sciences"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCollegeOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => addCollegeMutation.mutate(collegeName)}
                    disabled={!collegeName.trim() || addCollegeMutation.isPending}
                  >
                    {addCollegeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add College
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : colleges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No colleges added yet</p>
                <Button onClick={() => setIsAddCollegeOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First College
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {colleges.map((college) => (
                <AccordionItem key={college.id} value={college.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{college.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({college.faculties.length} faculties)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex gap-2 flex-wrap">
                        {/* Edit College */}
                        <Dialog 
                          open={editingCollege?.id === college.id} 
                          onOpenChange={(open) => !open && setEditingCollege(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingCollege(college)}>
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit College</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>College Name</Label>
                                <Input
                                  value={editingCollege?.name || ""}
                                  onChange={(e) => setEditingCollege(prev => prev ? {...prev, name: e.target.value} : null)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingCollege(null)}>Cancel</Button>
                              <Button 
                                onClick={() => editingCollege && updateCollegeMutation.mutate({ id: editingCollege.id, name: editingCollege.name })}
                                disabled={updateCollegeMutation.isPending}
                              >
                                Save
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Add Faculty */}
                        <Dialog 
                          open={isAddFacultyOpen && selectedCollegeId === college.id} 
                          onOpenChange={(open) => {
                            setIsAddFacultyOpen(open);
                            if (!open) setSelectedCollegeId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCollegeId(college.id)}>
                              <Plus className="h-3 w-3 mr-1" />
                              Add Faculty
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Faculty to {college.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Faculty Name</Label>
                                <Input
                                  value={facultyName}
                                  onChange={(e) => setFacultyName(e.target.value)}
                                  placeholder="e.g., Faculty of Clinical Sciences"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddFacultyOpen(false)}>Cancel</Button>
                              <Button 
                                onClick={() => addFacultyMutation.mutate({ name: facultyName, collegeId: college.id })}
                                disabled={!facultyName.trim() || addFacultyMutation.isPending}
                              >
                                Add Faculty
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete College */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete College?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete {college.name} and all its faculties and departments. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCollegeMutation.mutate(college.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {/* Faculties */}
                      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                        {college.faculties.map((faculty) => (
                          <Card key={faculty.id} className="bg-muted/50">
                            <CardHeader className="py-3 px-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-primary" />
                                  <CardTitle className="text-base">{faculty.name}</CardTitle>
                                  <span className="text-xs text-muted-foreground">
                                    ({faculty.departments.length} depts)
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  {/* Edit Faculty */}
                                  <Dialog 
                                    open={editingFaculty?.id === faculty.id} 
                                    onOpenChange={(open) => !open && setEditingFaculty(null)}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingFaculty(faculty)}>
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Faculty</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label>Faculty Name</Label>
                                          <Input
                                            value={editingFaculty?.name || ""}
                                            onChange={(e) => setEditingFaculty(prev => prev ? {...prev, name: e.target.value} : null)}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setEditingFaculty(null)}>Cancel</Button>
                                        <Button 
                                          onClick={() => editingFaculty && updateFacultyMutation.mutate({ id: editingFaculty.id, name: editingFaculty.name })}
                                        >
                                          Save
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  {/* Add Department */}
                                  <Dialog 
                                    open={isAddDepartmentOpen && selectedFacultyId === faculty.id} 
                                    onOpenChange={(open) => {
                                      setIsAddDepartmentOpen(open);
                                      if (!open) setSelectedFacultyId(null);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedFacultyId(faculty.id)}>
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add Department</DialogTitle>
                                        <DialogDescription>Add a department to {faculty.name}</DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label>Department Name</Label>
                                          <Input
                                            value={departmentName}
                                            onChange={(e) => setDepartmentName(e.target.value)}
                                            placeholder="e.g., Department of Medicine"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>Cancel</Button>
                                        <Button 
                                          onClick={() => addDepartmentMutation.mutate({ name: departmentName, facultyId: faculty.id })}
                                          disabled={!departmentName.trim()}
                                        >
                                          Add Department
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  {/* Delete Faculty */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Faculty?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will delete {faculty.name} and all its departments.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteFacultyMutation.mutate(faculty.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardHeader>
                            {faculty.departments.length > 0 && (
                              <CardContent className="pt-0 pb-3 px-4">
                                <div className="space-y-1 pl-4 border-l border-border">
                                  {faculty.departments.map((dept) => (
                                    <div key={dept.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-background group">
                                      <div className="flex items-center gap-2">
                                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm">{dept.name}</span>
                                      </div>
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Dialog 
                                          open={editingDepartment?.id === dept.id} 
                                          onOpenChange={(open) => !open && setEditingDepartment(null)}
                                        >
                                          <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingDepartment(dept)}>
                                              <Pencil className="h-2.5 w-2.5" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Edit Department</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                              <div className="space-y-2">
                                                <Label>Department Name</Label>
                                                <Input
                                                  value={editingDepartment?.name || ""}
                                                  onChange={(e) => setEditingDepartment(prev => prev ? {...prev, name: e.target.value} : null)}
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button variant="outline" onClick={() => setEditingDepartment(null)}>Cancel</Button>
                                              <Button 
                                                onClick={() => editingDepartment && updateDepartmentMutation.mutate({ id: editingDepartment.id, name: editingDepartment.name })}
                                              >
                                                Save
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                                              <Trash2 className="h-2.5 w-2.5" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Department?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This will delete {dept.name}. This cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => deleteDepartmentMutation.mutate(dept.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Colleges;
