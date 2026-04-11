import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, BarChart3, Package, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@chawnilive.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Connexion échouée", description: "Email ou mot de passe incorrect.", variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003366 0%, #005599 50%, #0077cc 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 bg-white blur-3xl" />

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-xl tracking-tight leading-none">ChawniLive</div>
              <div className="text-white/50 text-xs font-medium tracking-widest uppercase">Admin Panel</div>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-5">
            Gérez votre<br />
            <span className="text-white/60">boutique</span><br />
            facilement.
          </h1>
          <p className="text-white/50 leading-relaxed max-w-xs">
            Tableau de bord complet pour gérer vos produits, vidéos, témoignages et paramètres en temps réel.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Package, label: "Gestion des produits & inventaire" },
            { icon: Video, label: "Vidéos TikTok & YouTube" },
            { icon: BarChart3, label: "Statistiques et commandes" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <f.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 sm:px-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-10">
            ← Retour au site
          </Link>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}>
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Connexion</h2>
                <p className="text-gray-400 text-sm">Espace administrateur sécurisé</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@chawnilive.com"
                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="pl-10 pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-base font-bold text-white transition-all duration-300 shadow-lg mt-2"
                style={{ background: "linear-gradient(135deg, #003366, #0077cc)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  "Se connecter au Dashboard →"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1">📋 Identifiants Admin</p>
              <p className="text-xs text-blue-500">Email : <span className="font-mono font-bold">admin@chawnilive.com</span></p>
              <p className="text-xs text-blue-500">Mot de passe : <span className="font-mono font-bold">Ch@wni2026!Admin</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
