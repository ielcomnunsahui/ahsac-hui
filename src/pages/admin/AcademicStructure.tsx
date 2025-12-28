import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
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

const AcademicStructure = () => {
  const queryClient = useQueryClient();
  
  // Dialog states
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
  const [facultyCollegeId, setFacultyCollegeId] = useState<string>("standalone");
  const [departmentName, setDepartmentName] = useState("");

  // Fetch all data
  const { data: colleges = [], isLoading: loadingColleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("colleges").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: faculties = [], isLoading: loadingFaculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faculties").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = loadingColleges || loadingFaculties || loadingDepartments;

  // Build hierarchy
  const standaloneFaculties = faculties.filter(f => !f.college_id);
  const collegesWithFaculties = colleges.map(college => ({
    ...college,
    faculties: faculties
      .filter(f => f.college_id === college.id)
      .map(faculty => ({
        ...faculty,
        departments: departments.filter(d => d.faculty_id === faculty.id),
      })),
  }));

  const standaloneFacultiesWithDepartments = standaloneFaculties.map(faculty => ({
    ...faculty,
    departments: departments.filter(d => d.faculty_id === faculty.id),
  }));

  // College mutations
  const addCollegeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("colleges").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges"] });
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
      queryClient.invalidateQueries({ queryKey: ["colleges"] });
      setEditingCollege(null);
      toast.success("College updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteCollegeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("colleges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges"] });
      toast.success("College deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Faculty mutations
  const addFacultyMutation = useMutation({
    mutationFn: async ({ name, collegeId }: { name: string; collegeId: string | null }) => {
      const { error } = await supabase.from("faculties").insert({ 
        name, 
        college_id: collegeId 
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      setIsAddFacultyOpen(false);
      setFacultyName("");
      setFacultyCollegeId("standalone");
      setSelectedCollegeId(null);
      toast.success("Faculty added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateFacultyMutation = useMutation({
    mutationFn: async ({ id, name, collegeId }: { id: string; name: string; collegeId: string | null }) => {
      const { error } = await supabase.from("faculties").update({ name, college_id: collegeId }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      setEditingFaculty(null);
      toast.success("Faculty updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faculties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      toast.success("Faculty deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Department mutations
  const addDepartmentMutation = useMutation({
    mutationFn: async ({ name, facultyId }: { name: string; facultyId: string }) => {
      const { error } = await supabase.from("departments").insert({ name, faculty_id: facultyId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
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
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setEditingDepartment(null);
      toast.success("Department updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("departments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const FacultyCard = ({ faculty, showCollegeBadge = false }: { faculty: Faculty & { departments: Department[] }, showCollegeBadge?: boolean }) => (
    <Card className="bg-muted/50">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <GraduationCap className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">{faculty.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {faculty.departments.length} dept{faculty.departments.length !== 1 ? 's' : ''}
            </Badge>
            {showCollegeBadge && !faculty.college_id && (
              <Badge variant="outline" className="text-xs">Standalone</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingFaculty(faculty)}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Faculty</DialogTitle>
                </DialogHeader>
                {editingFaculty?.id === faculty.id && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Faculty Name</Label>
                      <Input
                        value={editingFaculty.name}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>College (Optional)</Label>
                      <Select
                        value={editingFaculty.college_id || "standalone"}
                        onValueChange={(v) => setEditingFaculty({ ...editingFaculty, college_id: v === "standalone" ? null : v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standalone">Standalone Faculty</SelectItem>
                          {colleges.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingFaculty(null)}>Cancel</Button>
                      <Button 
                        onClick={() => updateFacultyMutation.mutate({ 
                          id: editingFaculty.id, 
                          name: editingFaculty.name,
                          collegeId: editingFaculty.college_id 
                        })}
                        disabled={updateFacultyMutation.isPending}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDepartmentOpen && selectedFacultyId === faculty.id} onOpenChange={(open) => {
              setIsAddDepartmentOpen(open);
              if (!open) setSelectedFacultyId(null);
            }}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedFacultyId(faculty.id)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Department to {faculty.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Department Name</Label>
                    <Input
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => addDepartmentMutation.mutate({ name: departmentName, facultyId: faculty.id })}
                    disabled={!departmentName.trim() || addDepartmentMutation.isPending}
                  >
                    Add Department
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
          <div className="flex flex-wrap gap-2">
            {faculty.departments.map((dept) => (
              <Badge key={dept.id} variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {dept.name}
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="ml-1 hover:text-primary"
                      onClick={() => setEditingDepartment(dept)}
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>
                    {editingDepartment?.id === dept.id && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Department Name</Label>
                          <Input
                            value={editingDepartment.name}
                            onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingDepartment(null)}>Cancel</Button>
                          <Button 
                            onClick={() => updateDepartmentMutation.mutate({ id: editingDepartment.id, name: editingDepartment.name })}
                            disabled={updateDepartmentMutation.isPending}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="ml-1 hover:text-destructive">
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Department?</AlertDialogTitle>
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
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Academic Structure | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Academic Structure</h1>
              <p className="text-muted-foreground">Manage colleges, faculties & departments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add College
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add College</DialogTitle>
                    <DialogDescription>Colleges group multiple faculties together.</DialogDescription>
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
                      {addCollegeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Add College
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddFacultyOpen} onOpenChange={setIsAddFacultyOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Faculty
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Faculty</DialogTitle>
                    <DialogDescription>Faculties can be standalone or under a college.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Faculty Name</Label>
                      <Input
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                        placeholder="e.g., Faculty of Law"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Under College (Optional)</Label>
                      <Select value={facultyCollegeId} onValueChange={setFacultyCollegeId}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standalone">Standalone Faculty</SelectItem>
                          {colleges.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Leave as "Standalone" for faculties like Law, Management Sciences, etc.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFacultyOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={() => addFacultyMutation.mutate({ 
                        name: facultyName, 
                        collegeId: facultyCollegeId === "standalone" ? null : facultyCollegeId 
                      })}
                      disabled={!facultyName.trim() || addFacultyMutation.isPending}
                    >
                      {addFacultyMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Add Faculty
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="standalone" className="space-y-6">
              <TabsList>
                <TabsTrigger value="standalone">
                  Standalone Faculties ({standaloneFacultiesWithDepartments.length})
                </TabsTrigger>
                <TabsTrigger value="colleges">
                  Colleges ({collegesWithFaculties.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="standalone" className="space-y-4">
                {standaloneFacultiesWithDepartments.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No standalone faculties yet</p>
                      <Button onClick={() => setIsAddFacultyOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Faculty
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {standaloneFacultiesWithDepartments.map((faculty) => (
                      <FacultyCard key={faculty.id} faculty={faculty} showCollegeBadge />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="colleges" className="space-y-4">
                {collegesWithFaculties.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No colleges added yet</p>
                      <Button onClick={() => setIsAddCollegeOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add College
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {collegesWithFaculties.map((college) => (
                      <AccordionItem key={college.id} value={college.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{college.name}</span>
                            <Badge variant="secondary">
                              {college.faculties.length} faculties
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                          <div className="flex gap-2 flex-wrap">
                            <Dialog open={editingCollege?.id === college.id} onOpenChange={(open) => !open && setEditingCollege(null)}>
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

                            <Dialog open={isAddFacultyOpen && selectedCollegeId === college.id} onOpenChange={(open) => {
                              if (open) {
                                setSelectedCollegeId(college.id);
                                setFacultyCollegeId(college.id);
                              } else {
                                setSelectedCollegeId(null);
                              }
                              setIsAddFacultyOpen(open);
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Faculty
                                </Button>
                              </DialogTrigger>
                            </Dialog>

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
                                    This will delete {college.name} and all its faculties and departments.
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

                          <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                            {college.faculties.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">No faculties in this college yet</p>
                            ) : (
                              college.faculties.map((faculty) => (
                                <FacultyCard key={faculty.id} faculty={faculty} />
                              ))
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AcademicStructure;
