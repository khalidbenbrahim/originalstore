import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, Filter, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

const emptyProduct: ProductInsert = {
  name: "", name_ar: "", category: "iphone", price: 0, image: "",
  color: "", color_ar: "", in_stock: true, is_flash_sale: false,
};

export default function ProductsManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInsert>(emptyProduct);
  const [searchTerm, setSearchTerm] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-products"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (p: ProductInsert & { id?: string }) => {
      if (p.id) {
        const { error } = await supabase.from("products").update(p).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(p);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produit sauvegardé avec succès !");
      setOpen(false);
      setEditing(null);
      setForm(emptyProduct);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produit supprimé");
    },
  });

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error("Veuillez remplir le nom et le prix.");
      return;
    }
    saveMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const updateField = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Catalogue Produits</h2>
          <p className="text-muted-foreground mt-1">Gérez votre inventaire iPhone, Watch et AirPods.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" /> Nouveau Produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier" : "Ajouter"} un produit</DialogTitle>
              <CardDescription>Remplissez les informations détaillées du produit.</CardDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom (Français)</Label>
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="ex: iPhone 15 Pro Max" />
                </div>
                <div className="space-y-2">
                  <Label>Nom (Arabe)</Label>
                  <Input value={form.name_ar} onChange={(e) => updateField("name_ar", e.target.value)} dir="rtl" placeholder="آيفون 15 برو ماكس" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iphone">iPhone</SelectItem>
                      <SelectItem value="watch">Apple Watch</SelectItem>
                      <SelectItem value="airpods">AirPods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stockage</Label>
                  <Input value={form.storage ?? ""} onChange={(e) => updateField("storage", e.target.value)} placeholder="ex: 256GB / 512GB" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix (MAD)</Label>
                  <Input type="number" value={form.price} onChange={(e) => updateField("price", +e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ancien prix (Biffé)</Label>
                  <Input type="number" value={form.original_price ?? ""} onChange={(e) => updateField("original_price", e.target.value ? +e.target.value : null)} placeholder="ex: 12000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL de l'image</Label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." />
                  <Button variant="outline" size="icon"><ImageIcon className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batterie Health %</Label>
                  <Input type="number" value={form.battery_health ?? ""} onChange={(e) => updateField("battery_health", e.target.value ? +e.target.value : null)} placeholder="100" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.in_stock} onCheckedChange={(v) => updateField("in_stock", v)} />
                    <Label>En stock</Label>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full py-6 text-lg" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Enregistrement..." : (editing ? "Mettre à jour" : "Créer le produit")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un produit..." 
                className="pl-10 bg-muted/50 focus:bg-background transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">{filteredProducts.length} produits trouvés</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Batterie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20">Chargement de l'inventaire...</TableCell></TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-20 text-muted-foreground">Aucun produit ne correspond à votre recherche.</TableCell></TableRow>
              ) : filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    <div>{p.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{p.storage || "Standard"}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground uppercase tracking-tight">
                      {p.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {p.price.toLocaleString()} MAD
                    {p.original_price && <div className="text-[10px] text-muted-foreground line-through decoration-destructive/50">{p.original_price.toLocaleString()}</div>}
                  </TableCell>
                  <TableCell>
                    {p.battery_health ? (
                      <span className={`text-xs font-medium ${p.battery_health >= 95 ? "text-green-600" : "text-amber-600"}`}>
                        {p.battery_health}%
                      </span>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    {p.in_stock ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" /> En stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive" /> Épuisé
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="hover:bg-primary/10 hover:text-primary"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
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
