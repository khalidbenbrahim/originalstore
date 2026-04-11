import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_SETTINGS = {
  whatsapp_number: "212600000000",
  address: "Tanger, Maroc",
  facebook_url: "https://facebook.com",
  instagram_url: "https://instagram.com"
};

export function useSettings() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings" as any).select("*");
      if (error) return [];
      return data as unknown as { key: string; value: string }[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const getSetting = (key: keyof typeof DEFAULT_SETTINGS) => {
    const found = settings.find((s) => s.key === key);
    return found ? found.value : DEFAULT_SETTINGS[key];
  };

  return {
    settings: {
      whatsapp_number: getSetting("whatsapp_number"),
      address: getSetting("address"),
      facebook_url: getSetting("facebook_url"),
      instagram_url: getSetting("instagram_url"),
    },
    isLoading,
  };
}
