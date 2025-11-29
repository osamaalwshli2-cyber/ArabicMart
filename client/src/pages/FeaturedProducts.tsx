import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import type { Product } from "@shared/schema";

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </CardContent>
    </Card>
  );
}

export default function FeaturedProducts() {
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter((p) => p.isFeatured);

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const price = parseFloat(p.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name":
        result.sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar"));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [products, sortBy, priceRange]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <a href="/" className="text-primary hover:underline flex items-center gap-1 text-sm">
              الرئيسية
              <ChevronRight className="h-4 w-4" />
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">المنتجات المميزة</span>
          </div>
          <h1 className="text-3xl font-bold" data-testid="text-featured-title">المنتجات المميزة</h1>
          <p className="text-muted-foreground mt-2">
            {filteredProducts.length} منتج
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-card rounded-lg border">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40" data-testid="select-sort">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
              <SelectItem value="name">الاسم</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40" data-testid="select-price">
              <SelectValue placeholder="نطاق السعر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأسعار</SelectItem>
              <SelectItem value="0-50">0 - 50 ر.س</SelectItem>
              <SelectItem value="50-100">50 - 100 ر.س</SelectItem>
              <SelectItem value="100-200">100 - 200 ر.س</SelectItem>
              <SelectItem value="200-500">200 - 500 ر.س</SelectItem>
              <SelectItem value="500-99999">أكثر من 500 ر.س</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">لا توجد منتجات مميزة</p>
                </div>
              )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
