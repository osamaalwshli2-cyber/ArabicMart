import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            تسوق أفضل المنتجات بأسعار لا تُقاوم
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed" data-testid="text-hero-description">
            اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة. شحن سريع وخدمة عملاء متميزة.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/">
              <Button 
                size="lg" 
                className="gap-2" 
                data-testid="button-shop-now"
              >
                تسوق الآن
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </a>
            <a href="/featured">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20" 
                data-testid="button-featured"
              >
                المنتجات المميزة
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
