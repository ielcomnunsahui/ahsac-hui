import { useState } from "react";
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
import { CheckCircle, User, GraduationCap, Phone, Loader2 } from "lucide-react";
import asacLogo from "@/assets/asac-logo.jpg";

const faculties = [
  "Faculty of Sciences",
  "Faculty of Arts",
  "Faculty of Law",
  "Faculty of Management Sciences",
  "Faculty of Engineering",
  "Faculty of Education",
  "Faculty of Agriculture",
  "Faculty of Health Sciences",
];

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(100, "Name is too long"),
  matricNumber: z.string().regex(/^[A-Za-z0-9\/]+$/, "Invalid matric number format"),
  faculty: z.string().min(1, "Please select a faculty"),
  department: z.string().min(2, "Department must be at least 2 characters").max(100, "Department name is too long"),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{10,14}$/, "Enter a valid WhatsApp number with country code (e.g., +234...)"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual Supabase integration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Registration data:", data);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: "Registration Successful!",
      description: "Welcome to ASAC. You'll be added to our WhatsApp group shortly.",
    });
    
    reset();
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Registration Successful | ASAC</title>
        </Helmet>
        <Layout>
          <section className="section-padding min-h-[70vh] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-sdg-green/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-sdg-green" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Welcome to ASAC!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your registration has been received. Our team will review your application and add you to our WhatsApp group shortly.
              </p>
              <Button variant="hero" onClick={() => setIsSuccess(false)}>
                Register Another Member
              </Button>
            </motion.div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join ASAC - Member Registration</title>
        <meta
          name="description"
          content="Register to become a member of ASAC, Al-Hikmah University's SDG Advocacy Club. Join our community of sustainable development advocates."
        />
      </Helmet>
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Info Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:sticky lg:top-24"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Join Us
                </span>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                  Become an <span className="gradient-text">ASAC</span> Member
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Join hundreds of Al-Hikmah University students committed to championing the Sustainable Development Goals.
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <img
                    src={asacLogo}
                    alt="ASAC Logo"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-display font-semibold">ASAC Registration</p>
                    <p className="text-sm text-muted-foreground">Quick & Easy Process</p>
                  </div>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-display font-semibold">What you'll get:</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-sdg-green shrink-0" />
                      Access to ASAC events and workshops
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-sdg-green shrink-0" />
                      Join our WhatsApp community
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-sdg-green shrink-0" />
                      Leadership opportunities
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-sdg-green shrink-0" />
                      Certificate of participation
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Form Side */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg"
                >
                  <h2 className="text-2xl font-display font-bold mb-6">Registration Form</h2>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        {...register("fullName")}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Matric Number */}
                    <div className="space-y-2">
                      <Label htmlFor="matricNumber" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Matric Number
                      </Label>
                      <Input
                        id="matricNumber"
                        placeholder="e.g., 20/25SC001"
                        {...register("matricNumber")}
                        className={errors.matricNumber ? "border-destructive" : ""}
                      />
                      {errors.matricNumber && (
                        <p className="text-sm text-destructive">{errors.matricNumber.message}</p>
                      )}
                    </div>

                    {/* Faculty */}
                    <div className="space-y-2">
                      <Label>Faculty</Label>
                      <Select onValueChange={(value) => setValue("faculty", value)}>
                        <SelectTrigger className={errors.faculty ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select your faculty" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {faculties.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.faculty && (
                        <p className="text-sm text-destructive">{errors.faculty.message}</p>
                      )}
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Computer Science"
                        {...register("department")}
                        className={errors.department ? "border-destructive" : ""}
                      />
                      {errors.department && (
                        <p className="text-sm text-destructive">{errors.department.message}</p>
                      )}
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        WhatsApp Number
                      </Label>
                      <Input
                        id="whatsappNumber"
                        placeholder="+234XXXXXXXXXX"
                        {...register("whatsappNumber")}
                        className={errors.whatsappNumber ? "border-destructive" : ""}
                      />
                      {errors.whatsappNumber && (
                        <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Include country code (e.g., +234 for Nigeria)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
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
