import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Loader2, MessageSquare, Star, Lightbulb } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  message: string;
  type: string;
  is_approved: boolean;
  created_at: string;
}

const FeedbackAdmin = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({ title: "Error", description: "Failed to fetch feedback", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_approved: approve })
        .eq('id', id);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: approve ? "Feedback approved" : "Feedback rejected" 
      });
      fetchFeedback();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Feedback deleted successfully" });
      fetchFeedback();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'testimonial':
        return <Star className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'testimonial':
        return 'bg-sdg-gold/20 text-sdg-gold';
      case 'recommendation':
        return 'bg-sdg-green/20 text-sdg-green';
      default:
        return 'bg-sdg-blue/20 text-sdg-blue';
    }
  };

  const filteredFeedback = feedback.filter((f) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return !f.is_approved;
    if (activeTab === 'approved') return f.is_approved;
    return f.type === activeTab;
  });

  return (
    <>
      <Helmet>
        <title>Feedback | ASAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Feedback & Testimonials</h1>
            <p className="text-muted-foreground">Manage user feedback and testimonials</p>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({feedback.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({feedback.filter(f => !f.is_approved).length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({feedback.filter(f => f.is_approved).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFeedback.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No feedback found
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFeedback.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{item.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={item.is_approved ? "default" : "secondary"}>
                              {item.is_approved ? "Approved" : "Pending"}
                            </Badge>
                            <Badge className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{item.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            {!item.is_approved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(item.id, true)}
                                className="text-sdg-green border-sdg-green hover:bg-sdg-green/10"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {item.is_approved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(item.id, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
};

export default FeedbackAdmin;
