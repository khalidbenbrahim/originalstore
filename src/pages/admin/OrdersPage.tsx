import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const demoInquiries = [
  {
    id: "ORD-7281",
    customer: "Mehdi Alami",
    product: "iPhone 15 Pro Max - Blue",
    date: "Il y a 2 heures",
    status: "pending",
    source: "WhatsApp",
  },
  {
    id: "ORD-7280",
    customer: "Sara Tazi",
    product: "AirPods Pro 2 (USB-C)",
    date: "Il y a 5 heures",
    status: "completed",
    source: "Instagram",
  },
  {
    id: "ORD-7279",
    customer: "Youssef Bennani",
    product: "Apple Watch Ultra 2",
    date: "Hier, 18:30",
    status: "pending",
    source: "WhatsApp",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Demandes & Commandes</h2>
          <p className="text-muted-foreground mt-1">Gérez les demandes de renseignements et le suivi WhatsApp.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
             <Filter className="h-4 w-4 mr-2" /> Filtrer
           </Button>
           <Button>Exporter CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Demandes du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600 mt-1">+20% par rapport à hier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En cours de traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Réponse attendue sur WhatsApp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-green-600 mt-1">Excellent ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inquiries Récentes</CardTitle>
              <CardDescription>Historique des clics WhatsApp et demandes directes</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-9 bg-muted/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoInquiries.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary font-bold">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {order.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-whatsapp/5 text-whatsapp border-whatsapp/20 gap-1">
                      <MessageCircle className="h-3 w-3" /> {order.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.status === "pending" ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                        <AlertCircle className="h-3 w-3" /> En attente
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Finalisé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/20 border border-dashed rounded-xl text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">💡 Conseil d'expert</p>
        <p className="text-sm text-balance mt-1">
          Pensez à marquer les commandes comme "Finalisées" pour un meilleur suivi de votre chiffre d'affaires.
        </p>
      </div>
    </div>
  );
}
