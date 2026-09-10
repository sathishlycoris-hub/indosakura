import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

type Tab =
  | "header"
  | "footer_text"
  | "footer_links"
  | "social"
  | "floating"
  | "contact"
  | "cta"
  | "insights"
  | "sitemap"
  | "corpnav";

// ── Reusable Field ──────────────────────────────────────────
function Field({
  label, value, onChange, lang, placeholder, type = "text", textarea = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  lang?: "en" | "ja"; placeholder?: string; type?: string; textarea?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}{lang && <span className="text-xs text-primary ml-1">({lang.toUpperCase()})</span>}
      </label>
      {textarea
        ? <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} />
        : <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

// ── Reusable Link Row (EN / JA / href) ──────────────────────
function LinkRow({
  prefix, num, label, data, set,
}: {
  prefix: string; num: number; label: string;
  data: Record<string, any>; set: (k: string, v: string) => void;
}) {
  const ek = `${prefix}${num}_en`;
  const jk = `${prefix}${num}_ja`;
  const hk = `${prefix}${num}_href`;
  return (
    <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 items-end border rounded-lg p-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">{label} — EN</label>
        <Input value={data[ek] ?? ""} onChange={(e) => set(ek, e.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">{label} — JA</label>
        <Input value={data[jk] ?? ""} onChange={(e) => set(jk, e.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">URL / Path</label>
        <Input value={data[hk] ?? ""} onChange={(e) => set(hk, e.target.value)} placeholder="/path" />
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────
export default function SiteSettingsIndex() {
  const { settings } = usePage<{ settings: Record<string, any> }>().props;

  const [activeTab, setActiveTab] = useState<Tab>("header");
  const [activeLang, setActiveLang] = useState<"en" | "ja">("en");

  const { data, setData, post, processing, wasSuccessful } = useForm<Record<string, any>>({
    ...settings,
    logo_image: null,
    footer_logo_image: null,
  });

  const save = () => post(route("admin.site-settings.update"), { forceFormData: true });
  const set = (k: string, v: string) => setData(k as any, v);
  const l = activeLang;

  const tabs: { key: Tab; label: string }[] = [
    { key: "header", label: "Header & Nav" },
    { key: "footer_text", label: "Footer Text" },
    { key: "footer_links", label: "Footer Links" },
    { key: "social", label: "Social Media" },
    { key: "floating", label: "Floating Buttons" },
    { key: "contact", label: "Contact Page" },
    { key: "cta", label: "Contact CTA" },
    { key: "insights", label: "Insights Nav" },
    // { key: "sitemap",      label: "Sitemap Links" },
    { key: "corpnav", label: "Corporate Nav" },
  ];

  return (
    <Authenticated header={<h2 className="text-xl font-bold">Site Settings CMS</h2>}>

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage header, footer, social links, floating buttons, contact info, and navigation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {wasSuccessful && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <div className="flex gap-2">
            <Button type="button" size="sm" variant={l === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>English</Button>
            <Button type="button" size="sm" variant={l === "ja" ? "default" : "outline"} onClick={() => setActiveLang("ja")}>Japanese</Button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ HEADER & NAV ══════════════════════════════════ */}
      {activeTab === "header" && (
        <div className="space-y-8 max-w-3xl">
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Logo</h3>
            {settings.logo_image
              ? <img src={`/storage/${settings.logo_image}`} className="h-14 rounded border object-contain bg-white p-2" alt="logo" />
              : <p className="text-xs text-muted-foreground">Current: /image/logo.png (default)</p>
            }
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Upload New Logo</label>
              <Input type="file" accept="image/*" onChange={(e) => setData("logo_image" as any, e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Contact Link Label</h3>
            <Field label="Contact Label" value={data[l === "en" ? "contact_label_en" : "contact_label_ja"] ?? ""}
              onChange={(v) => set(l === "en" ? "contact_label_en" : "contact_label_ja", v)} lang={l} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Navigation Links</h3>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n}>
                <p className="text-xs text-muted-foreground mb-1">Nav Item {n}</p>
                <LinkRow prefix="nav" num={n} label={`Nav ${n}`} data={data} set={set} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ FOOTER TEXT ═══════════════════════════════════ */}
      {activeTab === "footer_text" && (
        <div className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Footer Logo</h3>
            {settings.footer_logo_image
              ? <img src={`/storage/${settings.footer_logo_image}`} className="h-14 rounded border object-contain bg-white p-2" alt="footer logo" />
              : <p className="text-xs text-muted-foreground">Current: /image/logo20.png (default)</p>
            }
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Upload New Footer Logo</label>
              <Input type="file" accept="image/*" onChange={(e) => setData("footer_logo_image" as any, e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Column Headings</h3>
            <Field label="Company Column" value={data[l === "en" ? "footer_company_heading_en" : "footer_company_heading_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_company_heading_en" : "footer_company_heading_ja", v)} lang={l} />
            <Field label="Resources Column" value={data[l === "en" ? "footer_resources_heading_en" : "footer_resources_heading_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_resources_heading_en" : "footer_resources_heading_ja", v)} lang={l} />
            <Field label="Solutions Column" value={data[l === "en" ? "footer_solutions_heading_en" : "footer_solutions_heading_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_solutions_heading_en" : "footer_solutions_heading_ja", v)} lang={l} />
            <Field label="Services Column" value={data[l === "en" ? "footer_services_heading_en" : "footer_services_heading_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_services_heading_en" : "footer_services_heading_ja", v)} lang={l} />
            <Field
              label="India Desks Column"
              value={data[l === "en" ? "footer_india_desks_heading_en" : "footer_india_desks_heading_ja"] ?? ""}
              onChange={(v) => set(l === "en" ? "footer_india_desks_heading_en" : "footer_india_desks_heading_ja", v)}
              lang={l}
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Bottom Bar</h3>
            <Field label="Copyright" value={data[l === "en" ? "footer_copyright_en" : "footer_copyright_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_copyright_en" : "footer_copyright_ja", v)} lang={l} />
            <Field label="Offices Line" value={data[l === "en" ? "footer_offices_en" : "footer_offices_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_offices_en" : "footer_offices_ja", v)} lang={l} />
            <Field label="Sitemap Label" value={data[l === "en" ? "footer_sitemap_en" : "footer_sitemap_ja"] ?? ""} onChange={(v) => set(l === "en" ? "footer_sitemap_en" : "footer_sitemap_ja", v)} lang={l} />
          </div>
        </div>
      )}

      {/* ══ FOOTER LINKS ══════════════════════════════════ */}
      {activeTab === "footer_links" && (
        <div className="space-y-8 max-w-3xl">
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Company Column Links</h3>
            {[1, 2, 3, 4, 5].map((n) => <LinkRow key={n} prefix="fc" num={n} label={`Link ${n}`} data={data} set={set} />)}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Resources Column Links</h3>
            {[1, 2, 3, 4].map((n) => <LinkRow key={n} prefix="fr" num={n} label={`Link ${n}`} data={data} set={set} />)}
          </div>
        </div>
      )}

      {/* ══ SOCIAL MEDIA ══════════════════════════════════ */}
      {activeTab === "social" && (
        <div className="space-y-4 max-w-lg">
          <p className="text-sm text-muted-foreground">Full URLs. Leave blank to hide the icon.</p>
          <Field label="Facebook URL" value={data.social_facebook ?? ""} onChange={(v) => set("social_facebook", v)} placeholder="https://www.facebook.com/..." />
          <Field label="X (Twitter) URL" value={data.social_x ?? ""} onChange={(v) => set("social_x", v)} placeholder="https://x.com/..." />
          <Field label="LinkedIn URL" value={data.social_linkedin ?? ""} onChange={(v) => set("social_linkedin", v)} placeholder="https://www.linkedin.com/company/..." />
          <Field label="YouTube URL" value={data.social_youtube ?? ""} onChange={(v) => set("social_youtube", v)} placeholder="https://www.youtube.com/@..." />
          <Field label="Instagram URL" value={data.social_instagram ?? ""} onChange={(v) => set("social_instagram", v)} placeholder="https://www.instagram.com/..." />
        </div>
      )}

      {/* ══ FLOATING ACTIONS ══════════════════════════════ */}
      {activeTab === "floating" && (
        <div className="space-y-4 max-w-lg">
          <Field label="Phone (with country code)" value={data.float_phone ?? ""} onChange={(v) => set("float_phone", v)} placeholder="+819044078453" />
          <Field label="Email Address" value={data.float_email ?? ""} onChange={(v) => set("float_email", v)} type="email" />
          <Field label="WhatsApp Number (no +)" value={data.float_whatsapp ?? ""} onChange={(v) => set("float_whatsapp", v)} />
          <Field label="WhatsApp Default Message" value={data.float_whatsapp_message ?? ""} onChange={(v) => set("float_whatsapp_message", v)} />
        </div>
      )}

      {/* ══ CONTACT PAGE ══════════════════════════════════ */}
      {activeTab === "contact" && (
        <div className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Page Hero</h3>
            <Field label="Heading" value={data[l === "en" ? "contact_heading_en" : "contact_heading_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_heading_en" : "contact_heading_ja", v)} lang={l} />
            <Field label="Sub-text" value={data[l === "en" ? "contact_subtext_en" : "contact_subtext_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_subtext_en" : "contact_subtext_ja", v)} lang={l} textarea />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Sidebar Info</h3>
            <Field label="Phone" value={data.contact_phone ?? ""} onChange={(v) => set("contact_phone", v)} />
            <Field label="Email" value={data.contact_email ?? ""} onChange={(v) => set("contact_email", v)} type="email" />
            <Field label="Address" value={data[l === "en" ? "contact_address" : "contact_address_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_address" : "contact_address_ja", v)} lang={l} />
            <Field label="Tagline" value={data[l === "en" ? "contact_tagline_en" : "contact_tagline_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_tagline_en" : "contact_tagline_ja", v)} lang={l} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">India Office</h3>
            <Field label="Phone" value={data[l === "en" ? "contact_ind_phone" : "contact_ind_phone_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_ind_phone" : "contact_ind_phone_ja", v)} lang={l} />
            <Field label="Address" value={data[l === "en" ? "contact_ind_address" : "contact_ind_address_ja"] ?? ""} onChange={(v) => set(l === "en" ? "contact_ind_address" : "contact_ind_address_ja", v)} lang={l} />
          </div>
        </div>
      )}

      {/* ══ CONTACT CTA ═══════════════════════════════════ */}
      {activeTab === "cta" && (
        <div className="space-y-5 max-w-2xl">
          <p className="text-sm text-muted-foreground">
            This section appears at the bottom of most pages as the "Contact Form" call-to-action banner.
          </p>
          <Field label="Title" value={data[l === "en" ? "cta_title_en" : "cta_title_ja"] ?? ""} onChange={(v) => set(l === "en" ? "cta_title_en" : "cta_title_ja", v)} lang={l} placeholder="Contact Form" />
          <Field label="Description" value={data[l === "en" ? "cta_description_en" : "cta_description_ja"] ?? ""} onChange={(v) => set(l === "en" ? "cta_description_en" : "cta_description_ja", v)} lang={l} textarea placeholder="Have questions..." />
          <Field label="Button Text" value={data[l === "en" ? "cta_button_en" : "cta_button_ja"] ?? ""} onChange={(v) => set(l === "en" ? "cta_button_en" : "cta_button_ja", v)} lang={l} placeholder="Contact Us" />
          <Field label="Button URL" value={data.cta_button_href ?? ""} onChange={(v) => set("cta_button_href", v)} placeholder="/contact" />
        </div>
      )}

      {/* ══ INSIGHTS NAV ══════════════════════════════════ */}
      {activeTab === "insights" && (
        <div className="space-y-3 max-w-3xl">
          <p className="text-sm text-muted-foreground mb-4">
            These are the tabs in the Insights (Blogs/Case Studies/etc.) sub-header.
          </p>
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <p className="text-xs text-muted-foreground mb-1">Tab {n}</p>
              <LinkRow prefix="ins" num={n} label={`Tab ${n}`} data={data} set={set} />
            </div>
          ))}
        </div>
      )}

      {/* ══ SITEMAP LINKS ═════════════════════════════════ */}
      {/* {activeTab === "sitemap" && (
        <div className="space-y-8 max-w-3xl">
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Company Section Links</h3>
            {[1,2,3,4,5].map((n) => <LinkRow key={n} prefix="sitemap_company" num={n} label={`Link ${n}`} data={data} set={set} />)}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-base border-b pb-2">Resources Section Links</h3>
            {[1,2,3,4,5].map((n) => <LinkRow key={n} prefix="sitemap_resources" num={n} label={`Link ${n}`} data={data} set={set} />)}
          </div>
        </div>
      )} */}

      {/* ══ CORPORATE SUB-NAV ═════════════════════════════ */}
      {activeTab === "corpnav" && (
        <div className="space-y-3 max-w-3xl">
          <p className="text-sm text-muted-foreground mb-4">
            Tabs shown in the Corporate Info sub-header on all /corporate/* pages.
          </p>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div key={n}>
              <p className="text-xs text-muted-foreground mb-1">Tab {n}</p>
              <LinkRow prefix="corp" num={n} label={`Tab ${n}`} data={data} set={set} />
            </div>
          ))}
        </div>
      )}

      {/* Sticky save bar */}
      <div className="mt-10 pt-6 border-t flex justify-end">
        <Button onClick={save} disabled={processing} size="lg">
          {processing ? "Saving…" : "Save All Changes"}
        </Button>
      </div>

    </Authenticated>
  );
}