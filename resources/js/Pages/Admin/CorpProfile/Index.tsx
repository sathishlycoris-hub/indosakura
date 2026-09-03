import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type Tab = "strengths" | "stats" | "features" | "locations";

interface CorpProfileSettings {
  strengths_heading: string; strengths_heading_ja: string;
  strengths_para1: string; strengths_para1_ja: string;
  strengths_para2: string; strengths_para2_ja: string;
  strengths_cta: string; strengths_cta_ja: string;

  str_stat1_value: string; str_stat1_value_ja: string; str_stat1_label: string; str_stat1_label_ja: string; str_stat1_sub: string; str_stat1_sub_ja: string;
  str_stat2_value: string; str_stat2_value_ja: string; str_stat2_label: string; str_stat2_label_ja: string; str_stat2_sub: string; str_stat2_sub_ja: string;
  str_stat3_value: string; str_stat3_value_ja: string; str_stat3_label: string; str_stat3_label_ja: string; str_stat3_sub: string; str_stat3_sub_ja: string;
  str_stat4_value: string; str_stat4_value_ja: string; str_stat4_label: string; str_stat4_label_ja: string; str_stat4_sub: string; str_stat4_sub_ja: string;



  str_feat1_title: string; str_feat1_title_ja: string; str_feat1_sub: string; str_feat1_sub_ja: string; str_feat1_desc: string; str_feat1_desc_ja: string;
  str_feat2_title: string; str_feat2_title_ja: string; str_feat2_sub: string; str_feat2_sub_ja: string; str_feat2_desc: string; str_feat2_desc_ja: string;
  str_feat3_title: string; str_feat3_title_ja: string; str_feat3_sub: string; str_feat3_sub_ja: string; str_feat3_desc: string; str_feat3_desc_ja: string;
  str_feat4_title: string; str_feat4_title_ja: string; str_feat4_sub: string; str_feat4_sub_ja: string; str_feat4_desc: string; str_feat4_desc_ja: string;

  // Locations (5 offices)
  loc1_name: string; loc1_name_ja: string; loc1_address: string; loc1_address_ja: string;
  loc2_name: string; loc2_name_ja: string; loc2_address: string; loc2_address_ja: string;
  loc3_name: string; loc3_name_ja: string; loc3_address: string; loc3_address_ja: string;
  loc4_name: string; loc4_name_ja: string; loc4_address: string; loc4_address_ja: string;
  loc5_name: string; loc5_name_ja: string; loc5_address: string; loc5_address_ja: string;

}

type FormData = CorpProfileSettings;

// ── Sub-components defined OUTSIDE the page component ─────
// Defining them inside would cause React to unmount/remount on
// every keystroke — which is what caused the typing/focus bug.

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  lang: "en" | "ja";
  textarea?: boolean;
}

function Field({ label, value, onChange, lang, textarea = false }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label} <span className="text-xs text-primary">({lang.toUpperCase()})</span>
      </label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

interface StatGroupProps {
  num: 1 | 2 | 3 | 4;
  label: string;
  lang: "en" | "ja";
  data: FormData;
  setData: (key: keyof FormData, value: string) => void;
}

function StatGroup({ num, label, lang, data, setData }: StatGroupProps) {
  const vk  = `str_stat${num}_value`    as keyof FormData;
  const vjk = `str_stat${num}_value_ja` as keyof FormData; // ← ADD
  const lk  = `str_stat${num}_label`    as keyof FormData;
  const ljk = `str_stat${num}_label_ja` as keyof FormData;
  const sk  = `str_stat${num}_sub`      as keyof FormData;
  const sjk = `str_stat${num}_sub_ja`   as keyof FormData;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <p className="font-semibold text-sm text-foreground">{label}</p>

      {/* ← UPDATED: now lang-aware */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Value (shown large) ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? vk : vjk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? vk : vjk, e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Label ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? lk : ljk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? lk : ljk, e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Sub-label ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? sk : sjk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? sk : sjk, e.target.value)}
        />
      </div>
    </div>
  );
}

interface FeatGroupProps {
  num: 1 | 2 | 3 | 4;
  label: string;
  lang: "en" | "ja";
  data: FormData;
  setData: (key: keyof FormData, value: string) => void;
}

function FeatGroup({ num, label, lang, data, setData }: FeatGroupProps) {
  const tk = `str_feat${num}_title` as keyof FormData;
  const tjk = `str_feat${num}_title_ja` as keyof FormData;
  const sk = `str_feat${num}_sub` as keyof FormData;
  const sjk = `str_feat${num}_sub_ja` as keyof FormData;
  const dk = `str_feat${num}_desc` as keyof FormData;
  const djk = `str_feat${num}_desc_ja` as keyof FormData;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <p className="font-semibold text-sm text-foreground">{label}</p>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Title ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? tk : tjk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? tk : tjk, e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Sub-title ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? sk : sjk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? sk : sjk, e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Description ({lang.toUpperCase()})</label>
        <Textarea
          rows={3}
          value={(data[lang === "en" ? dk : djk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? dk : djk, e.target.value)}
        />
      </div>
    </div>
  );
}

interface LocGroupProps {
  num: 1 | 2 | 3 | 4 | 5;
  label: string;
  lang: "en" | "ja";
  data: FormData;
  setData: (key: keyof FormData, value: string) => void;
}

function LocGroup({ num, label, lang, data, setData }: LocGroupProps) {
  const nk = `loc${num}_name` as keyof FormData;
  const njk = `loc${num}_name_ja` as keyof FormData;
  const ak = `loc${num}_address` as keyof FormData;
  const ajk = `loc${num}_address_ja` as keyof FormData;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <p className="font-semibold text-sm text-foreground">{label}</p>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Office Name ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? nk : njk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? nk : njk, e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Address ({lang.toUpperCase()})</label>
        <Input
          value={(data[lang === "en" ? ak : ajk] as string) ?? ""}
          onChange={(e) => setData(lang === "en" ? ak : ajk, e.target.value)}
        />
      </div>
    </div>
  );
}

// ── Page component ─────────────────────────────────────────
export default function CorpProfileIndex() {
  const { settings } = usePage<{ settings: CorpProfileSettings }>().props;

  const [activeTab, setActiveTab] = useState<Tab>("strengths");
  const [activeLang, setActiveLang] = useState<"en" | "ja">("en");

  const { data, setData, post, processing, wasSuccessful } = useForm<FormData>({ ...settings });

  const save = () => post(route("admin.corpprofile.update"));

  // Typed setData wrapper for string fields
  const set = (key: keyof FormData, value: string) => setData(key, value as any);

  const tabs: { key: Tab; label: string }[] = [
    { key: "strengths", label: "Our Strengths Text" },
    { key: "stats", label: "Stat Boxes" },
    { key: "features", label: "Feature Cards" },
    { key: "locations", label: "Locations" },
  ];

  return (
    <Authenticated header={<h2 className="text-xl font-bold">Corporate Profile CMS</h2>}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Corporate Profile — Our Strengths</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the "Our Strengths" and "Locations" sections on the Corporate Profile page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {wasSuccessful && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <div className="flex gap-2">
            <Button type="button" size="sm" variant={activeLang === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>
              English
            </Button>
            <Button type="button" size="sm" variant={activeLang === "ja" ? "default" : "outline"} onClick={() => setActiveLang("ja")}>
              Japanese
            </Button>
          </div>
          {/* <Button onClick={save} disabled={processing}>
            {processing ? "Saving…" : "Save Changes"}
          </Button> */}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OUR STRENGTHS TEXT ───────────────────────────── */}
      {activeTab === "strengths" && (
        <div className="space-y-5 max-w-2xl">
          <Field label="Section Heading" value={data[activeLang === "en" ? "strengths_heading" : "strengths_heading_ja"]} onChange={(v) => set(activeLang === "en" ? "strengths_heading" : "strengths_heading_ja", v)} lang={activeLang} />
          <Field label="Paragraph 1" value={data[activeLang === "en" ? "strengths_para1" : "strengths_para1_ja"]} onChange={(v) => set(activeLang === "en" ? "strengths_para1" : "strengths_para1_ja", v)} lang={activeLang} textarea />
          <Field label="Paragraph 2" value={data[activeLang === "en" ? "strengths_para2" : "strengths_para2_ja"]} onChange={(v) => set(activeLang === "en" ? "strengths_para2" : "strengths_para2_ja", v)} lang={activeLang} textarea />
          <Field label="CTA Button Text" value={data[activeLang === "en" ? "strengths_cta" : "strengths_cta_ja"]} onChange={(v) => set(activeLang === "en" ? "strengths_cta" : "strengths_cta_ja", v)} lang={activeLang} />
        </div>
      )}

      {/* ── STAT BOXES ───────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatGroup num={1} label="Stat Box 1 (e.g. 19+ Years)" lang={activeLang} data={data} setData={set} />
          <StatGroup num={2} label="Stat Box 2 (e.g. 150+ IT Engineers)" lang={activeLang} data={data} setData={set} />
          <StatGroup num={3} label="Stat Box 3 (e.g. 2 Languages)" lang={activeLang} data={data} setData={set} />
          <StatGroup num={4} label="Stat Box 4 (e.g. Hybrid)" lang={activeLang} data={data} setData={set} />
        </div>
      )}

      {/* ── FEATURE CARDS ────────────────────────────────── */}
      {activeTab === "features" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatGroup num={1} label="Feature Card 1 (Proven Excellence)" lang={activeLang} data={data} setData={set} />
          <FeatGroup num={2} label="Feature Card 2 (Bilingual Team)" lang={activeLang} data={data} setData={set} />
          <FeatGroup num={3} label="Feature Card 3 (Cutting-Edge Tech)" lang={activeLang} data={data} setData={set} />
          <FeatGroup num={4} label="Feature Card 4 (Hybrid Model)" lang={activeLang} data={data} setData={set} />
        </div>
      )}

      {/* ── LOCATIONS ────────────────────────────────────── */}
      {activeTab === "locations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocGroup num={1} label="Office 1 (Tokyo Headquarters)" lang={activeLang} data={data} setData={set} />
          <LocGroup num={2} label="Office 2 (Los Angeles Sales Office)" lang={activeLang} data={data} setData={set} />
          <LocGroup num={3} label="Office 3 (India Dev Center)" lang={activeLang} data={data} setData={set} />
          <LocGroup num={4} label="Office 4 (U.S. Sales Office)" lang={activeLang} data={data} setData={set} />
          <LocGroup num={5} label="Office 5 (Dubai Sales Office)" lang={activeLang} data={data} setData={set} />
        </div>
      )}

      {/* Bottom save bar */}
      <div className="mt-10 pt-6 border-t flex justify-end">
        <Button onClick={save} disabled={processing} size="lg">
          {processing ? "Saving…" : "Save All Changes"}
        </Button>
      </div>

    </Authenticated>
  );
}