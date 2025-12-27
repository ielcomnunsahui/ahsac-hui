import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, GraduationCap, Calendar, UserCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MemberStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growthRate: number;
}

interface FacultyDistribution {
  name: string;
  count: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface LevelDistribution {
  level: string;
  count: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const Analytics = () => {
  const [stats, setStats] = useState<MemberStats>({ total: 0, thisMonth: 0, lastMonth: 0, growthRate: 0 });
  const [facultyDistribution, setFacultyDistribution] = useState<FacultyDistribution[]>([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyData[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<LevelDistribution[]>([]);
  const [graduationYears, setGraduationYears] = useState<{ year: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all members
      const { data: members } = await supabase
        .from('members')
        .select('*, faculties(name)');

      if (!members) return;

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Calculate stats
      const thisMonthCount = members.filter(m => new Date(m.created_at) >= thisMonthStart).length;
      const lastMonthCount = members.filter(m => {
        const date = new Date(m.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      }).length;

      const growthRate = lastMonthCount > 0 
        ? ((thisMonthCount - lastMonthCount) / lastMonthCount * 100) 
        : thisMonthCount > 0 ? 100 : 0;

      setStats({
        total: members.length,
        thisMonth: thisMonthCount,
        lastMonth: lastMonthCount,
        growthRate: Math.round(growthRate),
      });

      // Faculty distribution
      const facultyCounts: Record<string, number> = {};
      members.forEach(m => {
        const facultyName = m.faculties?.name || 'Unknown';
        facultyCounts[facultyName] = (facultyCounts[facultyName] || 0) + 1;
      });
      setFacultyDistribution(
        Object.entries(facultyCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      );

      // Monthly registrations (last 12 months)
      const monthlyData: Record<string, number> = {};
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyData[key] = 0;
      }
      members.forEach(m => {
        const date = new Date(m.created_at);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyData.hasOwnProperty(key)) {
          monthlyData[key]++;
        }
      });
      setMonthlyRegistrations(
        Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
      );

      // Level distribution
      const levelCounts: Record<string, number> = {};
      members.forEach(m => {
        const level = m.level_of_study || 'Not specified';
        levelCounts[level] = (levelCounts[level] || 0) + 1;
      });
      setLevelDistribution(
        Object.entries(levelCounts)
          .map(([level, count]) => ({ level, count }))
          .sort((a, b) => b.count - a.count)
      );

      // Expected graduation years
      const gradYearCounts: Record<number, number> = {};
      members.forEach(m => {
        if (m.expected_graduation_year) {
          gradYearCounts[m.expected_graduation_year] = (gradYearCounts[m.expected_graduation_year] || 0) + 1;
        }
      });
      setGraduationYears(
        Object.entries(gradYearCounts)
          .map(([year, count]) => ({ year: parseInt(year), count }))
          .sort((a, b) => a.year - b.year)
      );

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Analytics | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Member Analytics</h1>
            <p className="text-muted-foreground">Track registration trends and member distribution</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-3xl font-bold">{stats.thisMonth}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sdg-green/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-sdg-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Month</p>
                    <p className="text-3xl font-bold">{stats.lastMonth}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className={`text-3xl font-bold ${stats.growthRate >= 0 ? 'text-sdg-green' : 'text-destructive'}`}>
                      {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration Trends (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)" 
                        name="Registrations"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faculty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facultyDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.substring(0, 15)}... (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {facultyDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Level of Study Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="level" type="category" width={80} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Members" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Graduation Years</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graduationYears}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Graduating" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faculty Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Faculty Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facultyDistribution.map((faculty, index) => (
                  <div key={faculty.name} className="flex items-center gap-4">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{faculty.name}</span>
                        <span className="text-sm text-muted-foreground">{faculty.count} members</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(faculty.count / stats.total) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default Analytics;
