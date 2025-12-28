import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { format, isPast, isFuture, isToday } from "date-fns";
import { Calendar, MapPin, Users, Clock, CheckCircle, AlertCircle, Download, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}

const EventCard = ({ 
  event, 
  isPastEvent = false,
  onRegister 
}: { 
  event: Event; 
  isPastEvent?: boolean;
  onRegister: (event: Event) => void;
}) => {
  const { toast } = useToast();
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isEventToday = isToday(startDate);
  const isOngoing = !isPast(startDate) || (endDate && isFuture(endDate));

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadICSFile({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: new Date(event.start_date),
      endDate: event.end_date ? new Date(event.end_date) : null
    });
    toast({
      title: "Calendar file downloaded",
      description: "Open the .ics file to add to your calendar"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className={`hover-lift h-full cursor-pointer ${isPastEvent ? 'opacity-80' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {isEventToday && (
                    <Badge className="bg-accent text-accent-foreground">Today</Badge>
                  )}
                  {isOngoing && !isPastEvent && (
                    <Badge variant="secondary">Upcoming</Badge>
                  )}
                  {isPastEvent && (
                    <Badge variant="outline">Completed</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                {event.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {event.description}
                  </CardDescription>
                )}
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg min-w-[70px]">
                <p className="text-2xl font-bold text-primary">{format(startDate, 'd')}</p>
                <p className="text-xs text-muted-foreground uppercase">{format(startDate, 'MMM')}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{format(startDate, 'EEEE, MMMM d, yyyy • h:mm a')}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Max {event.max_attendees} attendees</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isPastEvent && event.registration_required && (
                <Button 
                  className="flex-1" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRegister(event);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Register
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleAddToCalendar}
                title="Add to calendar"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
            {!isPastEvent && !event.registration_required && (
              <p className="text-sm text-muted-foreground text-center">
                No registration required - Just show up!
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const RegistrationDialog = { 
  event, 
  open, 
  onOpenChange,
  onSuccess
}: { 
  event: Event | null; 
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
    if (!event) return;

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

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>
            Sign up for "{event.title}" on {format(new Date(event.start_date), 'MMMM d, yyyy')}
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

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    }
  });

  const upcomingEvents = events?.filter(e => !isPast(new Date(e.start_date))) || [];
  const pastEvents = events?.filter(e => isPast(new Date(e.start_date))) || [];

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleRegistrationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['public-events'] });
  };

  return (
    <Layout>
      <Helmet>
        <title>Events | ASAC - SDG Advocacy Club</title>
        <meta name="description" content="Discover and register for upcoming ASAC events. Join us in advocating for the UN Sustainable Development Goals." />
        <meta
          name="keywords"
          content="ASAC, Events, SDG, Sustainable Development Goals, University Events, Sustainability, Climate Action, Community Events, Al-Hikmah University"
        />
        <meta property="og:title" content="Events | ASAC - SDG Advocacy Club" />
        <meta property="og:description" content="Discover and register for upcoming ASAC events. Join us in advocating for the UN Sustainable Development Goals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://asac-hui.vercel.app/events" />
      </Helmet>

      <div className="section-padding pt-24 min-h-screen">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Our Events</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              ASAC <span className="gradient-text">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us at our events and be part of the movement to achieve the 
              UN Sustainable Development Goals in our community.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : events && events.length > 0 ? (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Past ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcomingEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onRegister={handleRegister}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="max-w-md mx-auto text-center py-12">
                    <CardContent>
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No Upcoming Events</h3>
                      <p className="text-muted-foreground">
                        Check back soon for new events or follow us on social media for updates.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="past">
                {pastEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isPastEvent
                        onRegister={handleRegister}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="max-w-md mx-auto text-center py-12">
                    <CardContent>
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No Past Events</h3>
                      <p className="text-muted-foreground">
                        Past events will appear here after they've concluded.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="max-w-md mx-auto text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Events Yet</h3>
                <p className="text-muted-foreground">
                  Stay tuned! Our first events will be announced soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <RegistrationDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleRegistrationSuccess}
      />
    </Layout>
  );
};

export default Events;