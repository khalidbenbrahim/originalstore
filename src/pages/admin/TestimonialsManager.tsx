import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  text_ar?: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

const emptyTestimonial = {
  name: "",
  text: "",
  text_ar: "",
  rating: 5,
  is_active: true,
};

export default function TestimonialsManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyTestimonial);
  const qc = useQueryClient();

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Testimonial[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      if (editing) {
        const { error } = await supabase.from("testimonials" as any).update(v).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials" as any).insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Témoignage sauvegardé !");
      setOpen(false);
    },
    onError: (e: any) => toast.error(`Erreur: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Témoignage supprimé");
    },
  });

  if (error && (error as any).code === "42P01") {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 mt-8">
        <MessageSquare className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-bold text-destructive mb-2">Table manquante</h3>
        <p className="text-muted-foreground mb-4">La table `testimonials` n'existe pas encore. Veuillez exécuter le script SQL fourni.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Témoignages Clients</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm(emptyTestimonial); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Ajouter un avis
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier" : "Ajouter"} un avis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nom du client</Label>
                <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="ex: Ahmed" />
              </div>
              <div className="space-y-2">
                <Label>Avis / Témoignage (Français)</Label>
                <Textarea value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} placeholder="ex: Très satisfait de mon iPhone 15 Pro Max..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label>Avis / Témoignage (Arabe)</Label>
                <Textarea value={form.text_ar} onChange={(e) => setForm({...form, text_ar: e.target.value})} dir="rtl" placeholder="ex: راضي جداً عن الآيفون الجديد..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label>Note (1-5)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button 
                      key={num} 
                      variant={form.rating >= num ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setForm({...form, rating: num})}
                      className="h-8 w-8 p-0"
                    >
                      <Star className={`h-4 w-4 ${form.rating >= num ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} />
                <Label>Actif (Visible sur le site)</Label>
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
                <TableHead>Client</TableHead>
                <TableHead>Avis</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Chargement...</TableCell></TableRow>
              ) : testimonials.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Aucun avis trouvé.</TableCell></TableRow>
              ) : testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-bold">{t.name}</TableCell>
                  <TableCell className="max-w-md truncate">{t.text}</TableCell>
                  <TableCell>
                    <div className="flex text-yellow-500">
                      {Array.from({length: t.rating}).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </TableCell>
                  <TableCell>{t.is_active ? <span className="text-green-600 font-bold text-xs uppercase">Actif</span> : <span className="text-muted-foreground text-xs uppercase">Masqué</span>}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setForm(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
