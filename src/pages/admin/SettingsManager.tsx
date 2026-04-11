import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Save, Phone, MapPin, Globe, Camera } from "lucide-react";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: string;
}

export default function SettingsManager() {
  const qc = useQueryClient();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings" as any).select("*");
      if (error) throw error;
      return data as unknown as Setting[];
    },
  });

  useEffect(() => {
    if (settings.length > 0) {
      const mapped = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
      setLocalSettings(mapped);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (updatedSettings: Record<string, string>) => {
      const promises = Object.entries(updatedSettings).map(([key, value]) => 
        supabase.from("site_settings" as any).upsert({ key, value })
      );
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw new Error("Certains paramètres n'ont pas pu être sauvegardés.");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
      toast.success("Réglages mis à jour !");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (error && (error as any).code === "42P01") {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 mt-8">
        <Settings className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold text-destructive mb-2">Table manquante</h3>
        <p className="text-muted-foreground mb-4">La table `site_settings` n'existe pas encore. Veuillez exécuter le script SQL fourni.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Réglages du Site</h2>
        <Button onClick={() => saveMutation.mutate(localSettings)} disabled={saveMutation.isPending || isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact & WhatsApp
            </CardTitle>
            <CardDescription>Informations de contact affichées sur le site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Numéro WhatsApp (Format: 2126...)</Label>
              <Input 
                value={localSettings.whatsapp_number || ""} 
                onChange={(e) => handleChange("whatsapp_number", e.target.value)} 
                placeholder="212600000000"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-black"><MapPin className="h-4 w-4" /> Adresse du magasin</Label>
              <Input 
                value={localSettings.address || ""} 
                onChange={(e) => handleChange("address", e.target.value)} 
                placeholder="Tanger, Maroc"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Réseaux Sociaux
            </CardTitle>
            <CardDescription>Liens vers vos profils sociaux</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Globe className="h-4 w-4" /> Facebook URL</Label>
              <Input 
                value={localSettings.facebook_url || ""} 
                onChange={(e) => handleChange("facebook_url", e.target.value)} 
                placeholder="https://facebook.com/votrepage"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-black "><Camera className="h-4 w-4" /> Instagram URL</Label>
              <Input 
                value={localSettings.instagram_url || ""} 
                onChange={(e) => handleChange("instagram_url", e.target.value)} 
                placeholder="https://instagram.com/votreprofil"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
