import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, MessageSquare, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalMembers: number;
  totalFaculties: number;
  pendingFeedback: number;
  recentMembers: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    totalFaculties: 0,
    pendingFeedback: 0,
    recentMembers: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch members count
      const { count: membersCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

      // Fetch faculties count
      const { count: facultiesCount } = await supabase
        .from('faculties')
        .select('*', { count: 'exact', head: true });

      // Fetch pending feedback count
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      // Fetch recent members (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: recentCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch recent registrations
      const { data: recent } = await supabase
        .from('members')
        .select('*, faculties(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalMembers: membersCount || 0,
        totalFaculties: facultiesCount || 0,
        pendingFeedback: feedbackCount || 0,
        recentMembers: recentCount || 0,
      });

      setRecentRegistrations(recent || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Members", value: stats.totalMembers, icon: Users, color: "text-sdg-blue" },
    { title: "Faculties", value: stats.totalFaculties, icon: GraduationCap, color: "text-sdg-green" },
    { title: "Pending Feedback", value: stats.pendingFeedback, icon: MessageSquare, color: "text-sdg-orange" },
    { title: "New This Week", value: stats.recentMembers, icon: TrendingUp, color: "text-sdg-purple" },
  ];

  return (
    <>
      <SEO 
        title="Admin Dashboard | AHSAC"
        description="AHSAC admin dashboard for managing members, events, and organization settings."
        path="/admin"
        noindex
      />
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the AHSAC admin panel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {loading ? "..." : stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Registrations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : recentRegistrations.length === 0 ? (
                <p className="text-muted-foreground">No registrations yet</p>
              ) : (
                <div className="space-y-4">
                  {recentRegistrations.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.matric_number} • {member.faculties?.name || 'N/A'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default Dashboard;
