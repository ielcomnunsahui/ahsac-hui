import { useEffect, useState, useRef } from "react";
import SEO from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PrintableAttendanceSheet } from "@/components/admin/PrintableAttendanceSheet";
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  CheckCircle, 
  Users, 
  Calendar, 
  Loader2,
  Search,
  UserCheck,
  AlertCircle,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { Html5Qrcode } from "html5-qrcode";

interface Event {
  id: string;
  title: string;
  start_date: string;
  location: string | null;
}

interface Member {
  id: string;
  full_name: string;
  matric_number: string;
  department: string;
}

interface Attendance {
  id: string;
  member_id: string;
  checked_in_at: string;
  members: {
    full_name: string;
    matric_number: string;
  } | null;
}

const EventCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [searching, setSearching] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendance();
    }
  }, [selectedEventId]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_date, location")
        .order("start_date", { ascending: false })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
      
      // Auto-select most recent event
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("event_attendance")
        .select("id, member_id, checked_in_at, members(full_name, matric_number)")
        .eq("event_id", selectedEventId)
        .order("checked_in_at", { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const startScanning = async () => {
    if (!readerRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        () => {} // Ignore errors during scanning
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      
      if (data.type !== "ahsac_member" || !data.id) {
        toast({
          title: "Invalid QR Code",
          description: "This is not a valid AHSAC member QR code",
          variant: "destructive",
        });
        return;
      }

      await checkInMember(data.id);
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Could not read QR code data",
        variant: "destructive",
      });
    }
  };

  const checkInMember = async (memberId: string) => {
    if (!selectedEventId || checkingIn) return;

    setCheckingIn(true);

    try {
      // Check if already checked in
      const { data: existing } = await supabase
        .from("event_attendance")
        .select("id")
        .eq("event_id", selectedEventId)
        .eq("member_id", memberId)
        .maybeSingle();

      if (existing) {
        // Get member name
        const { data: member } = await supabase
          .from("members")
          .select("full_name")
          .eq("id", memberId)
          .single();

        toast({
          title: "Already Checked In",
          description: `${member?.full_name || "Member"} has already checked in to this event`,
        });
        return;
      }

      // Get member details
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id, full_name, matric_number")
        .eq("id", memberId)
        .single();

      if (memberError || !member) {
        toast({
          title: "Member Not Found",
          description: "This QR code doesn't match any registered member",
          variant: "destructive",
        });
        return;
      }

      // Record attendance
      const { error } = await supabase
        .from("event_attendance")
        .insert({
          event_id: selectedEventId,
          member_id: memberId,
          checked_in_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Check-in Successful!",
        description: `${member.full_name} (${member.matric_number}) has been checked in`,
      });

      // Refresh attendance list
      fetchAttendance();
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast({
        title: "Check-in Failed",
        description: error.message || "An error occurred during check-in",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualSearch.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("members")
        .select("id, full_name, matric_number, department")
        .or(`full_name.ilike.%${manualSearch}%,matric_number.ilike.%${manualSearch}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current || !selectedEvent) return;
    
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Sheet - ${selectedEvent.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <>
      <SEO 
        title="Event Check-In | AHSAC Admin"
        description="QR code check-in for AHSAC events."
        path="/admin/check-in"
        noindex
      />
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Event Check-In</h1>
            <p className="text-muted-foreground">
              Scan member QR codes or search manually for quick attendance tracking
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scanner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>
                  Point the camera at a member's QR code to check them in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Selection */}
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} - {format(new Date(event.start_date), "MMM d, yyyy")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEventId && (
                  <>
                    {/* Scanner Controls */}
                    <div className="flex gap-2">
                      {!isScanning ? (
                        <Button onClick={startScanning} className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Scanner
                        </Button>
                      ) : (
                        <Button onClick={stopScanning} variant="destructive" className="flex-1">
                          <CameraOff className="h-4 w-4 mr-2" />
                          Stop Scanner
                        </Button>
                      )}
                    </div>

                    {/* Scanner View */}
                    <div 
                      id="qr-reader" 
                      ref={readerRef}
                      className={`rounded-lg overflow-hidden ${isScanning ? "block" : "hidden"}`}
                      style={{ width: "100%" }}
                    />

                    {!isScanning && (
                      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                        <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          Click "Start Scanner" to begin scanning member QR codes
                        </p>
                      </div>
                    )}
                  </>
                )}

                {!selectedEventId && (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Please select an event to start checking in attendees
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Check-in Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Manual Check-In
                </CardTitle>
                <CardDescription>
                  Search for a member by name or matric number
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name or matric number..."
                    value={manualSearch}
                    onChange={(e) => setManualSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                  />
                  <Button onClick={handleManualSearch} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchResults.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.matric_number} • {member.department}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => checkInMember(member.id)}
                          disabled={checkingIn || !selectedEventId}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {manualSearch && searchResults.length === 0 && !searching && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No members found matching "{manualSearch}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attendance List */}
          {selectedEventId && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Attendance for {selectedEvent?.title}
                    </CardTitle>
                    <CardDescription>
                      {attendance.length} member{attendance.length !== 1 ? "s" : ""} checked in
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {attendance.length > 0 && (
                      <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Sheet
                      </Button>
                    )}
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {attendance.length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {attendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Matric Number</TableHead>
                        <TableHead>Check-in Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record, index) => (
                        <TableRow key={record.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {record.members?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>{record.members?.matric_number || "N/A"}</TableCell>
                          <TableCell>
                            {format(new Date(record.checked_in_at), "h:mm a")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No check-ins yet for this event</p>
                    <p className="text-sm">Start scanning QR codes or search for members above</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Hidden Printable Sheet */}
          <div className="hidden">
            {selectedEvent && (
              <PrintableAttendanceSheet
                ref={printRef}
                eventTitle={selectedEvent.title}
                eventDate={selectedEvent.start_date}
                eventLocation={selectedEvent.location}
                attendance={attendance}
              />
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default EventCheckIn;
