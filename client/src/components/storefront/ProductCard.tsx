import { useLocation } from "wouter";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const imageUrl = product.images?.[0] || "https://placehold.co/400x400/e2e8f0/64748b?text=صورة+المنتج";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleCardClick = () => {
    setLocation(`/product/${product.id}`);
  };

  return (
    <div data-testid={`link-product-${product.id}`} onClick={handleCardClick}>
      <Card className="group overflow-visible h-full hover-elevate cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-t-md">
          <img
            src={imageUrl}
            alt={product.nameAr}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground" data-testid={`badge-discount-${product.id}`}>
              خصم {discountPercent}%
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground" data-testid={`badge-featured-${product.id}`}>
              مميز
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10"
              onClick={handleAddToCart}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="h-10 w-10" data-testid={`button-view-${product.id}`}>
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]" data-testid={`text-product-name-${product.id}`}>
            {product.nameAr}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary font-bold text-lg" data-testid={`text-price-${product.id}`}>
              {parseFloat(product.price).toFixed(2)} ر.س
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through text-sm" data-testid={`text-original-price-${product.id}`}>
                {parseFloat(product.originalPrice!).toFixed(2)} ر.س
              </span>
            )}
          </div>
          {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <p className="text-destructive text-xs mt-2" data-testid={`text-low-stock-${product.id}`}>
              باقي {product.stock} فقط
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-muted-foreground text-xs mt-2" data-testid={`text-out-of-stock-${product.id}`}>
              نفذت الكمية
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
