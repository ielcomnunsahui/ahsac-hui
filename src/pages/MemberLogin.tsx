import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Lock, Users } from "lucide-react";
import ahsacLogo from "@/assets/asac-logo.jpg";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

type LoginFormData = z.infer<typeof loginSchema>;

const MemberLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/member-dashboard');
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You have been logged in successfully.",
    });
    navigate('/member-dashboard');
  };

  return (
    <>
      <SEO 
        title="Member Login | AHSAC"
        description="Log in to your AHSAC member account to access your dashboard and member benefits."
        path="/member-login"
      />
      <Layout>
        <section className="section-padding min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-secondary/50 to-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Member Login
              </h1>
              <p className="text-muted-foreground">
                Access your AHSAC member dashboard
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <img
                  src={ahsacLogo}
                  alt="AHSAC Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-display font-semibold">AHSAC Member Portal</p>
                  <p className="text-sm text-muted-foreground">Dashboard Access</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
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
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Not a member yet?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </Layout>
    </>
  );
};

export default MemberLogin;
