import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, Calendar, MapPin, Users, Pencil, Trash2, Loader2, 
  Eye, EyeOff, CheckCircle, Clock, UserCheck, Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  max_attendees: number | null;
  is_published: boolean;
  registration_required: boolean;
  image_url: string | null;
  created_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  member_id: string | null;
  name: string;
  email: string | null;
  whatsapp_number: string | null;
  registered_at: string;
}

interface EventAttendance {
  id: string;
  event_id: string;
  registration_id: string | null;
  member_id: string | null;
  checked_in_at: string;
}

const EventForm = ({ 
  event, 
  onSubmit, 
  onCancel, 
  isLoading 
}: { 
  event?: Event; 
  onSubmit: (data: Partial<Event>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [startDate, setStartDate] = useState(event?.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : "");
  const [endDate, setEndDate] = useState(event?.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : "");
  const [maxAttendees, setMaxAttendees] = useState(event?.max_attendees?.toString() || "");
  const [isPublished, setIsPublished] = useState(event?.is_published || false);
  const [registrationRequired, setRegistrationRequired] = useState(event?.registration_required !== false);
  const [imageUrl, setImageUrl] = useState(event?.image_url || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || null,
      location: location || null,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
      is_published: isPublished,
      registration_required: registrationRequired,
      image_url: imageUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., SDG Awareness Workshop"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event details..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Main Auditorium"
        />
      </div>

      <ImageUpload
        currentUrl={imageUrl}
        onUpload={setImageUrl}
        folder="events"
        label="Event Banner Image"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date & Time *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date & Time</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxAttendees">Max Attendees (optional)</Label>
        <Input
          id="maxAttendees"
          type="number"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          placeholder="Leave empty for unlimited"
          min="1"
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <Label htmlFor="registrationRequired">Registration Required</Label>
          <p className="text-sm text-muted-foreground">Require registration for this event</p>
        </div>
        <Switch
          id="registrationRequired"
          checked={registrationRequired}
          onCheckedChange={setRegistrationRequired}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <Label htmlFor="isPublished">Publish Event</Label>
          <p className="text-sm text-muted-foreground">Make event visible to public</p>
        </div>
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
      </div>

      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !title || !startDate}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {event ? "Save Changes" : "Create Event"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Events = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [checkInName, setCheckInName] = useState("");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ["event-registrations", viewingEvent?.id],
    queryFn: async () => {
      if (!viewingEvent) return [];
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", viewingEvent.id)
        .order("registered_at");
      if (error) throw error;
      return data as EventRegistration[];
    },
    enabled: !!viewingEvent,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["event-attendance", viewingEvent?.id],
    queryFn: async () => {
      if (!viewingEvent) return [];
      const { data, error } = await supabase
        .from("event_attendance")
        .select("*")
        .eq("event_id", viewingEvent.id);
      if (error) throw error;
      return data as EventAttendance[];
    },
    enabled: !!viewingEvent,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Event>) => {
      const { error } = await supabase.from("events").insert(data as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setIsAddDialogOpen(false);
      toast.success("Event created successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const { error } = await supabase.from("events").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setEditingEvent(null);
      toast.success("Event updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const checkInMutation = useMutation({
    mutationFn: async ({ eventId, name }: { eventId: string; name: string }) => {
      // Find registration by name
      const reg = registrations.find(r => 
        r.name.toLowerCase().includes(name.toLowerCase())
      );
      
      const { error } = await supabase.from("event_attendance").insert({
        event_id: eventId,
        registration_id: reg?.id || null,
        member_id: reg?.member_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-attendance", viewingEvent?.id] });
      setCheckInName("");
      toast.success("Checked in successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const upcomingEvents = events.filter(e => new Date(e.start_date) > new Date());
  const pastEvents = events.filter(e => new Date(e.start_date) <= new Date());

  return (
    <>
      <Helmet>
        <title>Events | AHSAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold">Event Management</h1>
              <p className="text-muted-foreground">Create and manage AHSAC events</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Add a new AHSAC event.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <EventForm
                    onSubmit={(data) => createMutation.mutate(data)}
                    onCancel={() => setIsAddDialogOpen(false)}
                    isLoading={createMutation.isPending}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No events created yet</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No upcoming events
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {upcomingEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onEdit={() => setEditingEvent(event)}
                        onView={() => setViewingEvent(event)}
                        onDelete={() => deleteMutation.mutate(event.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastEvents.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No past events
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pastEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onEdit={() => setEditingEvent(event)}
                        onView={() => setViewingEvent(event)}
                        onDelete={() => deleteMutation.mutate(event.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Edit Event Dialog */}
          <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
            <DialogContent className="max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                {editingEvent && (
                  <EventForm
                    event={editingEvent}
                    onSubmit={(data) => updateMutation.mutate({ id: editingEvent.id, data })}
                    onCancel={() => setEditingEvent(null)}
                    isLoading={updateMutation.isPending}
                  />
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* View Event Details Dialog */}
          <Dialog open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{viewingEvent?.title}</DialogTitle>
                <DialogDescription>
                  {viewingEvent && format(new Date(viewingEvent.start_date), "PPP 'at' p")}
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="registrations">
                <TabsList>
                  <TabsTrigger value="registrations">
                    Registrations ({registrations.length})
                  </TabsTrigger>
                  <TabsTrigger value="attendance">
                    Attendance ({attendance.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="registrations" className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell>{reg.name}</TableCell>
                          <TableCell>{reg.email || "-"}</TableCell>
                          <TableCell>{reg.whatsapp_number || "-"}</TableCell>
                          <TableCell>{format(new Date(reg.registered_at), "PP")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter name to check in..."
                      value={checkInName}
                      onChange={(e) => setCheckInName(e.target.value)}
                    />
                    <Button 
                      onClick={() => viewingEvent && checkInMutation.mutate({ 
                        eventId: viewingEvent.id, 
                        name: checkInName 
                      })}
                      disabled={!checkInName.trim()}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Checked In At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.map((att) => (
                          <TableRow key={att.id}>
                            <TableCell>{format(new Date(att.checked_in_at), "PPp")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </>
  );
};

const EventCard = ({ 
  event, 
  onEdit, 
  onView,
  onDelete 
}: { 
  event: Event; 
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) => {
  const isPast = new Date(event.start_date) <= new Date();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              {event.is_published ? (
                <Badge variant="default" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Published
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Draft
                </Badge>
              )}
              {isPast && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <CardDescription>{event.description}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onView}>
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this event and all its registrations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.start_date), "PPP 'at' p")}
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
          {event.max_attendees && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {event.max_attendees} attendees
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Events;
