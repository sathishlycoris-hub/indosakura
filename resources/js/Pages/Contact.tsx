import { useState } from "react";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { router, usePage, Head } from "@inertiajs/react";
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";

interface SiteSettings {
  contact_phone: string;
  contact_email: string;
  contact_address: string; contact_address_ja: string;
  contact_ind_phone: string; contact_ind_phone_ja: string;
  contact_ind_address: string; contact_ind_address_ja: string;
  contact_tagline_en: string; contact_tagline_ja: string;
  contact_heading_en: string; contact_heading_ja: string;
  contact_subtext_en: string; contact_subtext_ja: string;
}

interface Seo {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
}

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const CONTACT_DEFAULTS: SiteSettings = {
  contact_phone: "03-5633-7776",
  contact_email: "info.japan@indosakura.com",
  contact_address: "5-30-13 Toyo, Edogawa-ku, Tokyo",
  contact_address_ja: "東京都江戸川区東陽5-30-13",
  contact_ind_phone: "",
  contact_ind_phone_ja: "",
  contact_ind_address: "",
  contact_ind_address_ja: "",
  contact_tagline_en: "Trusted Indo-Sakura Partner",
  contact_tagline_ja: "信頼のインドサクラパートナー",
  contact_heading_en: "Let's build something together.",
  contact_heading_ja: "一緒に何かを作りましょう。",
  contact_subtext_en: "Reach Out and Connect with Indo Sakura for innovative technology solutions.",
  contact_subtext_ja: "革新的なテクノロジーソリューションのために、インドサクラにお問い合わせください。",
};

const Contact = () => {
  const { toast } = useToast();
  const { props } = usePage<{ lang: "en" | "ja"; siteSettings?: SiteSettings; seo?: Seo | null }>();
  const lang = props.lang;
  const cs: SiteSettings = { ...CONTACT_DEFAULTS, ...(props.siteSettings ?? {}) };
  const seo = props.seo;

  const t = (en: string, ja: string) => lang === "ja" ? ja || en : en;

  const initialFormState = {
    name_en: "", email: "", telephone: "", address: "",
    productService: "", recaptcha: "",
  };
  const [recaptchaToken, setRecaptchaToken] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    document.body.appendChild(script);

    (window as any).onContactRecaptchaVerify = (token: string) => {
      setFormData(prev => ({ ...prev, recaptcha: token }));
    };
  }, []);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name_en.trim()) errs.name_en = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.telephone.trim()) errs.telephone = "Phone number is required";
    if (!formData.address.trim()) errs.address = "Location is required";
    if (!formData.productService.trim()) errs.productService = "Project requirement is required";
    setErrors(errs);
    if (!formData.recaptcha) {
      errs.recaptcha = "Please complete the reCAPTCHA";
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Check your fields", description: "Please fix the highlighted errors before submitting.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    router.post(route("contact.store"), { ...formData }, {
      onSuccess: () => {
        (window as any).gtag_report_conversion?.();
        // Server redirects to /contact/thank-you on success — Inertia follows
        // it automatically, so no local toast/reset is needed here.
      },
      onError: () => toast({ title: "Submission failed", description: "Something went wrong. Please try again.", variant: "destructive" }),
      onFinish: () => setIsSubmitting(false),
    });
  };

  const inputClass = (key: string) =>
    `rounded-xl focus-visible:ring-primary focus-visible:border-primary ${errors[key] ? "border-red-500" : "border-border"}`;

  const ui = {
    fullName: t("Full Name", "お名前"),
    email: t("Email Address", "メールアドレス"),
    phone: t("Phone Number", "電話番号"),
    location: t("Location", "所在地"),
    projectLabel: t("Project Details", "プロジェクト詳細"),
    submitBtn: t("Send Message", "送信する"),
    submitting: t("Sending Message...", "送信中..."),
    namePh: t("John Doe", "山田太郎"),
    emailPh: t("john@example.com", "taro@example.com"),
    phonePh: t("090-0000-0000", "090-0000-0000"),
    addressPh: t("Tokyo, Japan", "東京都"),
    messagePh: t("How can we help you?", "どのようにお手伝いできますか？"),
  };

  return (
    <Layout>
      {/* ── SEO Head ── */}
      <Head>
        <title>
          {seo?.meta_title ?? (lang === "en" ? "Contact Us | Indo Sakura" : "お問い合わせ | インドサクラ")}
        </title>
        {seo?.meta_description && <meta name="description" content={seo.meta_description} />}
        {seo?.meta_keywords    && <meta name="keywords"    content={seo.meta_keywords}    />}
      </Head>

      <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950">
        <section className="py-20">
          <div className="container mx-auto px-4">

            <div className="max-w-2xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl">
                {lang === "ja" ? cs.contact_heading_ja || cs.contact_heading_en : cs.contact_heading_en}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t(cs.contact_subtext_en, cs.contact_subtext_ja)}
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-8 bg-primary p-8 rounded-3xl text-primary-foreground shadow-xl">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">{t("Contact Information", "お問い合わせ先")}</h3>
                  <p className="opacity-80 mb-8">{t("Fill up the form and our team will get back to you within 24 hours.", "フォームにご記入いただくと、24時間以内にご連絡いたします。")}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><Phone className="w-5 h-5" /></div>
                    <p>{cs.contact_phone}</p>
                  </div>
                 
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><MapPin className="w-5 h-5" /></div>
                    <p>{t(cs.contact_address, cs.contact_address_ja)}</p>
                  </div>
                  {(t(cs.contact_ind_phone, cs.contact_ind_phone_ja) || t(cs.contact_ind_address, cs.contact_ind_address_ja)) && (
                    <div className="pt-6 border-t border-white/10 space-y-6">
                      <p className="text-sm font-semibold opacity-90">{t("India Office", "インドオフィス")}</p>
                      {t(cs.contact_ind_phone, cs.contact_ind_phone_ja) && (
                        <div className="flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-xl"><Phone className="w-5 h-5" /></div>
                          <p>{t(cs.contact_ind_phone, cs.contact_ind_phone_ja)}</p>
                        </div>
                      )}
                      {t(cs.contact_ind_address, cs.contact_ind_address_ja) && (
                        <div className="flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-xl"><MapPin className="w-5 h-5" /></div>
                          <p>{t(cs.contact_ind_address, cs.contact_ind_address_ja)}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* <div className="pt-8 border-t border-white/10">
                    <p className="text-sm opacity-80 font-medium tracking-wide text-center lg:text-left">
                      {t(cs.contact_tagline_en, cs.contact_tagline_ja)}
                    </p>
                  </div> */}
                   <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><Mail className="w-5 h-5" /></div>
                    <p>{cs.contact_email}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-background border border-border rounded-3xl p-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-md font-semibold flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" />{ui.fullName}</label>
                      <Input name="name_en" placeholder={ui.namePh} value={formData.name_en} onChange={handleInputChange} className={inputClass("name_en")} />
                      {errors.name_en && <p className="text-red-500 text-xs">{errors.name_en}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-md font-semibold flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{ui.email}</label>
                      <Input type="email" name="email" placeholder={ui.emailPh} value={formData.email} onChange={handleInputChange} className={inputClass("email")} />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-md font-semibold flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{ui.phone}</label>
                      <Input name="telephone" placeholder={ui.phonePh} value={formData.telephone} onChange={handleInputChange} className={inputClass("telephone")} />
                      {errors.telephone && <p className="text-red-500 text-xs">{errors.telephone}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-md font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />{ui.location}</label>
                      <Input name="address" placeholder={ui.addressPh} value={formData.address} onChange={handleInputChange} className={inputClass("address")} />
                      {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>
                  </div>
                  <div className="space-y-2 mb-8">
                    <label className="text-md font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground" />{ui.projectLabel}</label>
                    <Textarea name="productService" placeholder={ui.messagePh} value={formData.productService} onChange={handleInputChange} rows={5} className={`${inputClass("productService")} resize-none`} />
                    {errors.productService && <p className="text-red-500 text-xs">{errors.productService}</p>}
                  </div>

                  {/* reCAPTCHA */}
                  <div
                    className="g-recaptcha mb-6"
                    data-sitekey={recaptchaSiteKey}
                    data-callback="onContactRecaptchaVerify"
                  />
                  {errors.recaptcha && <p className="text-red-500 text-xs mb-4">{errors.recaptcha}</p>}

                  <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold transition-all hover:opacity-90 active:scale-[0.98]" disabled={isSubmitting}>
                    {isSubmitting ? ui.submitting : <>{ui.submitBtn} <Send className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;