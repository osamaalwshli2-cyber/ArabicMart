import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [, setLocation] = useLocation();
  const imageUrl = category.imageUrl || "https://placehold.co/600x300/e2e8f0/64748b?text=صورة+الفئة";

  const handleCategoryClick = () => {
    setLocation(`/?category=${category.id}`);
  };

  return (
    <div data-testid={`link-category-${category.id}`} onClick={handleCategoryClick}>
      <Card className="group overflow-visible hover-elevate cursor-pointer">
        <div className="relative h-32 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt={category.nameAr}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <h3 className="text-white font-bold text-lg" data-testid={`text-category-name-${category.id}`}>
              {category.nameAr}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
}
