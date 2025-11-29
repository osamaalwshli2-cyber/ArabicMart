import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
          <p className="text-muted-foreground mb-6">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="gap-2 w-full sm:w-auto" data-testid="button-go-home">
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2" data-testid="button-go-back">
              <ArrowLeft className="h-4 w-4" />
              الرجوع
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
