import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Copy, Check,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SeoFields from "@/components/SeoFields";

interface Listy { title: string; title_ja?: string; description?: string; description_ja?: string; }
interface Simple { title: string; title_ja?: string; }
interface Stat { value: string; label: string; label_ja?: string; }
interface Step { step_number?: number; title: string; title_ja?: string; description?: string; description_ja?: string; }
interface Tech { category: string; category_ja?: string; items: string; }
interface Work extends Listy { capabilities?: string; capabilities_ja?: string; }
interface Faq { question: string; question_ja?: string; answer: string; answer_ja?: string; }
type TitlePair = { en?: string; ja?: string };

interface Landing {
  id: number; service_id?: number | null; slug: string; sort_order?: number; is_published: boolean;
  public_url: string;
  service?: { id: number; title: string; slug: string } | null;
  title: string; title_ja?: string;
  card_description?: string; card_description_ja?: string;
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
  section_titles?: Record<string, TitlePair>;
  cta_title?: string; cta_title_ja?: string; cta_description?: string; cta_description_ja?: string;
  meta_title?: string; meta_title_ja?: string;
  meta_description?: string; meta_description_ja?: string;
  meta_keywords?: string; meta_keywords_ja?: string;
  og_image?: string | null;
}

const SECTION_KEYS: { key: string; label: string }[] = [
  { key: "about", label: "About section heading" },
  { key: "services", label: "Services heading" },
  { key: "why", label: "Why choose heading" },
  { key: "industries", label: "Industries heading" },
  { key: "tech", label: "Technologies heading" },
  { key: "process", label: "Process heading" },
  { key: "portfolio", label: "Portfolio heading" },
  { key: "engagement", label: "Engagement models heading" },
  { key: "faq", label: "FAQ heading" },
];

const JSON_KEYS = [
  "trust_highlights", "stats", "sub_services", "why_choose", "industries", "tech_stack",
  "process_steps", "portfolio", "engagement_models", "faqs", "section_titles",
] as const;

// Live cleanup while the admin types the URL name (keeps a trailing "-" so words can be separated)
const cleanSlug = (t: string) =>
  t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-+/, "");

const slugify = (t: string) =>
  t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

const emptyForm = () => ({
  service_id: "" as string | number, is_published: true, sort_order: 0,
  title: "", title_ja: "", slug: "",
  card_description: "", card_description_ja: "",
  eyebrow: "", eyebrow_ja: "", subtitle: "", subtitle_ja: "",
  hero_description: "", hero_description_ja: "",
  intro: "", intro_ja: "",
  cta_label: "", cta_label_ja: "", cta_url: "/contact",
  secondary_cta_label: "", secondary_cta_label_ja: "", secondary_cta_url: "",
  cta_title: "", cta_title_ja: "", cta_description: "", cta_description_ja: "",
  hero_image: null as File | null,
  meta_title: "", meta_title_ja: "", meta_description: "", meta_description_ja: "",
  meta_keywords: "", meta_keywords_ja: "", og_image: null as File | null,
  trust_highlights: [] as Simple[], stats: [] as Stat[],
  sub_services: [] as Listy[], why_choose: [] as Listy[], industries: [] as Listy[],
  tech_stack: [] as Tech[], process_steps: [] as Step[], portfolio: [] as Work[],
  engagement_models: [] as Listy[], faqs: [] as Faq[],
  section_titles: {} as Record<string, TitlePair>,
});

export default function Index({
  landings, services, baseUrl,
}: {
  landings: Landing[];
  services: { id: number; title: string; slug: string }[];
  baseUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [current, setCurrent] = useState<Landing | null>(null);
  const [langTab, setLangTab] = useState<"en" | "ja">("en");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false); // true once the admin edits the URL name by hand

  const { data, setData, reset, processing } = useForm(emptyForm());

  const fullUrl = (slug: string) => `${baseUrl}/${slug}`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const openAdd = () => {
    reset(); setData(emptyForm());
    setFormErrors({}); setSlugTouched(false); setMode("add"); setCurrent(null); setLangTab("en"); setOpen(true);
  };

  const openEdit = (l: Landing) => {
    const f = emptyForm();
    setMode("edit"); setCurrent(l); setLangTab("en"); setFormErrors({}); setSlugTouched(true);
    setData({
      ...f,
      service_id: l.service_id ?? "", is_published: !!l.is_published, sort_order: l.sort_order ?? 0,
      title: l.title ?? "", title_ja: l.title_ja ?? "", slug: l.slug ?? "",
      card_description: l.card_description ?? "", card_description_ja: l.card_description_ja ?? "",
      eyebrow: l.eyebrow ?? "", eyebrow_ja: l.eyebrow_ja ?? "",
      subtitle: l.subtitle ?? "", subtitle_ja: l.subtitle_ja ?? "",
      hero_description: l.hero_description ?? "", hero_description_ja: l.hero_description_ja ?? "",
      intro: l.intro ?? "", intro_ja: l.intro_ja ?? "",
      cta_label: l.cta_label ?? "", cta_label_ja: l.cta_label_ja ?? "", cta_url: l.cta_url ?? "/contact",
      secondary_cta_label: l.secondary_cta_label ?? "", secondary_cta_label_ja: l.secondary_cta_label_ja ?? "",
      secondary_cta_url: l.secondary_cta_url ?? "",
      cta_title: l.cta_title ?? "", cta_title_ja: l.cta_title_ja ?? "",
      cta_description: l.cta_description ?? "", cta_description_ja: l.cta_description_ja ?? "",
      meta_title: l.meta_title ?? "", meta_title_ja: l.meta_title_ja ?? "",
      meta_description: l.meta_description ?? "", meta_description_ja: l.meta_description_ja ?? "",
      meta_keywords: l.meta_keywords ?? "", meta_keywords_ja: l.meta_keywords_ja ?? "",
      trust_highlights: l.trust_highlights ?? [], stats: l.stats ?? [],
      sub_services: l.sub_services ?? [], why_choose: l.why_choose ?? [], industries: l.industries ?? [],
      tech_stack: l.tech_stack ?? [], process_steps: l.process_steps ?? [], portfolio: l.portfolio ?? [],
      engagement_models: l.engagement_models ?? [], faqs: l.faqs ?? [],
      section_titles: l.section_titles ?? {},
    } as any);
    setOpen(true);
  };

  const handleTitle = (val: string) => {
    setData(prev => ({ ...prev, title: val, slug: mode === "add" && !slugTouched ? slugify(val) : prev.slug }));
    if (formErrors.title) setFormErrors(e => ({ ...e, title: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.title.trim()) errs.title = "Title is required.";
    if (!data.slug.trim()) errs.slug = "Slug is required.";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())) errs.slug = "Slug: lowercase letters, numbers and hyphens only.";
    setFormErrors(errs);
    if (Object.keys(errs).length) setLangTab("en");
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const form = new FormData();
    const skip = new Set<string>(["hero_image", "og_image", "is_published", ...JSON_KEYS]);
    Object.entries(data).forEach(([k, v]) => {
      if (skip.has(k)) return;
      form.append(k, v === null || v === undefined ? "" : String(v));
    });
    form.set("slug", data.slug.trim());
    form.append("is_published", data.is_published ? "1" : "0");
    if (data.hero_image) form.append("hero_image", data.hero_image);
    if (data.og_image) form.append("og_image", data.og_image);
    JSON_KEYS.forEach(k => form.append(k, JSON.stringify((data as any)[k])));

    const opts = { onSuccess: () => { reset(); setFormErrors({}); setOpen(false); } };

    if (mode === "edit" && current) {
      form.append("_method", "PUT");
      router.post(route("admin.service_landings.update", current.id), form, opts);
    } else {
      router.post(route("admin.service_landings.store"), form, opts);
    }
  };

  const del = (id: number) => {
    if (!confirm("Delete this landing page?")) return;
    router.delete(route("admin.service_landings.destroy", id), { preserveScroll: true });
  };

  const add = (k: keyof typeof data, item: any) => setData(k, [...((data as any)[k] as any[]), item]);
  const remove = (k: keyof typeof data, i: number) => { const a = [...((data as any)[k] as any[])]; a.splice(i, 1); setData(k, a as any); };
  const upd = (k: keyof typeof data, i: number, f: string, v: any) => { const a = [...((data as any)[k] as any[])]; a[i] = { ...a[i], [f]: v }; setData(k, a as any); };
  const setSeoData = (key: string, value: any) => setData(key as any, value);
  const setSection = (key: string, lang: "en" | "ja", val: string) =>
    setData("section_titles", { ...data.section_titles, [key]: { ...(data.section_titles[key] || {}), [lang]: val } });

  return (
    <Authenticated header={<h2 className="font-bold text-xl">Service Landing</h2>}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Landing Pages</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Each record is published at <code>/services/&#123;your-name&#125;</code>. Copy the link and paste it anywhere.
          </p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Landing Page</Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[95%] sm:max-w-5xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{mode === "add" ? "Add Landing Page" : "Edit Landing Page"}</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 mt-6">
            {Object.keys(formErrors).length > 0 && (
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <ul className="list-disc list-inside space-y-0.5">
                  {Object.values(formErrors).filter(Boolean).map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}

            {/* Link box — the URL to paste */}
            <div className="border rounded-xl p-4 bg-primary/5 space-y-2">
              <p className="font-semibold text-sm">Landing page link</p>
              <p className="text-xs text-muted-foreground">
                Type your own page name after <code>/services/</code> (it must be different from your service page names). Lowercase letters, numbers and hyphens only.
              </p>
              <div className="flex items-center gap-2">
                <div className={`flex flex-1 items-center bg-white border rounded-md overflow-hidden ${formErrors.slug ? "border-destructive" : ""}`}>
                  <span className="px-3 py-2 text-xs text-muted-foreground bg-muted/40 border-r whitespace-nowrap select-none">
                    {baseUrl}/
                  </span>
                  <input
                    value={data.slug}
                    placeholder="your-page-name"
                    onChange={e => { setSlugTouched(true); setData("slug", cleanSlug(e.target.value)); if (formErrors.slug) setFormErrors(er => ({ ...er, slug: "" })); }}
                    onBlur={() => setData("slug", data.slug.replace(/-+$/, ""))}
                    className="flex-1 min-w-0 px-3 py-2 text-sm outline-none bg-transparent"
                  />
                </div>
                <Button type="button" variant="outline" disabled={!data.slug}
                  onClick={() => copy(fullUrl(data.slug), "form")}>
                  {copied === "form" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {formErrors.slug && (
                <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.slug}</p>
              )}
              {mode === "edit" && current && data.slug !== current.slug && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  Changing the name will break the old link ({fullUrl(current.slug)}). Update it anywhere you pasted it.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <Field label="Show on service page" hint="Optional. Adds a card to that service's page.">
                  <select value={data.service_id} onChange={e => setData("service_id", e.target.value)}
                    className="w-full border rounded-md h-10 px-3 text-sm bg-background">
                    <option value="">— Standalone (no service page) —</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </Field>
                <Field label="Sort order"><Input type="number" value={data.sort_order} onChange={e => setData("sort_order", Number(e.target.value))} /></Field>
                <Field label="Status">
                  <label className="flex items-center gap-2 h-10 text-sm">
                    <input type="checkbox" checked={data.is_published} onChange={e => setData("is_published", e.target.checked)} />
                    Published
                  </label>
                </Field>
              </div>
            </div>

            <Tabs value={langTab} onValueChange={v => setLangTab(v as "en" | "ja")}>
              <TabsList className="mb-2">
                <TabsTrigger value="en" className="data-[state=active]:bg-primary data-[state=active]:text-white">English</TabsTrigger>
                <TabsTrigger value="ja" className="data-[state=active]:bg-primary data-[state=active]:text-white">Japanese</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <Field label="Title (EN) *" error={formErrors.title}>
                  <Input value={data.title} onChange={e => handleTitle(e.target.value)} className={formErrors.title ? "border-destructive" : ""} />
                </Field>
                <Field label="Card Description (EN)" hint="Shown on the parent service page card">
                  <Input value={data.card_description} onChange={e => setData("card_description", e.target.value)} />
                </Field>
                <Field label="Hero eyebrow (EN)"><Input value={data.eyebrow} onChange={e => setData("eyebrow", e.target.value)} /></Field>
                <Field label="Hero subtitle (EN)"><Input value={data.subtitle} onChange={e => setData("subtitle", e.target.value)} /></Field>
                <Field label="Hero description (EN)"><ReactQuill value={data.hero_description} onChange={v => setData("hero_description", v)} /></Field>
                <Field label="About / Introduction (EN)"><ReactQuill value={data.intro} onChange={v => setData("intro", v)} /></Field>
                <Field label="Closing CTA title (EN)"><Input value={data.cta_title} onChange={e => setData("cta_title", e.target.value)} /></Field>
                <Field label="Closing CTA description (EN)"><Input value={data.cta_description} onChange={e => setData("cta_description", e.target.value)} /></Field>
                <SectionBox title="Section headings (EN)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SECTION_KEYS.map(s => (
                      <Field key={s.key} label={s.label}>
                        <Input value={data.section_titles[s.key]?.en || ""} onChange={e => setSection(s.key, "en", e.target.value)} />
                      </Field>
                    ))}
                  </div>
                </SectionBox>
              </TabsContent>

              <TabsContent value="ja" className="space-y-4">
                <Field label="Title (JA)"><Input value={data.title_ja} onChange={e => setData("title_ja", e.target.value)} /></Field>
                <Field label="Card Description (JA)"><Input value={data.card_description_ja} onChange={e => setData("card_description_ja", e.target.value)} /></Field>
                <Field label="Hero eyebrow (JA)"><Input value={data.eyebrow_ja} onChange={e => setData("eyebrow_ja", e.target.value)} /></Field>
                <Field label="Hero subtitle (JA)"><Input value={data.subtitle_ja} onChange={e => setData("subtitle_ja", e.target.value)} /></Field>
                <Field label="Hero description (JA)"><ReactQuill value={data.hero_description_ja} onChange={v => setData("hero_description_ja", v)} /></Field>
                <Field label="About / Introduction (JA)"><ReactQuill value={data.intro_ja} onChange={v => setData("intro_ja", v)} /></Field>
                <Field label="Closing CTA title (JA)"><Input value={data.cta_title_ja} onChange={e => setData("cta_title_ja", e.target.value)} /></Field>
                <Field label="Closing CTA description (JA)"><Input value={data.cta_description_ja} onChange={e => setData("cta_description_ja", e.target.value)} /></Field>
                <SectionBox title="Section headings (JA)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SECTION_KEYS.map(s => (
                      <Field key={s.key} label={s.label}>
                        <Input value={data.section_titles[s.key]?.ja || ""} onChange={e => setSection(s.key, "ja", e.target.value)} />
                      </Field>
                    ))}
                  </div>
                </SectionBox>
              </TabsContent>
            </Tabs>

            <SectionBox title="Hero image (optional)">
              {mode === "edit" && current?.hero_image && (
                <img src={`/storage/${current.hero_image}`} alt="" className="h-28 rounded border object-cover mb-2" />
              )}
              <Input type="file" accept="image/*" onChange={e => setData("hero_image", e.target.files?.[0] || null)} />
            </SectionBox>

            <SectionBox title="CTA Buttons">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Primary label (EN)"><Input value={data.cta_label} onChange={e => setData("cta_label", e.target.value)} /></Field>
                <Field label="Primary label (JA)"><Input value={data.cta_label_ja} onChange={e => setData("cta_label_ja", e.target.value)} /></Field>
              </div>
              <Field label="Primary URL"><Input value={data.cta_url} onChange={e => setData("cta_url", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Secondary label (EN)"><Input value={data.secondary_cta_label} onChange={e => setData("secondary_cta_label", e.target.value)} /></Field>
                <Field label="Secondary label (JA)"><Input value={data.secondary_cta_label_ja} onChange={e => setData("secondary_cta_label_ja", e.target.value)} /></Field>
              </div>
              <Field label="Secondary URL (e.g. #portfolio or /blogs/casestudies)"><Input value={data.secondary_cta_url} onChange={e => setData("secondary_cta_url", e.target.value)} /></Field>
            </SectionBox>

            <SeoFields
              data={{
                meta_title: data.meta_title, meta_title_ja: data.meta_title_ja,
                meta_description: data.meta_description, meta_description_ja: data.meta_description_ja,
                meta_keywords: data.meta_keywords, meta_keywords_ja: data.meta_keywords_ja,
                og_image: data.og_image,
              }}
              setData={setSeoData}
              activeLang={langTab}
              mode={mode}
              currentOgImage={current?.og_image}
            />

            <SectionBlock title="Hero Trust Highlights" items={data.trust_highlights}
              onAdd={() => add("trust_highlights", { title: "", title_ja: "" })}
              onRemove={i => remove("trust_highlights", i)}
              render={(item, i) => (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Text (EN)"><Input value={item.title} onChange={e => upd("trust_highlights", i, "title", e.target.value)} /></Field>
                  <Field label="Text (JA)"><Input value={item.title_ja || ""} onChange={e => upd("trust_highlights", i, "title_ja", e.target.value)} /></Field>
                </div>
              )} />

            <SectionBlock title="Stats / Proof Points" items={data.stats}
              onAdd={() => add("stats", { value: "", label: "", label_ja: "" })}
              onRemove={i => remove("stats", i)}
              render={(item, i) => (
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Value (e.g. 20+)"><Input value={item.value} onChange={e => upd("stats", i, "value", e.target.value)} /></Field>
                  <Field label="Label (EN)"><Input value={item.label} onChange={e => upd("stats", i, "label", e.target.value)} /></Field>
                  <Field label="Label (JA)"><Input value={item.label_ja || ""} onChange={e => upd("stats", i, "label_ja", e.target.value)} /></Field>
                </div>
              )} />

            <SectionBlock title="Our Services List" items={data.sub_services}
              onAdd={() => add("sub_services", { title: "", title_ja: "", description: "", description_ja: "" })}
              onRemove={i => remove("sub_services", i)}
              render={(item, i) => <TitleDesc item={item} i={i} field="sub_services" upd={upd} />} />

            <SectionBlock title="Why Choose Us" items={data.why_choose}
              onAdd={() => add("why_choose", { title: "", title_ja: "", description: "", description_ja: "" })}
              onRemove={i => remove("why_choose", i)}
              render={(item, i) => <TitleDesc item={item} i={i} field="why_choose" upd={upd} simple />} />

            <SectionBlock title="Industries" items={data.industries}
              onAdd={() => add("industries", { title: "", title_ja: "", description: "", description_ja: "" })}
              onRemove={i => remove("industries", i)}
              render={(item, i) => <TitleDesc item={item} i={i} field="industries" upd={upd} simple />} />

            <SectionBlock title="Technologies" items={data.tech_stack}
              onAdd={() => add("tech_stack", { category: "", category_ja: "", items: "" })}
              onRemove={i => remove("tech_stack", i)}
              render={(item, i) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Category (EN)"><Input value={item.category} onChange={e => upd("tech_stack", i, "category", e.target.value)} /></Field>
                    <Field label="Category (JA)"><Input value={item.category_ja || ""} onChange={e => upd("tech_stack", i, "category_ja", e.target.value)} /></Field>
                  </div>
                  <Field label="Items (comma-separated)"><Input value={item.items} onChange={e => upd("tech_stack", i, "items", e.target.value)} /></Field>
                </div>
              )} />

            <SectionBlock title="Process Steps" items={data.process_steps}
              onAdd={() => add("process_steps", { step_number: data.process_steps.length + 1, title: "", title_ja: "", description: "", description_ja: "" })}
              onRemove={i => remove("process_steps", i)}
              render={(item, i) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Step #"><Input type="number" value={item.step_number ?? i + 1} onChange={e => upd("process_steps", i, "step_number", Number(e.target.value))} /></Field>
                    <div className="col-span-2"><Field label="Title (EN)"><Input value={item.title} onChange={e => upd("process_steps", i, "title", e.target.value)} /></Field></div>
                  </div>
                  <Field label="Title (JA)"><Input value={item.title_ja || ""} onChange={e => upd("process_steps", i, "title_ja", e.target.value)} /></Field>
                  <Field label="Description (EN)"><ReactQuill theme="snow" value={item.description || ""} onChange={v => upd("process_steps", i, "description", v)} /></Field>
                  <Field label="Description (JA)"><ReactQuill theme="snow" value={item.description_ja || ""} onChange={v => upd("process_steps", i, "description_ja", v)} /></Field>
                </div>
              )} />

            <SectionBlock title="Portfolio / Success Stories" items={data.portfolio}
              onAdd={() => add("portfolio", { title: "", title_ja: "", description: "", description_ja: "", capabilities: "", capabilities_ja: "" })}
              onRemove={i => remove("portfolio", i)}
              render={(item, i) => (
                <div className="space-y-2">
                  <TitleDesc item={item} i={i} field="portfolio" upd={upd} simple />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Capabilities (EN, comma-separated)"><Input value={item.capabilities || ""} onChange={e => upd("portfolio", i, "capabilities", e.target.value)} /></Field>
                    <Field label="Capabilities (JA)"><Input value={item.capabilities_ja || ""} onChange={e => upd("portfolio", i, "capabilities_ja", e.target.value)} /></Field>
                  </div>
                </div>
              )} />

            <SectionBlock title="Engagement Models" items={data.engagement_models}
              onAdd={() => add("engagement_models", { title: "", title_ja: "", description: "", description_ja: "" })}
              onRemove={i => remove("engagement_models", i)}
              render={(item, i) => <TitleDesc item={item} i={i} field="engagement_models" upd={upd} simple />} />

            <SectionBlock title="FAQs" items={data.faqs}
              onAdd={() => add("faqs", { question: "", question_ja: "", answer: "", answer_ja: "" })}
              onRemove={i => remove("faqs", i)}
              render={(item, i) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Question (EN)"><Input value={item.question} onChange={e => upd("faqs", i, "question", e.target.value)} /></Field>
                    <Field label="Question (JA)"><Input value={item.question_ja || ""} onChange={e => upd("faqs", i, "question_ja", e.target.value)} /></Field>
                  </div>
                  <Field label="Answer (EN)"><ReactQuill theme="snow" value={item.answer || ""} onChange={v => upd("faqs", i, "answer", v)} /></Field>
                  <Field label="Answer (JA)"><ReactQuill theme="snow" value={item.answer_ja || ""} onChange={v => upd("faqs", i, "answer_ja", v)} /></Field>
                </div>
              )} />

            <Button disabled={processing} className="w-full mt-4" onClick={submit}>
              {mode === "edit" ? "Update Landing Page" : "Save Landing Page"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-white">#</TableHead>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Service</TableHead>
            <TableHead className="text-white">Link (copy &amp; paste)</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landings.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No landing pages yet. Click “Add Landing Page”.</TableCell></TableRow>
          )}
          {landings.map((l, i) => (
            <TableRow key={l.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{l.title}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{l.service?.title ?? "—"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">{l.public_url}</code>
                  <Button size="icon" variant="ghost" title="Copy full URL" onClick={() => copy(fullUrl(l.slug), `row-${l.id}`)}>
                    {copied === `row-${l.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {l.is_published
                  ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span>
                  : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Draft</span>}
              </TableCell>
              <TableCell className="space-x-2 whitespace-nowrap">
                <a href={l.public_url} target="_blank" rel="noreferrer">
                  <Button size="icon" variant="ghost"><ExternalLink className="w-4 h-4" /></Button>
                </a>
                <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="destructive" onClick={() => del(l.id)}><Trash2 className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Authenticated>
  );
}

/* Helpers (same look as Services/Items/Index) */
function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <Label className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
      {children}
      {error && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
      <p className="font-semibold text-sm">{title}</p>
      {children}
    </div>
  );
}

function SectionBlock({ title, items, onAdd, onRemove, render }: {
  title: string; items: any[]; onAdd: () => void; onRemove: (i: number) => void;
  render: (item: any, i: number) => JSX.Element;
}) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="border rounded-xl bg-muted/20 overflow-hidden">
      <button type="button" onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{title}</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{items.length}</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-4">
          {items.map((item, i) => (
            <div key={i} className="border border-dashed rounded-lg p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                <Button variant="destructive" size="sm" onClick={() => onRemove(i)}>Remove</Button>
              </div>
              {render(item, i)}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={onAdd}><Plus className="w-3 h-3 mr-1" /> Add {title.split(" ")[0]}</Button>
        </div>
      )}
    </div>
  );
}

function TitleDesc({ item, i, field, upd, simple }: {
  item: any; i: number; field: string; simple?: boolean;
  upd: (k: any, i: number, f: string, v: any) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Title (EN)"><Input value={item.title} onChange={e => upd(field, i, "title", e.target.value)} /></Field>
        <Field label="Title (JA)"><Input value={item.title_ja || ""} onChange={e => upd(field, i, "title_ja", e.target.value)} /></Field>
      </div>
      {simple ? (
        <>
          <Field label="Description (EN)"><Input value={item.description || ""} onChange={e => upd(field, i, "description", e.target.value)} /></Field>
          <Field label="Description (JA)"><Input value={item.description_ja || ""} onChange={e => upd(field, i, "description_ja", e.target.value)} /></Field>
        </>
      ) : (
        <>
          <Field label="Description (EN)"><ReactQuill theme="snow" value={item.description || ""} onChange={v => upd(field, i, "description", v)} /></Field>
          <Field label="Description (JA)"><ReactQuill theme="snow" value={item.description_ja || ""} onChange={v => upd(field, i, "description_ja", v)} /></Field>
        </>
      )}
    </div>
  );
}
