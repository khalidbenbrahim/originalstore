import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import TradeIn from "./pages/TradeIn";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductsManager from "./pages/admin/ProductsManager";
import TikTokManager from "./pages/admin/TikTokManager";
import YouTubeManager from "./pages/admin/YouTubeManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import SettingsManager from "./pages/admin/SettingsManager";
import OrdersPage from "./pages/admin/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin routes — no Header/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="tiktok" element={<TikTokManager />} />
                <Route path="youtube" element={<YouTubeManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsManager />} />
              </Route>

              {/* Public routes */}
              <Route
                path="*"
                element={
                  <>
                    <Header />
                    <main className="min-h-screen">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/trade-in" element={<TradeIn />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
