import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User } from "lucide-react";

interface CheckoutAuthModalProps {
  open: boolean;
  onSuccess: (customerId: number, customerName: string, customerEmail: string) => void;
}

export function CheckoutAuthModal({ open, onSuccess }: CheckoutAuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password confirmation for registration
      if (!isLogin && password !== passwordConfirm) {
        toast({
          title: "خطأ",
          description: "كلمات المرور غير متطابقة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? "/api/customers/login" : "/api/customers/register";
      const payload = isLogin
        ? { email, password }
        : { name, email, password, passwordConfirm };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشلت العملية");
      }

      const data = await response.json();
      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customerId", data.customerId.toString());

      toast({
        title: isLogin ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح",
      });

      onSuccess(data.customerId, data.customerName, data.customerEmail);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ ما",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const title = isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد";
  const description = isLogin
    ? "تسجيل الدخول لتتبع طلباتك بسهولة"
    : "أنشئ حساباً لتتبع جميع طلباتك";

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" aria-describedby="checkout-auth-description">
        <DialogHeader>
          <DialogTitle data-testid="text-auth-title">{title}</DialogTitle>
          <DialogDescription id="checkout-auth-description">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                الاسم الكامل
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                data-testid="input-name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              كلمة المرور
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              dir="ltr"
              data-testid="input-password"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                تأكيد كلمة المرور
              </Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required={!isLogin}
                minLength={6}
                dir="ltr"
                data-testid="input-password-confirm"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-submit-auth"
          >
            {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setPassword("");
              }}
              className="text-sm text-primary hover:underline"
              data-testid="button-toggle-auth"
            >
              {isLogin
                ? "ليس لديك حساب؟ إنشاء حساب"
                : "هل لديك حساب؟ تسجيل دخول"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
