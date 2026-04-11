import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, PlayCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

const emptyVideo = {
  video_id: "",
  title: "",
  category: "battery",
  is_active: true,
  sort_order: 0,
};

export default function YouTubeManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<YouTubeVideo | null>(null);
  const [form, setForm] = useState(emptyVideo);
  const qc = useQueryClient();

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["admin-youtube-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_videos" as any)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as YouTubeVideo[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      if (editing) {
        const { error } = await supabase.from("youtube_videos" as any).update(v).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("youtube_videos" as any).insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-youtube-videos"] });
      toast.success("Vidéo sauvegardée !");
      setOpen(false);
    },
    onError: (e: any) => toast.error(`Erreur: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("youtube_videos" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-youtube-videos"] });
      toast.success("Vidéo supprimée");
    },
  });

  const openEdit = (v: YouTubeVideo) => {
    setEditing(v);
    setForm({
      video_id: v.video_id,
      title: v.title,
      category: v.category,
      is_active: v.is_active,
      sort_order: v.sort_order,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyVideo);
    setOpen(true);
  };

  if (error && (error as any).code === "42P01") {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 mt-8">
        <PlayCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold text-destructive mb-2">Table manquante</h3>
        <p className="text-muted-foreground mb-4">La table `youtube_videos` n'existe pas encore. Veuillez exécuter le script SQL fourni.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Vidéos YouTube</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Ajouter une vidéo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier" : "Ajouter"} une vidéo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Titre de la vidéo</Label>
                <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="ex: Test de batterie iPhone 15" />
              </div>
              <div className="space-y-2">
                <Label>ID Vidéo YouTube</Label>
                <div className="flex gap-2">
                  <Input value={form.video_id} onChange={(e) => setForm({...form, video_id: e.target.value})} placeholder="ex: dQw4w9WgXcQ" />
                  <Button variant="outline" size="icon" onClick={() => window.open(`https://youtube.com/watch?v=${form.video_id}`, '_blank')} disabled={!form.video_id}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battery">🔋 Batterie</SelectItem>
                      <SelectItem value="unboxing">📦 Unboxing</SelectItem>
                      <SelectItem value="test">📱 Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ordre d'affichage</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({...form, sort_order: +e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} />
                <Label>Active (Visible sur le site)</Label>
              </div>
              <Button onClick={() => saveMutation.mutate(form)} className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aperçu</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell></TableRow>
              ) : videos.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Aucune vidéo trouvée.</TableCell></TableRow>
              ) : videos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <img src={`https://img.youtube.com/vi/${v.video_id}/default.jpg`} className="w-20 rounded shadow-sm" />
                  </TableCell>
                  <TableCell className="font-medium">{v.title}</TableCell>
                  <TableCell className="capitalize">{v.category}</TableCell>
                  <TableCell>{v.sort_order}</TableCell>
                  <TableCell>{v.is_active ? <span className="text-green-600 font-bold text-xs uppercase">Actif</span> : <span className="text-muted-foreground text-xs uppercase">Masqué</span>}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
