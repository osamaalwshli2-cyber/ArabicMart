import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">م</span>
              </div>
              <span className="font-bold text-xl">متجر العربي</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              متجرك الإلكتروني المفضل للتسوق. نقدم لك أفضل المنتجات بأسعار مميزة وخدمة عملاء متميزة.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/?category=all" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/?featured=true" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  المنتجات المميزة
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  سلة التسوق
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>info@arabstore.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">تابعنا</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-elevate"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-elevate"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-elevate"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} متجر العربي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
