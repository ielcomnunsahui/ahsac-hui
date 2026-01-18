import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Loader2, Save } from "lucide-react";

interface OrganizationSettings {
  id: string;
  name: string;
  logo_url: string | null;
  about: string | null;
  mission: string | null;
  vision: string | null;
  aims: string[] | null;
  objectives: string[] | null;
  sdg_info: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}

const Settings = () => {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aimsText, setAimsText] = useState("");
  const [objectivesText, setObjectivesText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
        setAimsText((data.aims || []).join('\n'));
        setObjectivesText((data.objectives || []).join('\n'));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({ title: "Error", description: "Failed to fetch settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);

    try {
      const aims = aimsText.split('\n').filter(a => a.trim());
      const objectives = objectivesText.split('\n').filter(o => o.trim());

      const { error } = await supabase
        .from('organization_settings')
        .update({
          name: settings.name,
          logo_url: settings.logo_url,
          about: settings.about,
          mission: settings.mission,
          vision: settings.vision,
          aims,
          objectives,
          sdg_info: settings.sdg_info,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          address: settings.address,
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({ title: "Success", description: "Settings saved successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-muted-foreground">
          No settings found. Please contact support.
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEO 
        title="Settings | AHSAC Admin"
        description="Manage AHSAC organization settings."
        path="/admin/settings"
        noindex
      />
      <AdminLayout>
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold">Organization Settings</h1>
              <p className="text-muted-foreground">Manage your organization's information</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Organization name and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <ImageUpload
                currentUrl={settings.logo_url}
                onUpload={(url) => setSettings({ ...settings, logo_url: url })}
                folder="logo"
                label="Organization Logo"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Description and purpose of the organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>About AHSAC </Label>
                <Textarea
                  value={settings.about || ''}
                  onChange={(e) => setSettings({ ...settings, about: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Mission</Label>
                <Textarea
                  value={settings.mission || ''}
                  onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Vision</Label>
                <Textarea
                  value={settings.vision || ''}
                  onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aims & Objectives</CardTitle>
              <CardDescription>Enter one item per line</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Aims</Label>
                <Textarea
                  value={aimsText}
                  onChange={(e) => setAimsText(e.target.value)}
                  rows={5}
                  placeholder="Enter each aim on a new line"
                />
              </div>
              <div className="space-y-2">
                <Label>Objectives</Label>
                <Textarea
                  value={objectivesText}
                  onChange={(e) => setObjectivesText(e.target.value)}
                  rows={5}
                  placeholder="Enter each objective on a new line"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SDG Information</CardTitle>
              <CardDescription>Information about SDGs displayed on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>SDG Info</Label>
                <Textarea
                  value={settings.sdg_info || ''}
                  onChange={(e) => setSettings({ ...settings, sdg_info: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How people can reach ASAC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="asac@alhikmah.edu.ng"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={settings.contact_phone || ''}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  placeholder="+234..."
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Settings;
