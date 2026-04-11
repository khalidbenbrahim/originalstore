import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
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
      toast({ title: "Connexion échouée", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f0f1a]">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#003366] via-[#00549a] to-[#0097cc] p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-white text-xl tracking-tight">OriginalStore</span>
          </div>

          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Espace<br />
            <span className="text-white/70">Administrateur</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xs">
            Gérez votre boutique, vos produits, vidéos et témoignages depuis un panneau de contrôle centralisé.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { label: "Produits gérés", value: "50+" },
            { label: "Clients satisfaits", value: "1,200+" },
            { label: "Vidéos publiées", value: "80+" },
            { label: "Ventes/mois", value: "200+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 bg-[#0f0f1a]">
        <div className="w-full max-w-md">
          {/* Back to site */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>

          <div className="mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003366] to-[#0097cc] flex items-center justify-center mb-6 shadow-xl shadow-blue-900/40">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Connexion Admin</h2>
            <p className="text-gray-500 text-sm">Bienvenue sur le panneau de gestion de ChawniLive.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@chawnilive.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-700 focus:border-blue-500 focus:ring-blue-500/20 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-700 focus:border-blue-500 focus:ring-blue-500/20 h-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3.5 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-[#003366] to-[#0097cc] hover:from-[#004080] hover:to-[#00b3ee] shadow-lg shadow-blue-900/30 transition-all duration-300 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter →"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-8">
            Accès restreint aux administrateurs autorisés uniquement.
          </p>
        </div>
      </div>
    </div>
  );
}
