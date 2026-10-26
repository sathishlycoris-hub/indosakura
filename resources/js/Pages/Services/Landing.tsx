import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Serviceshead from "@/components/layout/Serviceshead";
import ContactCTA from "@/components/layout/Contact";
import ContactPopup from "@/components/ContactPopup";
import PageSeo, { PageSeoProps } from "@/components/PageSeo";
import {
  CheckCircle, Zap, ShieldCheck, Factory, ShoppingCart, Building2, Cpu, Shield, Globe, Cloud,
  Heart, Wallet, Truck, ChevronDown, ArrowRight, Sparkles, Layers, CheckCircle2, Star, Target,
  Lock, BadgeCheck, Lightbulb, TrendingUp, Smartphone, Code2, Briefcase,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePage } from "@inertiajs/react";

interface Simple { title: string; title_ja?: string; }
interface Listy extends Simple { description?: string; description_ja?: string; }
interface Stat { value: string; label: string; label_ja?: string; }
interface Step extends Listy { step_number?: number; }
interface Tech { category: string; category_ja?: string; items: string; }
interface Work extends Listy { capabilities?: string; capabilities_ja?: string; }
interface Faq { question: string; question_ja?: string; answer: string; answer_ja?: string; }

interface Landing {
  id: number; slug: string;
  title: string; title_ja?: string;
  eyebrow?: string; eyebrow_ja?: string;
  subtitle?: string; subtitle_ja?: string;
  hero_description?: string; hero_description_ja?: string;
  hero_image?: string | null;
  cta_label?: string; cta_label_ja?: string; cta_url?: string;
  secondary_cta_label?: string; secondary_cta_label_ja?: string; secondary_cta_url?: string;
  intro?: string; intro_ja?: string;
  trust_highlights?: Simple[]; stats?: Stat[];
  sub_services?: Listy[]; why_choose?: Listy[]; industries?: Listy[];
  tech_stack?: Tech[]; process_steps?: Step[]; portfolio?: Work[];
  engagement_models?: Listy[]; faqs?: Faq[];
  section_titles?: Record<string, { en?: string; ja?: string }>;
  cta_title?: string; cta_title_ja?: string; cta_description?: string; cta_description_ja?: string;
  service?: { id: number; title: string; title_ja?: string; slug: string } | null;
}

interface Props { landing: Landing; pageSeo?: PageSeoProps; }

const SUB_ICONS = [Smartphone, Code2, Layers, Briefcase, Sparkles, Cpu, TrendingUp, ShieldCheck];
const WHY_ICONS = [CheckCircle2, Star, Layers, Lock, Target, BadgeCheck, Lightbulb, TrendingUp];
const IND_ICONS = [Heart, ShoppingCart, Factory, Wallet, Truck, Building2, Shield, Globe, Cloud, Cpu];
const ENG_ICONS = [Target, Layers, Zap];
const icon = (pool: any[], i: number) => pool[i % pool.length];

AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 80, delay: 50 });

function SectionHeading({ title, subtitle, align = "center" }: { title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`} data-aos="fade-up">
      <div className={`flex items-center gap-3 mb-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="block w-8 h-1 rounded-full bg-primary" />
        <span className="block w-3 h-1 rounded-full bg-primary/40" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">{title}</h2>
      {subtitle && <p className={`mt-3 text-muted-foreground leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>}
    </div>
  );
}

export default function Landing({ landing, pageSeo }: Props) {
  const { lang } = usePage<{ lang: "en" | "ja" }>().props;
  const [popup, setPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const t = setTimeout(() => setPopup(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const v = (en?: string | null, ja?: string | null) =>
    ((lang === "ja" ? ja || en : en) || "").trim();
  const arr = <T,>(x?: T[]): T[] => (Array.isArray(x) ? x : []);

  // Admin-defined heading → fallback default
  const heading = (key: string, en: string, ja: string) => {
    const t = landing.section_titles?.[key];
    return (lang === "ja" ? t?.ja || t?.en : t?.en)?.trim() || (lang === "ja" ? ja : en);
  };

  const trust = arr(landing.trust_highlights);
  const stats = arr(landing.stats);
  const subServices = arr(landing.sub_services);
  const whyChoose = arr(landing.why_choose);
  const industries = arr(landing.industries);
  const tech = arr(landing.tech_stack);
  const steps = arr(landing.process_steps);
  const portfolio = arr(landing.portfolio);
  const engagement = arr(landing.engagement_models);
  const faqs = arr(landing.faqs);

  const title = v(landing.title, landing.title_ja);
  const ctaUrl = landing.cta_url || "/contact";
  const ctaLabel = v(landing.cta_label, landing.cta_label_ja) || (lang === "ja" ? "無料相談を予約する" : "Get a Free Consultation");
  const ctaTitle = v(landing.cta_title, landing.cta_title_ja);
  const ctaDesc = v(landing.cta_description, landing.cta_description_ja);
  const secLabel = v(landing.secondary_cta_label, landing.secondary_cta_label_ja);
  const eyebrow = v(landing.eyebrow, landing.eyebrow_ja) || (landing.service ? v(landing.service.title, landing.service.title_ja) : "");
  const hasIntro = !!v(landing.intro, landing.intro_ja);

  return (
    <Layout>
      {pageSeo && <PageSeo {...pageSeo} />}

      <div className="sticky top-16 lg:top-[101px] z-40 bg-white">
        <Serviceshead activeItem={landing.service ? { title: landing.title, title_ja: landing.title_ja, slug: landing.service.slug } : undefined} />
      </div>

      {/* HERO */}
      <section className="hero-gradient text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div data-aos="fade-right" className="w-full">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-white/60 text-sm font-medium mb-5 tracking-wide uppercase">
                <span className="w-5 h-px bg-white/60" />
                {eyebrow}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-white">{title}</h1>
            {v(landing.subtitle, landing.subtitle_ja) && (
              <p className="text-xl font-medium text-white/80 mb-4 leading-snug">{v(landing.subtitle, landing.subtitle_ja)}</p>
            )}
            {v(landing.hero_description, landing.hero_description_ja) && (
              <div className="prose max-w-full mb-8 text-base leading-relaxed [&_*]:!text-white"
                dangerouslySetInnerHTML={{ __html: v(landing.hero_description, landing.hero_description_ja) }} />
            )}

            {trust.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {trust.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white text-sm font-medium px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4" /> {v(t.title, t.title_ja)}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a href={ctaUrl}
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-colors shadow-lg text-sm">
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </a>
              {secLabel && landing.secondary_cta_url && (
                <a href={landing.secondary_cta_url}
                  className="inline-flex items-center gap-2 border border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  {secLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + STATS */}
      {(hasIntro || stats.length > 0) && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-5xl">
            {hasIntro && (
              <>
                <SectionHeading title={heading("about", "About Our Expertise", "私たちの強み")} />
                <div data-aos="fade-up" className="prose prose-lg max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: v(landing.intro, landing.intro_ja) }} />
              </>
            )}
            {stats.length > 0 && (
              <div className={`grid grid-cols-2 ${stats.length >= 4 ? "md:grid-cols-4" : stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4 ${hasIntro ? "mt-12" : ""}`}>
                {stats.map((s, i) => (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
                    className="bg-[#F6F6F6] border border-border rounded-xl p-6 text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{v(s.label, s.label_ja)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {subServices.length > 0 && (
        <section className="py-20 bg-[#F6F6F6]">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionHeading title={heading("services", `Our ${title} Services`, "サービス内容")} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subServices.map((s, i) => {
                const Icon = icon(SUB_ICONS, i);
                return (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 50}
                    className="bg-white p-6 rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">{v(s.title, s.title_ja)}</h3>
                    {v(s.description, s.description_ja) && (
                      <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: v(s.description, s.description_ja) }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE */}
      {whyChoose.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div data-aos="fade-right" className="lg:sticky lg:top-32">
                <SectionHeading align="left" title={heading("why", `Why Choose Indo-Sakura for ${title}?`, "なぜIndoSakuraを選ぶのか？")} />
                <a href={ctaUrl} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-xl hover:opacity-90 transition-colors text-sm">
                  {ctaLabel} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-4" data-aos="fade-left">
                {whyChoose.map((w, i) => {
                  const Icon = icon(WHY_ICONS, i);
                  return (
                    <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
                      className="flex gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1 text-base">{v(w.title, w.title_ja)}</h3>
                        {v(w.description, w.description_ja) && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{v(w.description, w.description_ja)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* INDUSTRIES */}
      {industries.length > 0 && (
        <section className="py-16 bg-[#F6F6F6]">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionHeading title={heading("industries", "Industries We Serve", "対象業界")} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind, i) => {
                const Icon = icon(IND_ICONS, i);
                return (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                    className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <Icon className="w-10 h-10 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{v(ind.title, ind.title_ja)}</h3>
                        {v(ind.description, ind.description_ja) && (
                          <p className="text-sm text-muted-foreground">{v(ind.description, ind.description_ja)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TECHNOLOGIES */}
      {tech.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionHeading title={heading("tech", "Technologies & Platforms", "テクノロジー＆プラットフォーム")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tech.map((t, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 50}
                  className="flex gap-4 items-start bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-300">
                  <div className="flex-shrink-0 w-1 self-stretch rounded-full bg-primary/60" />
                  <div>
                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-1">{v(t.category, t.category_ja)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.items}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {steps.length > 0 && (
        <section className="py-20 bg-[#F6F6F6]">
          <div className="container mx-auto px-6 max-w-5xl">
            <SectionHeading title={heading("process", "Our Development Process", "開発プロセス")} />
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-primary/20 hidden md:block" />
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 70}
                    className="flex gap-5 bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300 relative">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-lg shadow-md z-10">
                      {step.step_number ?? i + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-foreground mb-1 text-base leading-snug">{v(step.title, step.title_ja)}</h3>
                      {v(step.description, step.description_ja) && (
                        <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: v(step.description, step.description_ja) }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PORTFOLIO */}
      {portfolio.length > 0 && (
        <section id="portfolio" className="py-20 bg-background scroll-mt-40">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionHeading title={heading("portfolio", "Our Success Stories", "導入事例")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.map((p, i) => {
                const caps = v(p.capabilities, p.capabilities_ja).split(",").map(c => c.trim()).filter(Boolean);
                return (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-2 leading-snug">{v(p.title, p.title_ja)}</h3>
                    {v(p.description, p.description_ja) && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{v(p.description, p.description_ja)}</p>
                    )}
                    {caps.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-border">
                        {caps.map((c, j) => (
                          <span key={j} className="bg-primary/5 border border-primary/20 text-primary text-xs font-medium px-3 py-1 rounded-full">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ENGAGEMENT MODELS */}
      {engagement.length > 0 && (
        <section className="py-16 bg-[#F6F6F6]">
          <div className="container mx-auto px-6 max-w-7xl">
            <SectionHeading title={heading("engagement", "Flexible Engagement Models", "柔軟な契約モデル")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {engagement.map((e, i) => {
                const Icon = icon(ENG_ICONS, i);
                return (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 70}
                    className="bg-white p-6 rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">{v(e.title, e.title_ja)}</h3>
                    {v(e.description, e.description_ja) && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{v(e.description, e.description_ja)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:sticky lg:top-32" data-aos="fade-right">
                <SectionHeading align="left" title={heading("faq", "Frequently Asked Questions", "よくある質問")} />
                <a href={ctaUrl} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-colors text-sm">
                  {lang === "ja" ? "お問い合わせ" : "Still have questions?"} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="lg:col-span-2 space-y-3" data-aos="fade-left">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-[#F6F6F6] border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors duration-200">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-start gap-4 px-6 py-5 text-left hover:bg-primary/5 transition-colors">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs mt-0.5">Q</span>
                      <span className="flex-1 font-semibold text-foreground text-sm leading-snug pt-0.5">{v(faq.question, faq.question_ja)}</span>
                      <ChevronDown className={`flex-shrink-0 w-4 h-4 text-primary mt-1 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="flex gap-4 px-6 pb-6">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mt-0.5">A</span>
                        <div className="flex-1 text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: v(faq.answer, faq.answer_ja) }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CLOSING CTA BAND */}
      {ctaTitle && (
        <section className="hero-gradient text-primary-foreground py-14">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{ctaTitle}</h2>
                {ctaDesc && <p className="text-white/80 leading-relaxed">{ctaDesc}</p>}
              </div>
              <a href={ctaUrl} className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-colors shadow-lg text-sm">
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      <ContactCTA />
      <ContactPopup open={popup} onClose={() => setPopup(false)} />
    </Layout>
  );
}
