import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, Package, Truck, Shield } from "lucide-react";
import { useState } from "react";
import type { Product, Category } from "@shared/schema";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", product?.categoryId],
    enabled: !!product?.categoryId,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) =>
      products
        .filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id)
        .slice(0, 4),
    enabled: !!product?.categoryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
            <Link href="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["https://placehold.co/800x800/e2e8f0/64748b?text=صورة+المنتج"];
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "تمت الإضافة للسلة",
      description: `${product.nameAr} (${quantity})`,
    });
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronLeft className="h-4 w-4" />
          {category && (
            <>
              <Link href={`/?category=${category.id}`} className="hover:text-primary">
                {category.nameAr}
              </Link>
              <ChevronLeft className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground">{product.nameAr}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImageIndex]}
                alt={product.nameAr}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleNextImage}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={handlePrevImage}
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </>
              )}
              {hasDiscount && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                  خصم {discountPercent}%
                </Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      idx === selectedImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    data-testid={`button-thumbnail-${idx}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2" data-testid="text-product-title">
                {product.nameAr}
              </h1>
              {category && (
                <Link href={`/?category=${category.id}`}>
                  <Badge variant="outline" className="text-sm">
                    {category.nameAr}
                  </Badge>
                </Link>
              )}
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                {parseFloat(product.price).toFixed(2)} ر.س
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through" data-testid="text-original-price">
                  {parseFloat(product.originalPrice!).toFixed(2)} ر.س
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {product.stock && product.stock > 0 ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  متوفر ({product.stock} قطعة)
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  غير متوفر
                </Badge>
              )}
              {product.sku && (
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              )}
            </div>

            {product.descriptionAr && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                  {product.descriptionAr}
                </p>
              </div>
            )}

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">الكمية:</span>
                  <div className="flex items-center gap-2 bg-muted rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-decrease-quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={product.stock !== null && quantity >= product.stock}
                      data-testid="button-increase-quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  إضافة للسلة
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">جودة عالية</p>
                  <p className="text-xs text-muted-foreground">منتجات أصلية</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">شحن سريع</p>
                  <p className="text-xs text-muted-foreground">توصيل لباب المنزل</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">ضمان الجودة</p>
                  <p className="text-xs text-muted-foreground">إرجاع مجاني</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">منتجات مشابهة</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
