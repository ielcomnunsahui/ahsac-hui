import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SEO } from "@/components/SEO";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, User, GraduationCap, Phone, Loader2, XCircle, Mail, Lock, Building2, Users } from "lucide-react";
import ahsacLogo from "@/assets/asac-logo.jpg";

interface College {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
  college_id: string | null;
}

interface Department {
  id: string;
  name: string;
  faculty_id: string;
}

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(100),
  matricNumber: z.string().regex(/^[A-Za-z0-9\/]+$/, "Invalid matric number format"),
  collegeId: z.string().optional(),
  facultyId: z.string().min(1, "Please select a faculty"),
  departmentId: z.string().min(1, "Please select a department"),
  levelOfStudy: z.string().min(1, "Please select your level of study"),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{10,14}$/, "Enter a valid WhatsApp number with country code"),
  email: z.string().email("Please enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  gender: z.string().min(1, "Please select your gender"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const LEVELS_OF_STUDY = [
  { value: "100L", label: "100 Level" },
  { value: "200L", label: "200 Level" },
  { value: "300L", label: "300 Level" },
  { value: "400L", label: "400 Level" },
  { value: "500L", label: "500 Level" },
  { value: "600L", label: "600 Level" },
];

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const calculateExpectedGraduationYear = (level: string): number => {
  const currentYear = new Date().getFullYear();
  const levelNum = parseInt(level.replace('L', ''));
  const yearsRemaining = Math.max(1, Math.ceil((400 - levelNum) / 100) + 1);
  return currentYear + yearsRemaining;
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const refSlug = searchParams.get('ref');
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [checkingLink, setCheckingLink] = useState(true);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const watchedLevel = watch("levelOfStudy");

  useEffect(() => {
    const fetchData = async () => {
      const [collegesRes, facultiesRes, departmentsRes] = await Promise.all([
        supabase.from('colleges').select('*').order('display_order'),
        supabase.from('faculties').select('*').order('display_order'),
        supabase.from('departments').select('*').order('display_order'),
      ]);
      
      setColleges(collegesRes.data || []);
      setFaculties(facultiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setFilteredFaculties(facultiesRes.data || []);
    };
    
    fetchData();
    
    const validateLink = async () => {
      if (!refSlug) {
        setIsValidLink(true);
        setCheckingLink(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('registration_links')
        .select('is_active')
        .eq('slug', refSlug)
        .maybeSingle();
      
      if (error || !data) {
        setIsValidLink(false);
      } else {
        setIsValidLink(data.is_active);
      }
      setCheckingLink(false);
    };
    
    validateLink();
  }, [refSlug]);

  useEffect(() => {
    if (selectedCollegeId) {
      const filtered = faculties.filter(f => f.college_id === selectedCollegeId);
      setFilteredFaculties(filtered);
    } else {
      setFilteredFaculties(faculties);
    }
    setSelectedFacultyId("");
    setValue("facultyId", "");
    setValue("departmentId", "");
    setFilteredDepartments([]);
  }, [selectedCollegeId, faculties, setValue]);

  useEffect(() => {
    if (selectedFacultyId) {
      const filtered = departments.filter(d => d.faculty_id === selectedFacultyId);
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
    setValue("departmentId", "");
  }, [selectedFacultyId, departments, setValue]);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      const selectedDept = departments.find(d => d.id === data.departmentId);
      const expectedGradYear = calculateExpectedGraduationYear(data.levelOfStudy);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/member-dashboard`,
          data: {
            full_name: data.fullName,
          }
        }
      });
      
      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message.includes('already registered') 
            ? "This email is already registered. Please log in." 
            : authError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const { error: memberError } = await supabase.from('members').insert({
        full_name: data.fullName,
        matric_number: data.matricNumber,
        faculty_id: data.facultyId,
        department_id: data.departmentId,
        department: selectedDept?.name || '',
        whatsapp_number: data.whatsappNumber,
        user_id: authData.user?.id || null,
        level_of_study: data.levelOfStudy,
        expected_graduation_year: expectedGradYear,
        gender: data.gender,
      });
      
      if (memberError) {
        toast({
          title: "Registration Issue",
          description: memberError.message.includes('duplicate') 
            ? "This matric number is already registered" 
            : memberError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      setIsSuccess(true);
      toast({ title: "Registration Successful!", description: "Welcome to AHSAC! You can now log in to your dashboard." });
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingLink) {
    return (
      <Layout>
        <section className="section-padding min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  if (isValidLink === false) {
    return (
      <>
        <Helmet><title>Invalid Registration Link | AHSAC</title></Helmet>
        <Layout>
          <section className="section-padding min-h-[70vh] flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">Invalid or Inactive Link</h1>
              <p className="text-muted-foreground mb-8">This registration link is not valid or has been deactivated. Please contact an AHSAC administrator for a valid registration link.</p>
              <Button variant="hero" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </motion.div>
          </section>
        </Layout>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Helmet><title>Registration Successful | AHSAC</title></Helmet>
        <Layout>
          <section className="section-padding min-h-[70vh] flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-sdg-green/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-sdg-green" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">Welcome to AHSAC!</h1>
              <p className="text-muted-foreground mb-8">Your registration is complete. You can now log in to access your member dashboard.</p>
              <div className="space-y-4">
                <Button variant="hero" asChild>
                  <Link to="/member-login">Log In</Link>
                </Button>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>Register Another Member</Button>
              </div>
            </motion.div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Join AHSAC - Member Registration"
        description="Register to become a member of AHSAC, Al-Hikmah University's SDG Advocacy Club. Join students championing the UN Sustainable Development Goals."
        keywords="AHSAC Registration, Join AHSAC, SDG Club Membership, Al-Hikmah University, Student Registration"
        path="/register"
      />
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Join Us</span>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">Become an <span className="gradient-text">AHSAC</span> Member</h1>
                <p className="text-lg text-muted-foreground mb-8">Join Al-Hikmah University students committed to championing the SDGs. Create your account to access exclusive member features.</p>
                <div className="flex items-center gap-4 mb-8">
                  <img src={ahsacLogo} alt="AHSAC Logo" className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20" />
                  <div><p className="font-display font-semibold">AHSAC Registration</p><p className="text-sm text-muted-foreground">Quick & Easy Process</p></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Already a member? <Link to="/member-login" className="text-primary hover:underline">Log in here</Link>
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg">
                  <h2 className="text-2xl font-display font-bold mb-6">Registration Form</h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2"><User className="h-4 w-4" />Full Name</Label>
                      <Input id="fullName" placeholder="Enter your full name" {...register("fullName")} className={errors.fullName ? "border-destructive" : ""} />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Address</Label>
                      <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2"><Lock className="h-4 w-4" />Password</Label>
                      <Input id="password" type="password" placeholder="Create a password" {...register("password")} className={errors.password ? "border-destructive" : ""} />
                      {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Users className="h-4 w-4" />Gender</Label>
                      <Select onValueChange={(value) => setValue("gender", value)}>
                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}><SelectValue placeholder="Select your gender" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {GENDERS.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="matricNumber" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Matric Number</Label>
                      <Input id="matricNumber" placeholder="e.g., 20/25SC001" {...register("matricNumber")} className={errors.matricNumber ? "border-destructive" : ""} />
                      {errors.matricNumber && <p className="text-sm text-destructive">{errors.matricNumber.message}</p>}
                    </div>

                    {/* College Selection (Optional) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" />College (Optional)</Label>
                      <Select 
                        value={selectedCollegeId} 
                        onValueChange={(value) => {
                          setSelectedCollegeId(value === "none" ? "" : value);
                          setValue("collegeId", value === "none" ? "" : value);
                        }}
                      >
                        <SelectTrigger><SelectValue placeholder="Select college (if applicable)" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="none">No College / Direct Faculty</SelectItem>
                          {colleges.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Select if you're in a college like Health Sciences</p>
                    </div>
                    
                    {/* Faculty Selection */}
                    <div className="space-y-2">
                      <Label>Faculty</Label>
                      <Select 
                        value={selectedFacultyId}
                        onValueChange={(value) => {
                          setSelectedFacultyId(value);
                          setValue("facultyId", value);
                        }}
                      >
                        <SelectTrigger className={errors.facultyId ? "border-destructive" : ""}><SelectValue placeholder="Select your faculty" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {filteredFaculties.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.facultyId && <p className="text-sm text-destructive">{errors.facultyId.message}</p>}
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select 
                        onValueChange={(value) => setValue("departmentId", value)}
                        disabled={!selectedFacultyId || filteredDepartments.length === 0}
                      >
                        <SelectTrigger className={errors.departmentId ? "border-destructive" : ""}>
                          <SelectValue placeholder={!selectedFacultyId ? "Select faculty first" : filteredDepartments.length === 0 ? "No departments available" : "Select your department"} />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {filteredDepartments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
                    </div>

                    {/* Level of Study */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Level of Study</Label>
                      <Select onValueChange={(value) => setValue("levelOfStudy", value)}>
                        <SelectTrigger className={errors.levelOfStudy ? "border-destructive" : ""}><SelectValue placeholder="Select your level" /></SelectTrigger>
                        <SelectContent className="bg-card">
                          {LEVELS_OF_STUDY.map((level) => <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.levelOfStudy && <p className="text-sm text-destructive">{errors.levelOfStudy.message}</p>}
                      {watchedLevel && (
                        <p className="text-xs text-muted-foreground">Expected graduation: {calculateExpectedGraduationYear(watchedLevel)}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber" className="flex items-center gap-2"><Phone className="h-4 w-4" />WhatsApp Number</Label>
                      <Input id="whatsappNumber" placeholder="+234XXXXXXXXXX" {...register("whatsappNumber")} className={errors.whatsappNumber ? "border-destructive" : ""} />
                      {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
                      <p className="text-xs text-muted-foreground">Include country code</p>
                    </div>
                    
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Creating Account...</> : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Register;
