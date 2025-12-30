import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Plus, Copy, Trash2, Loader2, QrCode, Link2, RefreshCw, 
  Share2, MessageCircle, Send, Twitter, Facebook, Download
} from "lucide-react";

interface RegistrationLink {
  id: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

const RegistrationLinks = () => {
  const [links, setLinks] = useState<RegistrationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<RegistrationLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const defaultMessage = `🌍 Join ASAC - Al-Hikmah University SDG Advocacy Club!

Be part of a community championing the 17 UN Sustainable Development Goals.

Register here: {LINK}

#ASAC #SDGs #AlHikmahUniversity`;

  const [shareMessage, setShareMessage] = useState(defaultMessage);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('registration_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching registration links:', error);
      toast({ title: "Error", description: "Failed to fetch registration links", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewSlug(result);
  };

  const handleCreate = async () => {
    if (!newSlug.trim()) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('registration_links')
        .insert({
          slug: newSlug.trim().toLowerCase(),
          created_by: user?.id,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Registration link created successfully" });
      setNewSlug("");
      setIsDialogOpen(false);
      fetchLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('registration_links')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: `Link ${isActive ? 'activated' : 'deactivated'} successfully` 
      });
      fetchLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleReset = async (id: string) => {
    if (!confirm("Are you sure you want to regenerate this link? The old link will stop working.")) return;

    try {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let newSlugValue = '';
      for (let i = 0; i < 8; i++) {
        newSlugValue += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const { error } = await supabase
        .from('registration_links')
        .update({ slug: newSlugValue })
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Success", description: "Link regenerated successfully" });
      fetchLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration link?")) return;

    try {
      const { error } = await supabase.from('registration_links').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Registration link deleted successfully" });
      fetchLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getFullUrl = (slug: string) => `${window.location.origin}/register?ref=${slug}`;

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(getFullUrl(slug));
    toast({ title: "Copied", description: "Registration link copied to clipboard" });
  };

  const openQRDialog = (link: RegistrationLink) => {
    setSelectedLink(link);
    const url = getFullUrl(link.slug);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedLink) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `asac-registration-qr-${selectedLink.slug}.png`;
    a.click();
    toast({ title: "Downloaded", description: "QR code downloaded successfully" });
  };

  const openShareDialog = (link: RegistrationLink) => {
    setSelectedLink(link);
    setShareMessage(defaultMessage);
    setIsShareDialogOpen(true);
  };

  const getFormattedMessage = () => {
    if (!selectedLink) return shareMessage;
    return shareMessage.replace('{LINK}', getFullUrl(selectedLink.slug));
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getFormattedMessage())}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getFullUrl(selectedLink?.slug || ''))}&text=${encodeURIComponent(shareMessage.replace('{LINK}', ''))}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getFormattedMessage())}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getFullUrl(selectedLink?.slug || ''))}&quote=${encodeURIComponent(shareMessage.replace('{LINK}', ''))}`;
    window.open(url, '_blank');
  };

  const copyFormattedMessage = () => {
    navigator.clipboard.writeText(getFormattedMessage());
    toast({ title: "Copied", description: "Message copied to clipboard" });
  };

  return (
    <>
      <Helmet>
        <title>Registration Links | AHSAC Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Registration Links</h1>
              <p className="text-muted-foreground">Manage custom registration links and QR codes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Registration Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Custom Slug</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g., freshers-2024"
                      />
                      <Button variant="outline" onClick={generateSlug}>
                        Generate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Link will be: {window.location.origin}/register?ref={newSlug || 'your-slug'}
                    </p>
                  </div>
                  <Button onClick={handleCreate} className="w-full" disabled={isSaving || !newSlug.trim()}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Registration Links</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No registration links created yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-mono">{link.slug}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={link.is_active}
                              onCheckedChange={(checked) => handleToggle(link.id, checked)}
                            />
                            <span className={link.is_active ? "text-sdg-green" : "text-muted-foreground"}>
                              {link.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(link.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyLink(link.slug)}
                              title="Copy link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openQRDialog(link)}
                                  title="View QR code"
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>QR Code for {selectedLink?.slug}</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center gap-4 py-4">
                                  {qrCodeUrl && (
                                    <img 
                                      src={qrCodeUrl} 
                                      alt="QR Code" 
                                      className="w-64 h-64 border rounded-lg"
                                    />
                                  )}
                                  <p className="text-sm text-muted-foreground text-center break-all">
                                    {selectedLink && getFullUrl(selectedLink.slug)}
                                  </p>
                                  <Button onClick={downloadQRCode}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download QR Code
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openShareDialog(link)}
                              title="Share link"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReset(link.id)}
                              title="Regenerate link"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(link.id)}
                              className="text-destructive hover:text-destructive"
                              title="Delete link"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Default Registration Link
              </CardTitle>
              <CardDescription>
                This link always works and doesn't require a specific slug
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  value={`${window.location.origin}/register`}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/register`);
                    toast({ title: "Copied", description: "Default link copied to clipboard" });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/register`)}`;
                    window.open(url, '_blank');
                  }}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Share Registration Link</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <Tabs defaultValue="message" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="message">Custom Message</TabsTrigger>
                  <TabsTrigger value="share">Quick Share</TabsTrigger>
                </TabsList>
                <TabsContent value="message" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Share Message</Label>
                    <Textarea
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      rows={6}
                    placeholder="Enter your custom message. Use {LINK} as placeholder for the registration link."
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{LINK}'} to insert the registration link
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Preview:</p>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {getFormattedMessage()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyFormattedMessage} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Message
                  </Button>
                  <Button onClick={() => setShareMessage(defaultMessage)} variant="ghost">
                    Reset
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="share" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share directly to social media platforms:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={shareToWhatsApp} variant="outline" className="gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WhatsApp
                  </Button>
                  <Button onClick={shareToTelegram} variant="outline" className="gap-2">
                    <Send className="h-4 w-4 text-blue-500" />
                    Telegram
                  </Button>
                  <Button onClick={shareToTwitter} variant="outline" className="gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter/X
                  </Button>
                  <Button onClick={shareToFacebook} variant="outline" className="gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default RegistrationLinks;
