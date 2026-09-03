// components/PageSeo.tsx
// Place inside <Layout> (or directly inside the page component) to inject
// per-page meta tags via Inertia's <Head>.
//
// Usage (Solutions/Show.tsx):
//   import PageSeo from "@/components/PageSeo";
//   const { pageSeo } = usePage<{ pageSeo: PageSeoProps }>().props;
//   ...
//   <PageSeo {...pageSeo} />

import { Head, usePage } from "@inertiajs/react";

export interface PageSeoProps {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_image?: string | null;
}

// ★ NEW — shared globally by HandleInertiaRequests so this component can
// build hreflang/canonical tags without every page passing domain info in.
interface SeoDomains {
  com_domain: string;
  co_jp_domain: string;
  current_host: string;
  current_path: string; // includes query string
}

export default function PageSeo({
  meta_title,
  meta_description,
  meta_keywords,
  og_image,
}: PageSeoProps) {
  // ★ NEW — hreflang + canonical support. .com and .co.jp serve the same
  // set of pages in different languages (see SetLocale / GeoRedirect), so
  // each page needs to tell search engines about its EN/JA counterpart and
  // declare its own canonical URL — otherwise this looks like duplicate
  // content across two domains rather than two localized versions of one.
  const { seoDomains } = usePage<{ seoDomains?: SeoDomains }>().props;

  let canonicalUrl: string | null = null;
  let enUrl: string | null = null;
  let jaUrl: string | null = null;

  if (seoDomains) {
    const { com_domain, co_jp_domain, current_host, current_path } = seoDomains;
    const isJa = current_host.endsWith(".co.jp");

    // Same path on both domains — the switch-language route guarantees En
    // and Ja pages live at equivalent paths, which is exactly what hreflang
    // alternates assume.
    enUrl = `https://${com_domain}${current_path}`;
    jaUrl = `https://${co_jp_domain}${current_path}`;
    canonicalUrl = isJa ? jaUrl : enUrl;
  }

  return (
    <Head>
      {/* Primary meta */}
      {meta_title       && <title>{meta_title}</title>}
      {meta_description && <meta name="description" content={meta_description} />}
      {meta_keywords    && <meta name="keywords" content={meta_keywords} />}

      {/* ★ NEW — canonical + hreflang alternates. Each domain declares
          itself canonical for its own language (not one domain claiming
          canonical over the other), which is the correct pattern for
          genuinely localized content rather than a translated duplicate. */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {enUrl && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {jaUrl && <link rel="alternate" hrefLang="ja" href={jaUrl} />}
      {enUrl && <link rel="alternate" hrefLang="x-default" href={enUrl} />}

      {/* Open Graph */}
      {meta_title       && <meta property="og:title"       content={meta_title} />}
      {meta_description && <meta property="og:description" content={meta_description} />}
      {og_image         && <meta property="og:image"       content={og_image} />}
      {og_image         && <meta property="og:image:width"  content="1200" />}
      {og_image         && <meta property="og:image:height" content="630" />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {meta_title       && <meta name="twitter:title"       content={meta_title} />}
      {meta_description && <meta name="twitter:description" content={meta_description} />}
      {og_image         && <meta name="twitter:image"       content={og_image} />}
    </Head>
  );
}