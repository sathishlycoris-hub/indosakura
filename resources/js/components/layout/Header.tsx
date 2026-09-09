import { Link, usePage } from "@inertiajs/react";
import { Globe } from "lucide-react";
import { useState } from "react";
// import { useHeaderHeight } from "@/hooks/useHeaderHeight";

interface SiteSettings {
  logo_image: string | null;
  nav1_en: string; nav1_ja: string; nav1_href: string;
  nav2_en: string; nav2_ja: string; nav2_href: string;
  nav3_en: string; nav3_ja: string; nav3_href: string;
  nav4_en: string; nav4_ja: string; nav4_href: string;
  nav5_en: string; nav5_ja: string; nav5_href: string;
  nav6_en: string; nav6_ja: string; nav6_href: string;
  contact_label_en: string;
  contact_label_ja: string;
}

// Fallback nav used before DB has any data
const NAV_DEFAULTS: SiteSettings = {
  logo_image: null,
  nav1_en: "Products",       nav1_ja: "ソリューション", nav1_href: "/solutions",
  nav2_en: "Services",       nav2_ja: "サービス",       nav2_href: "/services",
  nav3_en: "Insights",       nav3_ja: "導入事例",       nav3_href: "/blogs",
  nav4_en: "Corporate Info", nav4_ja: "企業情報",       nav4_href: "/corporate-info",
  nav5_en: "Careers",        nav5_ja: "採用情報",       nav5_href: "/recruitment",
  nav6_en: "India Desks",    nav6_ja: "インドデスク",   nav6_href: "/india-desks",
  contact_label_en: "Contact us",
  contact_label_ja: "お問い合わせ",
}; 

const Header = () => {
  // 'lang' comes from SetLocale middleware via HandleInertiaRequests — now a
  // pure session value (single domain, indosakura.co.jp retired). The
  // switcher is always shown; clicking it hits /switch-language/{lang}
  // (routes/web.php), which flips the session value and redirects back to
  // the same path.
  const { url, props } = usePage<{ lang: "en" | "ja"; siteSettings?: SiteSettings }>();
  const lang = props.lang;
  const s: SiteSettings = props.siteSettings ?? NAV_DEFAULTS;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchLang = (next: "en" | "ja") => {
    if (next === lang) return;
    // A full browser navigation (not an Inertia visit) keeps this simple and
    // guarantees the new session language is reflected on the reloaded page.
    // window.location.pathname + search preserves the current page and any
    // query string; the server redirects back to the same path.
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/switch-language/${next}?path=${encodeURIComponent(currentPath)}`;
  };

  // Build nav array from CMS
  const navItems = [
    { label_en: s.nav1_en, label_ja: s.nav1_ja, href: s.nav1_href },
    { label_en: s.nav2_en, label_ja: s.nav2_ja, href: s.nav2_href },
    { label_en: s.nav3_en, label_ja: s.nav3_ja, href: s.nav3_href },
    { label_en: s.nav4_en, label_ja: s.nav4_ja, href: s.nav4_href },
    { label_en: s.nav5_en, label_ja: s.nav5_ja, href: s.nav5_href },
    { label_en: s.nav6_en, label_ja: s.nav6_ja, href: s.nav6_href },
  ].filter((item) => item.href); // skip empty rows

  const logoSrc = s.logo_image ? `/storage/${s.logo_image}` : "/image/logo.png";
  const contactLabel = lang === "ja" ? s.contact_label_ja : s.contact_label_en;

  const isActive = (href: string) => {
    if (!href) return false;
    if (href === "/") return url === "/";
    if (href === "/corporate-info") return url === "/corporate-info" || url.startsWith("/corporate");
    return url === href || url.startsWith(href + "/");
  };

  return (
    <header id="site-header" className="sticky top-0 z-50 bg-background border-b border-border w-full">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── DESKTOP TOP BAR ─────────────────────────── */}
        <div className="hidden lg:flex flex-col items-end pt-2">
          <div className="flex items-center gap-3 text-[15px] font-semibold">
            <Link href="/contact" className="hover:text-primary transition-colors">
              {contactLabel}
            </Link>

            <div className="flex items-center gap-1 pl-3 border-l border-border" aria-label="Language switcher">
              <Globe className="w-4 h-4 text-muted-foreground mr-1" />
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={`px-1.5 transition-colors ${lang === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                aria-current={lang === "en"}
              >
                EN
              </button>
              <span className="text-border">/</span>
              <button
                type="button"
                onClick={() => switchLang("ja")}
                className={`px-1.5 transition-colors ${lang === "ja" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                aria-current={lang === "ja"}
              >
                JA
              </button>
            </div>
          </div>
          <div className="w-72 border-b border-border mt-1" />
        </div>

        {/* ── MAIN NAV BAR ────────────────────────────── */}
        <div className="flex items-center justify-between h-16">

          {/* LOGO — CMS-driven, responsive */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src={logoSrc}
              alt="logo"
              className="h-10 sm:h-12 lg:h-16 w-auto max-w-[120px] lg:max-w-[160px] object-contain hover:scale-105 transition-transform relative lg:-top-5"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[16px] font-semibold transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-foreground"}`}
              >
                {lang === "ja" ? item.label_ja : item.label_en}
              </Link>
            ))}
          </nav>

          {/* HAMBURGER */}
          <button className="lg:hidden p-2 focus:outline-none flex-shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-[2px] w-full bg-foreground transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-[2px] w-full bg-foreground transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-full bg-foreground transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* ── MOBILE NAV ──────────────────────────────── */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg font-semibold ${isActive(item.href) ? "text-primary" : "text-foreground"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {lang === "ja" ? item.label_ja : item.label_en}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <div className="space-y-4">
                <Link href="/contact" className="flex items-center gap-2 font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <Globe className="w-5 h-5 text-primary" />
                  {contactLabel}
                </Link>

                <div className="flex items-center gap-2 font-semibold" aria-label="Language switcher">
                  <button
                    type="button"
                    onClick={() => switchLang("en")}
                    className={lang === "en" ? "text-primary" : "text-foreground"}
                    aria-current={lang === "en"}
                  >
                    EN
                  </button>
                  <span className="text-border">/</span>
                  <button
                    type="button"
                    onClick={() => switchLang("ja")}
                    className={lang === "ja" ? "text-primary" : "text-foreground"}
                    aria-current={lang === "ja"}
                  >
                    JA
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;