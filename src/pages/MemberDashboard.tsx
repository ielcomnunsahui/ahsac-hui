import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  GraduationCap, 
  Phone, 
  Mail, 
  Calendar, 
  LogOut, 
  Loader2, 
  Target,
  MessageSquare,
  Edit,
  Save,
  X
} from "lucide-react";

interface MemberData {
  id: string;
  full_name: string;
  matric_number: string;
  department: string;
  whatsapp_number: string;
  created_at: string;
  faculty_id: string | null;
  faculties: { name: string } | null;
}

const MemberDashboard = () => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ whatsapp_number: "", department: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/member-login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const fetchMemberData = async () => {
    if (!user?.email) return;
    
    try {
      // Try to find member by matching email in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      
      // Find member by full_name from profile or user metadata
      const fullName = profile?.full_name || user.user_metadata?.full_name;
      
      if (fullName) {
        const { data, error } = await supabase
          .from('members')
          .select('*, faculties(name)')
          .eq('full_name', fullName)
          .maybeSingle();
        
        if (data) {
          setMemberData(data);
          setEditData({
            whatsapp_number: data.whatsapp_number,
            department: data.department,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!memberData) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('members')
        .update({
          whatsapp_number: editData.whatsapp_number,
          department: editData.department,
        })
        .eq('id', memberData.id);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Profile updated successfully" });
      setMemberData({ ...memberData, ...editData });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Member Dashboard | ASAC</title>
      </Helmet>
      <Layout>
        <section className="section-padding bg-gradient-to-b from-secondary/50 to-background min-h-screen">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-display font-bold">
                    Welcome, {memberData?.full_name || user.user_metadata?.full_name || 'Member'}!
                  </h1>
                  <p className="text-muted-foreground">Your ASAC member dashboard</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Your Profile
                      </CardTitle>
                      {memberData && !isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardDescription>Your ASAC membership details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {memberData ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-sdg-teal flex items-center justify-center text-xl font-display font-bold text-white">
                            {memberData.full_name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{memberData.full_name}</p>
                            <Badge variant="secondary">{memberData.matric_number}</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Faculty:</span>
                            <span>{memberData.faculties?.name || 'N/A'}</span>
                          </div>
                          
                          {isEditing ? (
                            <>
                              <div className="space-y-2">
                                <Label>Department</Label>
                                <Input
                                  value={editData.department}
                                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>WhatsApp Number</Label>
                                <Input
                                  value={editData.whatsapp_number}
                                  onChange={(e) => setEditData({ ...editData, whatsapp_number: e.target.value })}
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Department:</span>
                                <span>{memberData.department}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">WhatsApp:</span>
                                <span>{memberData.whatsapp_number}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span>{user.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Member since:</span>
                            <span>{new Date(memberData.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p className="mb-4">No membership record found for your account.</p>
                        <Button asChild>
                          <Link to="/register">Complete Registration</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Things you can do as a member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/feedback">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Share Feedback or Testimonial
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/sdgs">
                        <Target className="h-4 w-4 mr-2" />
                        Learn About SDGs
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/about">
                        <User className="h-4 w-4 mr-2" />
                        About ASAC
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Membership Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2"
              >
                <Card className="bg-gradient-to-r from-primary/10 to-sdg-teal/10 border-primary/20">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg">Membership Status</h3>
                        <p className="text-sm text-muted-foreground">You're an active ASAC member</p>
                      </div>
                      <Badge className="bg-sdg-green text-white text-sm px-4 py-1">Active Member</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default MemberDashboard;
