import { useState } from "react";
import { Send, Smartphone, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function TradeIn() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    model: "",
    battery: "",
    condition: "",
    description: "",
    phone: "",
  });

  const conditions = [
    { value: "excellent", label: t("tradeIn.conditionNew") },
    { value: "good", label: t("tradeIn.conditionGood") },
    { value: "fair", label: t("tradeIn.conditionFair") },
    { value: "poor", label: t("tradeIn.conditionPoor") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.model || !form.battery || !form.condition || !form.phone) return;
    setSubmitted(true);
    toast({ title: t("tradeIn.success") });
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("tradeIn.success")}</h2>
          <p className="text-muted-foreground">WhatsApp: +212 600 000 000</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("tradeIn.title")}</h1>
          <p className="text-muted-foreground">{t("tradeIn.subtitle")}</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("tradeIn.model")} *
                </label>
                <Input
                  placeholder="iPhone 13 Pro Max"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("tradeIn.battery")} *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={form.battery}
                    onChange={(e) => setForm({ ...form, battery: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("tradeIn.condition")} *
                  </label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    required
                  >
                    <option value="">--</option>
                    {conditions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp *
                </label>
                <Input
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("tradeIn.description")}
                </label>
                <Textarea
                  placeholder="..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full rounded-xl h-12 text-base">
                <Send className="h-5 w-5 mr-2" />
                {t("tradeIn.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
