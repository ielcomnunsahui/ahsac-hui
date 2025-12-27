import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { CheckCircle, User, GraduationCap, Phone, Loader2 } from "lucide-react";
import asacLogo from "@/assets/asac-logo.jpg";

interface Faculty {
  id: string;
  name: string;
}

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(100),
  matricNumber: z.string().regex(/^[A-Za-z0-9\/]+$/, "Invalid matric number format"),
  facultyId: z.string().min(1, "Please select a faculty"),
  department: z.string().min(2, "Department must be at least 2 characters").max(100),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{10,14}$/, "Enter a valid WhatsApp number with country code"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    supabase.from('faculties').select('*').order('name').then(({ data }) => setFaculties(data || []));
  }, []);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    const { error } = await supabase.from('members').insert({
      full_name: data.fullName,
      matric_number: data.matricNumber,
      faculty_id: data.facultyId,
      department: data.department,
      whatsapp_number: data.whatsappNumber,
    });
    
    setIsSubmitting(false);
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message.includes('duplicate') ? "This matric number is already registered" : error.message,
        variant: "destructive",
      });
      return;
    }
    
    setIsSuccess(true);
    toast({ title: "Registration Successful!", description: "Welcome to ASAC!" });
    reset();
  };

  if (isSuccess) {
    return (
      <>
        <Helmet><title>Registration Successful | ASAC</title></Helmet>
        <Layout>
          <section className="section-padding min-h-[70vh] flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-sdg-green/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-sdg-green" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">Welcome to ASAC!</h1>
              <p className="text-muted-foreground mb-8">Your registration has been received.</p>
              <Button variant="hero" onClick={() => setIsSuccess(false)}>Register Another Member</Button>
            </motion.div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Join ASAC - Member Registration</title></Helmet>
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Join Us</span>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">Become an <span className="gradient-text">ASAC</span> Member</h1>
                <p className="text-lg text-muted-foreground mb-8">Join Al-Hikmah University students committed to championing the SDGs.</p>
                <div className="flex items-center gap-4 mb-8">
                  <img src={asacLogo} alt="ASAC Logo" className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20" />
                  <div><p className="font-display font-semibold">ASAC Registration</p><p className="text-sm text-muted-foreground">Quick & Easy Process</p></div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg">
                  <h2 className="text-2xl font-display font-bold mb-6">Registration Form</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2"><User className="h-4 w-4" />Full Name</Label>
                      <Input id="fullName" placeholder="Enter your full name" {...register("fullName")} className={errors.fullName ? "border-destructive" : ""} />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matricNumber" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Matric Number</Label>
                      <Input id="matricNumber" placeholder="e.g., 20/25SC001" {...register("matricNumber")} className={errors.matricNumber ? "border-destructive" : ""} />
                      {errors.matricNumber && <p className="text-sm text-destructive">{errors.matricNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Faculty</Label>
                      <Select onValueChange={(value) => setValue("facultyId", value)}>
                        <SelectTrigger className={errors.facultyId ? "border-destructive" : ""}><SelectValue placeholder="Select your faculty" /></SelectTrigger>
                        <SelectContent className="bg-card">{faculties.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                      </Select>
                      {errors.facultyId && <p className="text-sm text-destructive">{errors.facultyId.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="e.g., Computer Science" {...register("department")} className={errors.department ? "border-destructive" : ""} />
                      {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber" className="flex items-center gap-2"><Phone className="h-4 w-4" />WhatsApp Number</Label>
                      <Input id="whatsappNumber" placeholder="+234XXXXXXXXXX" {...register("whatsappNumber")} className={errors.whatsappNumber ? "border-destructive" : ""} />
                      {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
                      <p className="text-xs text-muted-foreground">Include country code</p>
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Submitting...</> : "Complete Registration"}
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
