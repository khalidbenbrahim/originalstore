import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TikTokManager() {
  const [videoId, setVideoId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("unboxing");
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("tiktok-admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tiktok_videos" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-tiktok"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["admin-tiktok"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tiktok_videos").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("tiktok_videos").insert({
        video_id: videoId,
        title,
        category,
        sort_order: videos.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tiktok"] });
      toast({ title: "Vidéo ajoutée ✓" });
      setVideoId("");
      setTitle("");
    },
    onError: (e: Error) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tiktok_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tiktok"] });
      toast({ title: "Vidéo supprimée" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("tiktok_videos").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tiktok"] }),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion TikTok @chawnilive</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une vidéo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Video ID TikTok</Label>
              <Input value={videoId} onChange={(e) => setVideoId(e.target.value)} placeholder="7345678901234567890" />
            </div>
            <div>
              <Label>Titre</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Battery Health iPhone 15" />
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">🔋 Battery Health</SelectItem>
                  <SelectItem value="unboxing">📦 Unboxing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => addMutation.mutate()} disabled={!videoId || addMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
              ) : videos.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucune vidéo</TableCell></TableRow>
              ) : videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-sm">{v.video_id}</TableCell>
                  <TableCell>{v.title}</TableCell>
                  <TableCell>{v.category === "battery" ? "🔋 Battery" : "📦 Unboxing"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={v.is_active}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: v.id, is_active: checked })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(v.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
