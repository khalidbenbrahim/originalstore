import { Heart, MessageCircle, MoreHorizontal, Play } from "lucide-react";

const Facebook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
);

const FacebookNewsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-500 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4">
            <Facebook className="h-3.5 w-3.5 fill-white" />
            Facebook Live Feed
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Actualités Facebook
          </h2>
          <div className="w-20 h-1.5 bg-white/40 mx-auto mt-4 rounded-full" />
          <p className="text-white/80 mt-6 max-w-xl mx-auto text-lg">
            Restez informé de nos derniers arrivages et promotions exclusives.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-[420px] mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                <Facebook className="h-5 w-5 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">Chawni Live</p>
                <p className="text-xs text-gray-400">Just Now</p>
              </div>
              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Text content */}
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                Découvrez nos dernières offres et promotions exclusives en direct de notre communauté. Ne manquez rien ! 🔥
              </p>
            </div>

            {/* Video/Image container */}
            <div className="relative aspect-[4/3] bg-gray-100 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop"
                alt="Facebook post"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-blue-600 fill-blue-600 ml-1" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </span>
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">
                    👍
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">9.9K</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <MessageCircle className="w-4 h-4" />
                99 Comments
              </div>
            </div>
          </div>

          {/* CTA below card */}
          <div className="text-center mt-8">
            <a
              href="https://web.facebook.com/chawnilive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
            >
              <Facebook className="h-5 w-5 fill-blue-600" />
              Suivre sur Facebook
            </a>
            <p className="mt-4 text-xs font-semibold text-white/60 uppercase tracking-widest">
              Rejoignez plus de 10k abonnés
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacebookNewsSection;
