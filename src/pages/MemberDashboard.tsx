import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  X,
  CalendarCheck,
  CheckCircle,
  QrCode
} from "lucide-react";
import { MemberQRCode } from "@/components/MemberQRCode";
import { format } from "date-fns";

interface MemberData {
  id: string;
  full_name: string;
  matric_number: string;
  department: string;
  whatsapp_number: string;
  created_at: string;
  faculty_id: string | null;
  user_id: string | null;
  faculties: { name: string } | null;
}

interface EventRegistration {
  id: string;
  event_id: string;
  registered_at: string;
  events: {
    id: string;
    title: string;
    start_date: string;
    location: string | null;
  } | null;
}

interface EventAttendance {
  id: string;
  event_id: string;
  checked_in_at: string;
  events: {
    id: string;
    title: string;
    start_date: string;
  } | null;
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
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [attendance, setAttendance] = useState<EventAttendance[]>([]);

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
    if (!user) return;
    
    try {
      // First try to find member by user_id (direct link)
      let { data, error } = await supabase
        .from('members')
        .select('*, faculties(name)')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If not found by user_id, try by full_name from profile or user metadata
      if (!data) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        
        const fullName = profile?.full_name || user.user_metadata?.full_name;
        
        if (fullName) {
          const result = await supabase
            .from('members')
            .select('*, faculties(name)')
            .eq('full_name', fullName)
            .maybeSingle();
          
          data = result.data;
          
          // If found by name, link the user_id for future lookups
          if (data && !data.user_id) {
            await supabase
              .from('members')
              .update({ user_id: user.id })
              .eq('id', data.id);
            data.user_id = user.id;
          }
        }
      }
      
      if (data) {
        setMemberData(data);
        setEditData({
          whatsapp_number: data.whatsapp_number,
          department: data.department,
        });
        
        // Fetch event registrations
        const { data: regData } = await supabase
          .from('event_registrations')
          .select('id, event_id, registered_at, events(id, title, start_date, location)')
          .eq('member_id', data.id)
          .order('registered_at', { ascending: false });
        
        setRegistrations(regData || []);
        
        // Fetch attendance history
        const { data: attData } = await supabase
          .from('event_attendance')
          .select('id, event_id, checked_in_at, events(id, title, start_date)')
          .eq('member_id', data.id)
          .order('checked_in_at', { ascending: false });
        
        setAttendance(attData || []);
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
      <SEO 
        title="Member Dashboard | AHSAC"
        description="Access your AHSAC member dashboard to view your profile, events, and more."
        path="/member-dashboard"
        noindex
      />
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
                  <p className="text-muted-foreground">Your AHSAC member dashboard</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>
                <TabsTrigger value="attendance">Attendance ({attendance.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
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
                        <CardDescription>Your AHSAC membership details</CardDescription>
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
                            <p className="mb-4">Your membership profile is being set up. This may take a moment after registration.</p>
                            <div className="space-y-2">
                              <Button onClick={fetchMemberData} variant="outline">
                                <Loader2 className="h-4 w-4 mr-2" />
                                Refresh Profile
                              </Button>
                              <p className="text-xs text-muted-foreground">
                                If this persists, please <Link to="/register" className="text-primary hover:underline">complete registration</Link> or contact an admin.
                              </p>
                            </div>
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
                          <Link to="/events">
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            View Upcoming Events
                          </Link>
                        </Button>
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
                            About AHSAC
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* QR Code Card */}
                  {memberData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <MemberQRCode
                        memberId={memberData.id}
                        memberName={memberData.full_name}
                        matricNumber={memberData.matric_number}
                      />
                    </motion.div>
                  )}

                  {/* Membership Status Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={memberData ? "" : "md:col-span-2"}
                  >
                    <Card className="bg-gradient-to-r from-primary/10 to-sdg-teal/10 border-primary/20">
                      <CardContent className="py-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h3 className="font-display font-semibold text-lg">Membership Status</h3>
                            <p className="text-sm text-muted-foreground">You're an active AHSAC member</p>
                          </div>
                          <Badge className="bg-sdg-green text-white text-sm px-4 py-1">Active Member</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="registrations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5" />
                      Your Event Registrations
                    </CardTitle>
                    <CardDescription>Events you've registered for</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {registrations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>You haven't registered for any events yet.</p>
                        <Button variant="link" asChild className="mt-2">
                          <Link to="/events">Browse upcoming events</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registrations.map((reg) => (
                          <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{reg.events?.title || 'Unknown Event'}</p>
                              <p className="text-sm text-muted-foreground">
                                {reg.events?.start_date ? format(new Date(reg.events.start_date), "PPP 'at' p") : 'Date TBD'}
                              </p>
                              {reg.events?.location && (
                                <p className="text-sm text-muted-foreground">{reg.events.location}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">Registered</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(reg.registered_at), "PP")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Your Attendance History
                    </CardTitle>
                    <CardDescription>Events you've attended</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attendance.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No attendance records yet.</p>
                        <p className="text-sm">Check in at events to build your history!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {attendance.map((att) => (
                          <div key={att.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{att.events?.title || 'Unknown Event'}</p>
                              <p className="text-sm text-muted-foreground">
                                {att.events?.start_date ? format(new Date(att.events.start_date), "PPP") : 'Date unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-sdg-green text-white">Attended</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Checked in: {format(new Date(att.checked_in_at), "p")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default MemberDashboard;
