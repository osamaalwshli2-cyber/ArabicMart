import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, Store } from "lucide-react";

export default function AdminLanding() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
          <p className="text-muted-foreground">
            قم بتسجيل الدخول للوصول إلى لوحة تحكم المتجر
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <a href="/api/login" className="block">
            <Button size="lg" className="w-full gap-2" data-testid="button-admin-login">
              <Shield className="h-5 w-5" />
              تسجيل الدخول
            </Button>
          </a>
          <Link href="/" className="block">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Store className="h-5 w-5" />
              العودة للمتجر
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
