import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { format, isPast } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Download,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadICSFile } from "@/lib/calendar";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  max_attendees: number | null;
  registration_required: boolean | null;
  is_published: boolean | null;
  image_url: string | null;
}

const RegistrationDialog = ({ 
  event, 
  open, 
  onOpenChange,
  onSuccess
}: { 
  event: Event; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_number: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('event_registrations').insert({
        event_id: event.id,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        whatsapp_number: formData.whatsapp_number.trim() || null
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "You have already registered for this event.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Successful!",
          description: `You have been registered for ${event.title}`,
        });
        setFormData({ name: '', email: '', whatsapp_number: '' });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>
            Sign up for "{event.title}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number (optional)</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
              placeholder="+234..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: event, isLoading, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data as Event | null;
    },
    enabled: !!id
  });

  const { data: registrationCount } = useQuery({
    queryKey: ['event-registrations-count', id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!id
  });

  const handleAddToCalendar = () => {
    if (!event) return;
    
    downloadICSFile({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : null
    });

    toast({
      title: "Calendar file downloaded",
      description: "Open the .ics file to add the event to your calendar"
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding pt-24 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <SEO 
          title="Event Not Found | AHSAC"
          description="This event doesn't exist or is no longer available."
          path={`/events/${id}`}
        />
        <div className="section-padding pt-24 min-h-screen">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This event doesn't exist or is no longer available.
            </p>
            <Link to="/events">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isPastEvent = isPast(startDate);
  const spotsLeft = event.max_attendees ? event.max_attendees - (registrationCount || 0) : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <Layout>
      <SEO 
        title={`${event.title} | AHSAC Events`}
        description={event.description || `Join us for ${event.title}`}
        path={`/events/${id}`}
        image={event.image_url || undefined}
        event={{
          name: event.title,
          description: event.description || undefined,
          startDate: event.start_date,
          endDate: event.end_date || undefined,
          location: event.location || undefined,
          image: event.image_url || undefined,
          url: `https://ahsachui.org/events/${id}`
        }}
      />

      <div className="section-padding pt-24 min-h-screen">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <Link 
            to="/events" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Event Banner Image */}
            {event.image_url && (
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-8">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {isPastEvent ? (
                  <Badge variant="outline">Completed</Badge>
                ) : (
                  <Badge variant="secondary">Upcoming</Badge>
                )}
                {event.registration_required && !isPastEvent && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Registration Required
                  </Badge>
                )}
                {isFull && !isPastEvent && (
                  <Badge variant="destructive">Fully Booked</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {event.title}
              </h1>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{format(startDate, 'h:mm a')}</span>
                  {endDate && <span>- {format(endDate, 'h:mm a')}</span>}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {event.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {event.location && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{event.location}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {/* Attendees Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>Registered</span>
                      </div>
                      <span className="font-semibold">
                        {registrationCount || 0}
                        {event.max_attendees && ` / ${event.max_attendees}`}
                      </span>
                    </div>

                    {spotsLeft !== null && spotsLeft > 0 && !isPastEvent && (
                      <p className="text-sm text-muted-foreground">
                        {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                      </p>
                    )}

                    <Separator />

                    {/* Actions */}
                    {!isPastEvent && (
                      <>
                        {event.registration_required ? (
                          <Button 
                            className="w-full" 
                            onClick={() => setDialogOpen(true)}
                            disabled={isFull}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {isFull ? 'Event Full' : 'Register Now'}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            No registration required
                          </div>
                        )}
                      </>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleAddToCalendar}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Date Card */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6 text-center">
                    <p className="text-5xl font-bold">{format(startDate, 'd')}</p>
                    <p className="text-xl">{format(startDate, 'MMMM yyyy')}</p>
                    <p className="text-primary-foreground/80 mt-2">
                      {format(startDate, 'EEEE')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <RegistrationDialog
        event={event}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => refetch()}
      />
    </Layout>
  );
};

export default EventDetails;
