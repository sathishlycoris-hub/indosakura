import { useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Plus, Search, Tags } from "lucide-react";
// ★ NEW — Full Description is now a rich-text field, matching the pattern
// used elsewhere in the admin (e.g. Admin/HomeCaseStudies/Index.tsx)
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// ── Types ──────────────────────────────────────────────────
interface EventType {
  id: number;
  name: string;
  name_ja: string | null;
}

interface NewsEvent {
  id: number;
  date: string;
  eventtype: string;
  eventtype_ja: string | null;
  short: string;
  short_ja: string | null;
  description: string | null;
  description_ja: string | null;
  image: string | null;
  pdf: string | null;
}

// ── Sub-components outside parent (prevents focus-loss bug) ─

function EventRow({ item, lang, onView, onEdit, onDelete }: {
  item: NewsEvent;
  lang: "en" | "ja";
  onView: (i: NewsEvent) => void;
  onEdit: (i: NewsEvent) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
      <TableCell>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
          {lang === "ja" ? item.eventtype_ja || item.eventtype : item.eventtype}
        </span>
      </TableCell>
      <TableCell className="max-w-[300px] truncate">
        {lang === "ja" ? item.short_ja || item.short : item.short}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <Button size="icon" title="View" onClick={() => onView(item)}><Eye className="w-4 h-4" /></Button>
          <Button size="icon" title="Edit" onClick={() => onEdit(item)}><Pencil className="w-4 h-4" /></Button>
          <Button size="icon" variant="destructive" title="Delete"
            onClick={() => { if (confirm("Delete this news item?")) onDelete(item.id); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TypeRow({ type, onEdit, onDelete }: {
  type: EventType;
  onEdit: (t: EventType) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{type.name}</TableCell>
      <TableCell className="text-muted-foreground">{type.name_ja ?? "—"}</TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          {/* <Button size="icon" variant="outline" onClick={() => onEdit(type)}><Pencil className="w-4 h-4" /></Button> */}
          <Button size="icon" variant="destructive"
            onClick={() => { if (confirm(`Delete type "${type.name}"?`)) onDelete(type.id); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function NewseventIndex() {
  const { events, eventTypes } = usePage<{
    events: NewsEvent[];
    eventTypes: EventType[];
  }>().props;

  type MainTab = "events" | "types";
  const [mainTab, setMainTab] = useState<MainTab>("events");
  const [activeLang, setActiveLang] = useState<"en" | "ja">("en");
  const [search, setSearch] = useState("");

  // ── Event sheet ────────────────────────────────────────
  const [eventOpen, setEventOpen] = useState(false);
  const [eventMode, setEventMode] = useState<"add" | "edit" | "view">("add");
  const [currentEvent, setCurrentEvent] = useState<NewsEvent | null>(null);

  const {
    data: eData, setData: setEData,
    post: postEvent, reset: resetEvent,
  } = useForm({
    date: "", eventtype: "", eventtype_ja: "",
    short: "", short_ja: "",
    description: "", description_ja: "",
    image: null as File | null,
    pdf: null as File | null,
  });

  // ── EventType sheet ────────────────────────────────────
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeMode, setTypeMode] = useState<"add" | "edit">("add");
  const [currentType, setCurrentType] = useState<EventType | null>(null);

  const {
    data: tData, setData: setTData,
    post: postType, reset: resetType,
  } = useForm({ name: "", name_ja: "" });

  // ── Filtered events ────────────────────────────────────
  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.short?.toLowerCase().includes(q) ||
      e.eventtype?.toLowerCase().includes(q) ||
      e.date?.includes(q)
    );
  });

  // ── Event CRUD ─────────────────────────────────────────
  const openAddEvent = () => {
    resetEvent();
    setEventMode("add");
    setCurrentEvent(null);
    setEventOpen(true);
  };

  const openEditEvent = (item: NewsEvent) => {
    setCurrentEvent(item);
    setEventMode("edit");
    setEData({
      date: item.date ?? "",
      eventtype: item.eventtype ?? "",
      eventtype_ja: item.eventtype_ja ?? "",
      short: item.short ?? "",
      short_ja: item.short_ja ?? "",
      description: item.description ?? "",
      description_ja: item.description_ja ?? "",
      image: null,
      pdf: null,
    });
    setEventOpen(true);
  };

  const openViewEvent = (item: NewsEvent) => {
    setCurrentEvent(item);
    setEventMode("view");
    setEventOpen(true);
  };

  const submitEvent = () => {
    if (eventMode === "add") {
      postEvent(route("admin.newsevent.store"), { forceFormData: true });
    } else {
      postEvent(route("admin.newsevent.update", currentEvent!.id), {
        forceFormData: true,
        data: {
          _method: "PUT",
          ...eData,
        },
      });
    }
    setEventOpen(false);
  };

  // ── EventType CRUD ─────────────────────────────────────
  const openAddType = () => {
    resetType();
    setTypeMode("add");
    setCurrentType(null);
    setTypeOpen(true);
  };

  const openEditType = (t: EventType) => {
    setCurrentType(t);
    setTypeMode("edit");
    setTData({ name: t.name, name_ja: t.name_ja ?? "" });
    setTypeOpen(true);
  };

  const submitType = () => {
    if (typeMode === "add") {
      postType(route("admin.event-type.store"), {
        onSuccess: () => {
          resetType();
          setTypeOpen(false);
        },
      });
    } else {
      postType(route("admin.event-type.update", currentType!.id), {
        forceFormData: true,   // ⭐ IMPORTANT
        data: {
          _method: "PUT",
          ...tData,
        },
        onSuccess: () => {
          resetType();
          setTypeOpen(false);
        },
      });
    }
  };

  return (
    <Authenticated header={<h2 className="text-xl font-bold">News & Events</h2>}>

      {/* MAIN TABS */}
      <div className="flex gap-1 border-b mb-6">
        {[
          { key: "events" as MainTab, label: "News / Events" },
          { key: "types" as MainTab, label: "Event Types", icon: <Tags className="w-4 h-4" /> },
        ].map((t) => (
          <button key={t.key} onClick={() => setMainTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mainTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ════ TAB: EVENTS ════════════════════════════════ */}
      {mainTab === "events" && (
        <>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">News & Events</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant={activeLang === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>EN</Button>
                  <Button type="button" size="sm" variant={activeLang === "ja" ? "default" : "outline"} onClick={() => setActiveLang("ja")}>JA</Button>
                </div>
                <Button onClick={openAddEvent}><Plus className="w-4 h-4 mr-2" />Add News</Button>
              </div>
            </div>
            <div className="mb-4 max-w-sm relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by title, type, date…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Title / Short</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No records found</TableCell></TableRow>
              )}
              {filtered.map((item) => (
                <EventRow key={item.id} item={item} lang={activeLang}
                  onView={openViewEvent} onEdit={openEditEvent}
                  onDelete={(id) => router.delete(route("admin.newsevent.destroy", id))} />
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* ════ TAB: EVENT TYPES ═══════════════════════════ */}
      {mainTab === "types" && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold">Event Types</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Types appear as filter tags on the Press Release page and as badges on news items. The Japanese name is shown when the site language is set to Japanese.
              </p>
            </div>
            <Button onClick={openAddType}><Plus className="w-4 h-4 mr-2" />Add Type</Button>
          </div>

          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">Name (EN)</TableHead>
                <TableHead className="text-white">Name (JA)</TableHead>
                <TableHead className="text-white text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {eventTypes.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No types yet — add one above.</TableCell></TableRow>
              )}
              {eventTypes.map((t) => (
                <TypeRow key={t.id} type={t}
                  onEdit={openEditType}
                  onDelete={(id) => router.delete(route("admin.event-type.destroy", id))} />
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* ════ EVENT SHEET ════════════════════════════════ */}
      <Sheet open={eventOpen} onOpenChange={setEventOpen}>
        <SheetContent side="right" className="w-[90%] sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {eventMode === "add" ? "Add News / Event" : eventMode === "edit" ? "Edit News / Event" : "View Details"}
            </SheetTitle>
          </SheetHeader>

          {eventMode === "view" ? (
            <div className="space-y-4 mt-6">
              <div className="flex gap-2 mb-4">
                <Button type="button" size="sm" variant={activeLang === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>English</Button>
                <Button type="button" size="sm" variant={activeLang === "ja" ? "default" : "outline"} onClick={() => setActiveLang("ja")}>Japanese</Button>
              </div>
              <p><strong>Date:</strong> {currentEvent?.date}</p>
              <p><strong>Type:</strong> {activeLang === "ja" ? currentEvent?.eventtype_ja || currentEvent?.eventtype : currentEvent?.eventtype}</p>
              <p><strong>Short:</strong> {activeLang === "ja" ? currentEvent?.short_ja || currentEvent?.short : currentEvent?.short}</p>
              {/* ★ CHANGED — description is now HTML (from ReactQuill), so
                  render it with dangerouslySetInnerHTML + prose instead of
                  as plain text, matching how rich-text fields are shown
                  elsewhere on view screens. */}
              {currentEvent?.description && (
                <div>
                  <strong>Description:</strong>
                  <div
                    className="mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: activeLang === "ja"
                        ? currentEvent.description_ja || currentEvent.description
                        : currentEvent.description,
                    }}
                  />
                </div>
              )}
              {currentEvent?.image && <div><strong>Image:</strong><img src={`/storage/${currentEvent.image}`} className="mt-2 h-32 rounded border object-cover" alt="" /></div>}
              {currentEvent?.pdf && <div><strong>PDF:</strong> <a href={`/storage/${currentEvent.pdf}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">View PDF</a></div>}
            </div>
          ) : (
            <div className="space-y-5 mt-6">
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={activeLang === "en" ? "default" : "outline"} onClick={() => setActiveLang("en")}>English</Button>
                <Button type="button" size="sm" variant={activeLang === "ja" ? "default" : "outline"} onClick={() => setActiveLang("ja")}>Japanese</Button>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={eData.date} onChange={(e) => setEData("date", e.target.value)} />
              </div>

              {/* Event Type — from DB */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Event Type</label>
                <Select value={eData.eventtype} onValueChange={(v) => {
                  // Auto-fill eventtype_ja if available
                  const match = eventTypes.find(t => t.name === v);
                  setEData("eventtype", v);
                  if (match?.name_ja) setEData("eventtype_ja", match.name_ja);
                }}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((t) => (
                      <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Japanese type label auto-fills from Event Types tab. Override below if needed.
                </p>
              </div>

              {/* Event Type JA override */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Event Type (JA) <span className="text-xs text-muted-foreground">— auto-filled, override if needed</span></label>
                <Input value={eData.eventtype_ja} onChange={(e) => setEData("eventtype_ja", e.target.value)} placeholder="e.g. プレスリリース" />
              </div>

              {/* Short title */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Short Title <span className="text-xs text-primary">({activeLang.toUpperCase()})</span>
                </label>
                <Input
                  value={activeLang === "en" ? eData.short : eData.short_ja}
                  onChange={(e) => activeLang === "en" ? setEData("short", e.target.value) : setEData("short_ja", e.target.value)}
                  placeholder="Brief headline"
                />
              </div>

              {/* ★ CHANGED — Full Description is now a ReactQuill rich-text
                  editor instead of a plain Textarea, matching the pattern
                  used for description-style fields elsewhere in the admin
                  (e.g. Admin/HomeCaseStudies/Index.tsx). Still one field per
                  language (description / description_ja), switched via the
                  same EN/JA toggle already on this form. */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Full Description <span className="text-xs text-primary">({activeLang.toUpperCase()})</span>
                </label>
                <ReactQuill
                  key={`description-${activeLang}`}
                  theme="snow"
                  value={activeLang === "en" ? eData.description : eData.description_ja}
                  onChange={(v) => activeLang === "en" ? setEData("description", v) : setEData("description_ja", v)}
                />
              </div>

              {/* Image */}
              {eventMode === "edit" && currentEvent?.image && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Current Image</label>
                  <img src={`/storage/${currentEvent.image}`} className="h-24 rounded border object-cover" alt="" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium">{eventMode === "edit" ? "Replace Image" : "Upload Image"}</label>
                <Input type="file" accept="image/*" onChange={(e) => setEData("image", e.target.files?.[0] || null)} />
              </div>

              {/* PDF */}
              {eventMode === "edit" && currentEvent?.pdf && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Current PDF</label>
                  <a href={`/storage/${currentEvent.pdf}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline block">View current PDF</a>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium">{eventMode === "edit" ? "Replace PDF" : "Upload PDF"}</label>
                <Input type="file" accept=".pdf" onChange={(e) => setEData("pdf", e.target.files?.[0] || null)} />
              </div>

              <Button onClick={submitEvent} className="w-full">
                {eventMode === "add" ? "Add News" : "Update News"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ════ EVENT TYPE SHEET ═══════════════════════════ */}
      <Sheet open={typeOpen} onOpenChange={setTypeOpen}>
        <SheetContent side="right" className="w-[90%] sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{typeMode === "add" ? "Add Event Type" : "Edit Event Type"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type Name (English)</label>
              <Input placeholder="e.g. Press Release" value={tData.name} onChange={(e) => setTData("name", e.target.value)} />
              <p className="text-xs text-muted-foreground">Used as the value stored in news items. Changing this won't update existing items.</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type Name (Japanese)</label>
              <Input placeholder="e.g. プレスリリース" value={tData.name_ja} onChange={(e) => setTData("name_ja", e.target.value)} />
            </div>
            <Button onClick={submitType} className="w-full">
              {typeMode === "add" ? "Add Type" : "Update Type"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </Authenticated>
  );
}
