import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Filter } from "lucide-react";
import { Link } from "wouter";
import type { Product, Category } from "@shared/schema";
import { useState, useMemo } from "react";

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

export default function Home() {
  const [location, setLocation] = useLocation();
  
  // Parse query parameters from current location
  const urlParts = location.split("?");
  const searchParams = new URLSearchParams(urlParts[1] || "");
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const featuredFilter = searchParams.get("featured") === "true";

  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.descriptionAr?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === parseInt(categoryFilter));
    }

    if (featuredFilter) {
      result = result.filter((p) => p.isFeatured);
    }

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
  }, [products, searchQuery, categoryFilter, featuredFilter, sortBy, priceRange]);

  const featuredProducts = useMemo(() => {
    return products?.filter((p) => p.isFeatured).slice(0, 4) || [];
  }, [products]);

  const showHero = !searchQuery && !categoryFilter && !featuredFilter;
  const pageTitle = searchQuery
    ? `نتائج البحث: "${searchQuery}"`
    : categoryFilter && categoryFilter !== "all"
    ? categories?.find((c) => c.id === parseInt(categoryFilter))?.nameAr || "المنتجات"
    : featuredFilter
    ? "المنتجات المميزة"
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {showHero && <HeroSection />}

      <main className="flex-1 container mx-auto px-4 py-8">
        {showHero && categories && categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-testid="text-categories-title">الفئات</h2>
              <Link href="/?category=all" className="text-primary flex items-center gap-1 text-sm font-medium">
                عرض الكل
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoriesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-md" />
                  ))
                : categories.slice(0, 4).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
            </div>
          </section>
        )}

        {showHero && featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-testid="text-featured-title">المنتجات المميزة</h2>
              <Link href="/?featured=true" className="text-primary flex items-center gap-1 text-sm font-medium">
                عرض الكل
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section>
          {pageTitle && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold" data-testid="text-page-title">{pageTitle}</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} منتج
              </p>
            </div>
          )}

          {!showHero && (
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

              {categoryFilter !== "all" && categories && (
                <Select
                  value={categoryFilter || "all"}
                  onValueChange={(val) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (val === "all") {
                      newParams.delete("category");
                    } else {
                      newParams.set("category", val);
                    }
                    window.history.pushState({}, "", `/?${newParams.toString()}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                >
                  <SelectTrigger className="w-40" data-testid="select-category">
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {showHero && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-testid="text-all-products-title">جميع المنتجات</h2>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {!productsLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4" data-testid="text-no-products">
                لم يتم العثور على منتجات
              </p>
              <Link href="/">
                <Button variant="outline">العودة للرئيسية</Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
