// resources/js/Pages/Casestudies/Show.tsx

import Layout from "@/components/layout/Layout";
import { Link, usePage } from "@inertiajs/react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { getLangValue } from "@/utils/lang";
import Insightshead from "@/components/layout/InsightsHead";
import PageSeo, { type PageSeoProps } from "@/components/PageSeo";

interface CaseStudy {
  slug: string;
  title: string; title_ja?: string;
  subtitle?: string; subtitle_ja?: string;
  company_name?: string; company_name_ja?: string;
  ceo_name?: string; ceo_name_ja?: string;
  logo?: string | null;
  tags?: string; tags_ja?: string;
  hero_description?: string; hero_description_ja?: string;
  content?: string; content_ja?: string;
  benefit?: string; benefit_ja?: string;
  implementation?: string; implementation_ja?: string;
  hero_image?: string | null;
  secondary_image?: string | null;
  parent_type?: "india_desk" | "solution";
  india_desk_slug?: string;
  india_desk_title?: string;
  india_desk_title_ja?: string;
  solution_slug?: string;
  solution_title?: string;
  solution_title_ja?: string;
}

/** Builds the /india-desks/{slug}/case-studies/{slug} or
 * /solutions/{slug}/case-studies/{slug} URL for any case study,
 * regardless of which parent it belongs to. */
const caseStudyHref = (item: Pick<CaseStudy, "parent_type" | "india_desk_slug" | "solution_slug" | "slug">) =>
  item.parent_type === "solution"
    ? `/solutions/${item.solution_slug}/case-studies/${item.slug}`
    : `/india-desks/${item.india_desk_slug}/case-studies/${item.slug}`;

/** Builds the back-link URL to the parent page (India Desk or Solution). */
const parentHref = (item: Pick<CaseStudy, "parent_type" | "india_desk_slug" | "solution_slug">) =>
  item.parent_type === "solution" ? `/solutions/${item.solution_slug}` : `/india-desks/${item.india_desk_slug}`;

/** A stable React key across both parent types. */
const caseStudyKey = (item: Pick<CaseStudy, "parent_type" | "india_desk_slug" | "solution_slug" | "slug">) =>
  item.parent_type === "solution" ? `solution-${item.solution_slug}-${item.slug}` : `india_desk-${item.india_desk_slug}-${item.slug}`;

export default function Show({
  caseStudy,
  relatedCases,
}: {
  caseStudy: CaseStudy;
  relatedCases: CaseStudy[];
}) {
  const { lang, pageSeo } = usePage<{
    lang: "en" | "ja";
    pageSeo: PageSeoProps;
  }>().props;

  const companyName = getLangValue(lang, caseStudy.company_name || "", caseStudy.company_name_ja || "");
  const ceoName = getLangValue(lang, caseStudy.ceo_name || "", caseStudy.ceo_name_ja || "");

  return (
    <Layout>
      <PageSeo {...pageSeo} />

      <div className="sticky top-16 lg:top-[101px] z-40 bg-white">
        <Insightshead />
      </div>

      {/* HERO */}
      <section className="relative bg-primary py-10">
        <div className="container mx-auto px-4 text-white">
          <Link
            href={parentHref(caseStudy)}
            className="text-white/60 text-xs inline-flex items-center gap-1 mb-4 hover:text-white transition-colors"
          >
            {caseStudy.parent_type === "solution"
              ? getLangValue(lang, caseStudy.solution_title || "", caseStudy.solution_title_ja || "")
              : getLangValue(lang, caseStudy.india_desk_title || "", caseStudy.india_desk_title_ja || "")}
          </Link>

          {/* Company + CEO header */}
          {(companyName || ceoName || caseStudy.logo) && (
            <div className="flex items-center gap-3 mb-4">
              {caseStudy.logo && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md ring-2 ring-white/30">
                  <img src={caseStudy.logo} alt="" className="w-full h-full object-contain p-1" />
                </div>
              )}
              <div>
                {companyName && <p className="font-semibold text-white leading-snug">{companyName}</p>}
                {ceoName && <p className="text-white/70 text-sm leading-snug">{ceoName}</p>}
              </div>
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
            {getLangValue(lang, caseStudy.title, caseStudy.title_ja)}
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <article className="py-16 bg-background">
        <div className="mx-auto px-4 max-w-7xl">

          {(caseStudy.subtitle || caseStudy.subtitle_ja) && (
            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
              {getLangValue(lang, caseStudy.subtitle, caseStudy.subtitle_ja)}
            </h2>
          )}

          {getLangValue(lang, caseStudy.tags, caseStudy.tags_ja) && (
            <div className="mb-4">
              <p className="text-lg font-medium text-primary">
                {getLangValue(lang, caseStudy.tags, caseStudy.tags_ja)}
              </p>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{
              __html: getLangValue(lang, caseStudy.hero_description, caseStudy.hero_description_ja) || "",
            }}
          />

          {(caseStudy.benefit || caseStudy.benefit_ja || caseStudy.implementation || caseStudy.implementation_ja) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {(caseStudy.benefit || caseStudy.benefit_ja) && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h3 className="font-bold text-pink-600 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {getLangValue(lang, "Subject", "課題")}
                  </h3>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: getLangValue(lang, caseStudy.benefit, caseStudy.benefit_ja) || "" }}
                  />
                </div>
              )}
              {(caseStudy.implementation || caseStudy.implementation_ja) && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h3 className="font-bold text-pink-600 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {getLangValue(lang, "Implementation Effect", "導入効果")}
                  </h3>
                  <div
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: getLangValue(lang, caseStudy.implementation, caseStudy.implementation_ja) || "" }}
                  />
                </div>
              )}
            </div>
          )}

          {caseStudy.secondary_image && (
            <div className="mt-12 flex justify-center">
              <img src={`/storage/${caseStudy.secondary_image}`} className="w-2/3 rounded-lg shadow-md" />
            </div>
          )}

          {(caseStudy.content || caseStudy.content_ja) && (
            <div
              className="prose prose-lg max-w-none mt-10"
              dangerouslySetInnerHTML={{ __html: getLangValue(lang, caseStudy.content, caseStudy.content_ja) || "" }}
            />
          )}
        </div>
      </article>

      {/* RELATED */}
      {relatedCases.length > 0 && (
        <div className="bg-section-light">
          <section className="py-10 container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded"></span>
              {getLangValue(lang, "Refer other case studies", "他の事例を見る")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCases.map((item: CaseStudy) => (
                <Link
                  key={caseStudyKey(item)}
                  href={caseStudyHref(item)}
                  className="group"
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                    {item.hero_image && (
                      <img
                        src={`/storage/${item.hero_image}`}
                        alt={getLangValue(lang, item.title, item.title_ja)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {getLangValue(lang, item.title, item.title_ja)}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/blogs/casestudies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                {getLangValue(lang, "List of Case Studies", "事例一覧")}
              </Link>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
}