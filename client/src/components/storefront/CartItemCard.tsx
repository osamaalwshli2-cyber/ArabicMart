import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@shared/schema";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const imageUrl = product.images?.[0] || "https://placehold.co/100x100/e2e8f0/64748b?text=صورة";
  const itemTotal = parseFloat(product.price) * quantity;

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.nameAr}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 mb-2" data-testid={`text-cart-item-name-${product.id}`}>
            {product.nameAr}
          </h3>
          <p className="text-primary font-bold" data-testid={`text-cart-item-price-${product.id}`}>
            {parseFloat(product.price).toFixed(2)} ر.س
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(product.id)}
            className="text-destructive hover:text-destructive"
            data-testid={`button-remove-cart-item-${product.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 bg-muted rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              data-testid={`button-decrease-${product.id}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium" data-testid={`text-quantity-${product.id}`}>
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              data-testid={`button-increase-${product.id}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="font-bold text-sm" data-testid={`text-cart-item-total-${product.id}`}>
            {itemTotal.toFixed(2)} ر.س
          </p>
        </div>
      </div>
    </Card>
  );
}
