<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KG8D93T8');
    </script>
    <!-- End Google Tag Manager -->

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-M6094B5NH9"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-M6094B5NH9');
    </script>
    <script>
        function gtag_report_conversion(url) {
            var callback = function() {
                if (typeof(url) != 'undefined') {
                    window.location = url;
                }
            };
            gtag('event', 'conversion', {
                'send_to': 'AW-16928759139/qTUsCKi918wcEOO6oYg_',
                'event_callback': callback
            });
            return false;
        }
    </script>
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @unless (request()->is('admin*'))
        @php
            // One canonical per page: https + www, no query string, no trailing slash
            $canonicalPath = '/' . trim(request()->getPathInfo(), '/');
        @endphp
        <link rel="canonical" href="https://{{ config('services.indosakura.com_domain', 'www.indosakura.com') }}{{ $canonicalPath }}">
    @endunless
    @unless (request()->is('admin*'))
        <!-- Organization structured data (JSON-LD) -->
        @verbatim
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.indosakura.com/#organization",
          "name": "Indo-Sakura",
          "legalName": "Indo-Sakura Software Japan K.K.",
          "url": "https://www.indosakura.com/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://www.indosakura.com/#logo",
            "url": "https://www.indosakura.com/image/logo.png",
            "contentUrl": "https://www.indosakura.com/image/logo.png",
            "caption": "Indo-Sakura"
          },
          "description": "Indo-Sakura is a global IT services company providing AI-driven development, enterprise applications, infrastructure managed services and custom software development services.",
          "foundingDate": "2005-12-12",
          "email": "sales@indosakura.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "6F Tokyo Genboku Kaikan, 5-30-13 Toyo",
            "addressLocality": "Koto-ku",
            "addressRegion": "Tokyo",
            "postalCode": "135-0016",
            "addressCountry": "JP"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-96863-91210",
            "contactType": "sales",
            "areaServed": "IN",
            "availableLanguage": ["English", "Japanese"]
          },
          "sameAs": [
            "https://www.facebook.com/indosakurasoftwarejapan",
            "https://www.linkedin.com/company/indo-sakura-software-japan/",
            "https://www.instagram.com/indosakurasoftware/"
          ]
        }
        </script>
        @endverbatim
    @endunless
    @inertiaHead
</head>

<body class="font-sans antialiased">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KG8D93T8"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @inertia
</body>

</html>