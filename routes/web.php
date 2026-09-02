<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Seo;

use App\Http\Controllers\Admin\SolutionController;
use App\Http\Controllers\Admin\SolutionMasterController;
use App\Http\Controllers\Admin\SolutionDetailController;
use App\Http\Controllers\Admin\NewseventController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\SeminarController;
use App\Http\Controllers\Admin\AdminCaseStudyController;

use App\Http\Controllers\TeamPageController;
use App\Http\Controllers\SeminarPageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\BlogPageController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\JobSectionController;
use App\Http\Controllers\JobPageController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\Admin\JobApplicationController as AdminJobApplicationController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GreetingController as AdminGreetingController;
use App\Http\Controllers\Admin\PhilosophyController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\HistoryController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\PolicyController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\GreetingPageController;
use App\Http\Controllers\PhilosophyPageController;
use App\Http\Controllers\ProfilePageController;
use App\Http\Controllers\HistoryPageController;
use App\Http\Controllers\ClientPageController;
use App\Http\Controllers\PolicyPageController;
use App\Http\Controllers\SolutionPageController;
use App\Http\Controllers\ServicePageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CaseStudyController;
use App\Http\Controllers\CorporateInfoPageController;
use App\Http\Controllers\Admin\CorporateInfoController;
use App\Http\Controllers\InfographicPageController;
use App\Http\Controllers\Admin\HomepageController;
use App\Http\Controllers\Admin\CorpProfileSettingsController;
use App\Http\Controllers\Admin\TeamCategoryController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\EventTypeController;
use App\Http\Controllers\Admin\IndiaDeskController;
use App\Http\Controllers\IndiaDeskPageController;
use App\Http\Controllers\Admin\IndiaDeskFaqController;
use App\Http\Controllers\Admin\ServiceItemController;
use App\Http\Controllers\Admin\HomeCaseStudyController as AdminHomeCaseStudyController;
use App\Http\Controllers\HomeCaseStudyController;
use App\Http\Controllers\WhitepaperController;
use App\Http\Controllers\Admin\WhitepaperController as AdminWhitepaperController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

/* =======================
| Auth / Landing
======================= */

Route::get('/admin', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/* =======================
| Dashboard
======================= */
Route::get('/dashboard', function () {
    return redirect()->route('admin.contacts.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', [HomeController::class, 'index'])->name('home');
/* =======================
| Profile
======================= */
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/* =======================
| Public Website Pages
======================= */
// Route::get('/', fn() => Inertia::render('Index'))->name('home');

/* Solutions */
// Route::get('/solutions', fn() => Inertia::render('Solutions'));
// Route::get('/solutions/sourcebytes-ai', fn() => Inertia::render('Solutions/SourceBytesAI'));
// Route::get('/solutions/smartsynch-ai', fn() => Inertia::render('Solutions/Smartsynch'));
// Route::get('/solutions/blueprint-ai', fn() => Inertia::render('Solutions/BlueprintAI'));
// Route::get('/solutions/cybersecurity', fn() => Inertia::render('Solutions/Cybersecurity'));
// Route::get('/solutions/brmssolutions', fn() => Inertia::render('Solutions/BRMSSolutions'));

/* Services */
// Route::get('/services', fn() => Inertia::render('Services'));
// Route::get('/services/ai-driven-development', fn() => Inertia::render('Services/Drivendevelopment'));
// Route::get('/services/ai-driven-modernization', fn() => Inertia::render('Services/Drivenmodern'));
// Route::get('/services/enterprise-applications', fn() => Inertia::render('Services/Application'));
// Route::get('/services/custom-software', fn() => Inertia::render('Services/Software'));
// Route::get('/services/infra-managed', fn() => Inertia::render('Services/Inframanage'));

/* Blogs */
// Route::get('/blogs', fn() => Inertia::render('Blogs'));
// Route::get('/blogs/1', fn() => Inertia::render('Blogs/Blog1'));
// Route::get('/blogs/2', fn() => Inertia::render('Blogs/Blog2'));
// Route::get('/blogs/3', fn() => Inertia::render('Blogs/Blog3'));
// Route::get('/blogs/4', fn() => Inertia::render('Blogs/Blog4'));
// Route::get('/blogs/5', fn() => Inertia::render('Blogs/Blog5'));

/*
 * ★ REWRITTEN — language switching is now domain-based (see SetLocale
 * middleware): en = indosakura.com, ja = indosakura.co.jp. Clicking EN/JA in
 * the header no longer POSTs to flip a session flag — it navigates here,
 * which 302-redirects to the SAME path + query string on the OTHER domain.
 * This has to be a real HTTP redirect (not an Inertia visit) since it
 * crosses origins, which the browser/Inertia can't do via XHR.
 *
 * The current path is passed explicitly as ?path=... by the frontend
 * (window.location.pathname + search) rather than relying on the Referer
 * header, since Referer can be stripped by the browser/extensions and isn't
 * guaranteed to be present.
 */
Route::get('/switch-language/{lang}', function (string $lang, \Illuminate\Http\Request $request) {
    $lang = $lang === 'ja' ? 'ja' : 'en';

    $currentHost = strtolower($request->getHost());
    $isProdDomain = str_ends_with($currentHost, '.com') || str_ends_with($currentHost, '.co.jp');

    // Preserve the current path + query string. Only accept a same-site
    // relative path from the ?path= param — never an absolute/external URL,
    // to avoid this becoming an open redirect.
    $path = (string) $request->query('path', '/');
    if (!str_starts_with($path, '/') || str_starts_with($path, '//')) {
        $path = '/';
    }

    // Local/staging (no .com or .co.jp host) — there's nowhere real to
    // cross-domain redirect to, so just flip the session locale in place,
    // same as the old toggle behavior, and stay on the current host.
    if (!$isProdDomain) {
        session(['lang' => $lang]);
        return redirect()->to($path);
    }

    $targetHost = $lang === 'ja'
        ? config('services.indosakura.co_jp_domain')
        : config('services.indosakura.com_domain');

    $scheme = $request->isSecure() ? 'https' : 'http';

    return redirect()->to("{$scheme}://{$targetHost}{$path}");
})->name('switch.language');

/* Contact & Utility */
Route::get('/contact', fn() => Inertia::render('Contact', [
    'seo' => Seo::where('page', 'contact')->first(),
]));
Route::get('/contact/thank-you', fn() => Inertia::render('ContactThankYou'))
    ->name('contact.thank_you');
Route::get('/sitemap', fn() => Inertia::render('Sitemap'));
Route::get('/usage', fn() => Inertia::render('Usage'));

/* Case Studies */
// Route::get('/casestudies', fn() => Inertia::render('Casestudies'));

// Route::get('/casestudies/{id}', function ($id) {
//     return match ($id) {
//         '1' => Inertia::render('Casestudies/Casestudies1'),
//         '2' => Inertia::render('Casestudies/Casestudies2'),
//         '3' => Inertia::render('Casestudies/Casestudies3'),
//         '4' => Inertia::render('Casestudies/Casestudies4'),
//         '5' => Inertia::render('Casestudies/Casestudies5'),
//         '6' => Inertia::render('Casestudies/Casestudies6'),
//         '7' => Inertia::render('Casestudies/Casestudies7'),
//         '8' => Inertia::render('Casestudies/Casestudies8'),
//         '9' => Inertia::render('Casestudies/Casestudies9'),
//         default => abort(404),
//     };
// });

Route::get('/blogs/casestudies', [CaseStudyController::class, 'index'])->name('casestudies.index');
Route::get('/india-desks/{indiaDeskSlug}/case-studies/{caseSlug}', [CaseStudyController::class, 'show'])->name('casestudies.show');
// Route::get('/blogs/casestudies/{slug}', [CaseStudyController::class, 'show']);

Route::get('/blogs/infographics/', [InfographicPageController::class, 'index']);

Route::get('/blogs/infographics/{infographic}', [InfographicPageController::class, 'show']);

/* Corporate info */
// Route::get('/corporate-info', fn() => Inertia::render('CorporateInfo'));
// Route::get('/corporate/greetings', fn() => Inertia::render('Corporate/Greetings'));
// Route::get('/corporate/philosophy', fn() => Inertia::render('Corporate/Philosophy'));
// Route::get('/corporate/profile', fn() => Inertia::render('Corporate/Profile'));
// Route::get('/corporate/history', fn() => Inertia::render('Corporate/History'));

// Route::get('/corporate/press-release', fn () => Inertia::render('Corporate/Pressrelease'));
// Route::get('/corporate/clients', fn() => Inertia::render('Corporate/Clients'));
// Route::get('/corporate/policy', fn() => Inertia::render('Corporate/Policy'));

/* Recruitment */
// Route::get('/recruitment', fn() => Inertia::render('Recruitment'));


Route::get('/cookie-policy', fn() => Inertia::render('CookiePolicy'));
// Route::get('/recruitment/projectmanager', fn() => Inertia::render('Recruitment/Projectmanager'));
// Route::get('/recruitment/financemanager', fn() => Inertia::render('Recruitment/Financemanager'));
// Route::get('/recruitment/data-scientist', fn() => Inertia::render('Recruitment/Datascientist'));
// Route::get('/recruitment/content-writer', fn() => Inertia::render('Recruitment/Contentwriter'));
// Route::get('/recruitment/consultants', fn() => Inertia::render('Recruitment/Consultants'));

// PUBLIC
Route::get('/corporate/press-release', [NewseventController::class, 'pressRelease'])
    ->name('pressrelease');

// Route::get('/newstemp1', fn() => Inertia::render('News/Newstemplate1'));
// Route::get('/newstemp2', fn() => Inertia::render('News/Newstemplate2'));
// Route::get('/newstemp3', fn() => Inertia::render('News/Newstemplate3'));


// PUBLIC detail page
Route::get('/news/{newsevent}', [NewseventController::class, 'show'])
    ->name('news.show');

// PUBLIC Team page
Route::get('/corporate/team', [TeamPageController::class, 'index'])
    ->name('team.page');

// PUBLIC Seminar page
Route::get('/blogs/seminars-index', [SeminarPageController::class, 'index']);
Route::get('/blogs/seminars/{seminar}', [SeminarPageController::class, 'show']);

// PUBLIC Contact form submit
Route::post('/contact/save', [ContactController::class, 'store'])
    ->name('contact.store');

Route::get('/blogs', [BlogPageController::class, 'index']);
Route::get('/blogs/{slug}', [BlogPageController::class, 'show']);

Route::get('/recruitment', [JobController::class, 'recruitment'])
    ->name('recruitment');

Route::get('/recruitment/{slug}', [JobPageController::class, 'show'])
    ->name('recruitment.show');

Route::post('/recruitment/{job}/apply', [JobApplicationController::class, 'store'])
    ->name('job.apply');

// Route::get('/', [NewseventController::class, 'home'])->name('home');

Route::get('/corporate/greetings', [GreetingPageController::class, 'index'])
    ->name('corporate.greetings');

Route::get('/corporate/philosophy', [PhilosophyPageController::class, 'index'])
    ->name('corporate.philosophy');

Route::get('/corporate/profile', [ProfilePageController::class, 'index'])
    ->name('corporate.profile');

Route::get('/corporate/history', [HistoryPageController::class, 'index'])
    ->name('corporate.history');

Route::get('/corporate/clients', [ClientPageController::class, 'index'])
    ->name('corporate.clients');

Route::get('corporate/policy', [PolicyPageController::class, 'index'])
    ->name('policy.index');

Route::get('corporate/policy{slug}', [PolicyPageController::class, 'index'])
    ->name('policy.show');

Route::get('/solutions', [SolutionPageController::class, 'index'])
    ->name('solutions.index');

Route::get('/solutions/{solutionSlug}/case-studies/{caseSlug}', [CaseStudyController::class, 'showSolutionCaseStudy'])
    ->name('solutions.case_studies.show');

Route::get('/solutions/{slug}', [SolutionPageController::class, 'show'])
    ->name('solutions.show');

Route::get('/services', [ServicePageController::class, 'index'])
    ->name('services.index');

Route::get('/services/{slug}', [ServicePageController::class, 'show'])
    ->name('services.show');

// ── Public ──
Route::get('/services', [ServicePageController::class, 'index'])->name('services.index');

Route::get('/services/{slug}', [ServicePageController::class, 'show'])->name('services.show');
// Child detail page (nested)

Route::get('/services/{serviceSlug}/{itemSlug}', [ServicePageController::class, 'showItem'])
    ->name('services.item.show');


Route::get('/corporate-info', [CorporateInfoPageController::class, 'index'])
    ->name('corporate.index');

Route::get('/india-desks', [IndiaDeskPageController::class, 'index'])
    ->name('india-desks.index');

Route::get('/india-desks/{slug}', [IndiaDeskPageController::class, 'show'])
    ->name('india-desks.show');

Route::get('/home-case-studies/{slug}', [HomeCaseStudyController::class, 'show'])->name('home-casestudies.show');

Route::post('/whitepaper/request', [WhitepaperController::class, 'store'])->name('whitepaper.request');


/* =======================
| Admin Panel
======================= */
Route::prefix('admin')
    ->middleware(['auth'])
    ->name('admin.')
    ->group(function () {

        Route::post('event-type',               [EventTypeController::class, 'store'])->name('event-type.store');
        Route::put('event-type/{eventType}',   [EventTypeController::class, 'update'])->name('event-type.update');
        Route::delete('event-type/{eventType}',   [EventTypeController::class, 'destroy'])->name('event-type.destroy');


        Route::get('site-settings', [SiteSettingsController::class, 'index'])->name('site-settings.index');
        Route::post('site-settings', [SiteSettingsController::class, 'update'])->name('site-settings.update');


        Route::get('homepage', [HomepageController::class, 'index'])
            ->name('homepage.index');
        Route::post('homepage', [HomepageController::class, 'update'])
            ->name('homepage.update');

        Route::get('corpprofile', [CorpProfileSettingsController::class, 'index'])
            ->name('corpprofile.index');
        Route::post('corpprofile', [CorpProfileSettingsController::class, 'update'])
            ->name('corpprofile.update');


        Route::resource('/infographics', \App\Http\Controllers\Admin\InfographicController::class)
            ->names('infographics');

        Route::post('infographics-page', [\App\Http\Controllers\Admin\InfographicController::class, 'updatePage'])->name('infographics.updatePage');


        Route::get('/corporate-info', [CorporateInfoController::class, 'index'])
            ->name('corporate.index');

        Route::post('/corporate-info', [CorporateInfoController::class, 'store'])
            ->name('corporate.store');

        Route::put('/corporate-info/{corporateInfo}', [CorporateInfoController::class, 'update'])
            ->name('corporate.update');

        Route::delete('/corporate-info/{corporateInfo}', [CorporateInfoController::class, 'destroy'])
            ->name('corporate.destroy');

        // ← new
        Route::post('/corporate-info-page', [CorporateInfoController::class, 'updatePage'])->name('corporate.updatePage');

        Route::post('newsevent/{newsevent}', [NewseventController::class, 'update'])
            ->name('newsevent.update');
        Route::resource('newsevent', NewseventController::class)
            ->except(['update']);


        // POST for update (FormData + image)
        Route::post('team/{team}', [TeamController::class, 'update'])
            ->name('team.update');

        Route::resource('team', TeamController::class)
            ->except(['update', 'show']);

        Route::post('/team-category',         [TeamCategoryController::class, 'store'])->name('team-category.store');
        Route::put('/team-category/{teamCategory}', [TeamCategoryController::class, 'update'])->name('team-category.update');
        Route::delete('/team-category/{teamCategory}', [TeamCategoryController::class, 'destroy'])->name('team-category.destroy');





        // Route::post('seminars/{seminar}', [SeminarController::class, 'update'])
        //     ->name('seminars.update');

        // Route::resource('seminars', SeminarController::class)
        //     ->except(['update']);

        Route::get('contacts', [AdminContactController::class, 'index'])
            ->name('contacts.index');

        Route::get('/contacts/{contact}', [AdminContactController::class, 'show'])
            ->name('contacts.show');

        Route::delete('/contacts/{contact}', [AdminContactController::class, 'destroy'])
            ->name('contacts.destroy');

        Route::resource('seminars', SeminarController::class)->except(['create', 'edit', 'show']);

        Route::resource('blogs', BlogController::class)
            ->except(['create', 'edit', 'show']);

        Route::post('blogs-page', [BlogController::class, 'updatePage'])->name('blogs.updatePage');

        Route::resource('jobs', JobController::class)
            ->names('jobs');

        Route::post('jobs/reorder', [JobController::class, 'reorder'])->name('jobs.reorder');


        /* Admin */

        Route::get('/job-applications/{job?}', [AdminJobApplicationController::class, 'index'])
            ->name('job-applications.index');

        Route::delete('/job-applications/{jobApplication}', [AdminJobApplicationController::class, 'destroy'])
            ->name('job-applications.destroy');

        Route::resource('faqs', FaqController::class)->names('faqs');

        Route::resource('greetings', AdminGreetingController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('greetings');



        Route::resource('philosophy', PhilosophyController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('philosophy');

        Route::resource('profile', AdminProfileController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('profile');

        Route::post('profile/reorder', [AdminProfileController::class, 'reorder'])
            ->name('profile.reorder');


        Route::resource('history', HistoryController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('history');

        Route::resource('clients', ClientController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('clients');

        Route::resource('policy', PolicyController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->names('policy');

        Route::resource('solutions', SolutionController::class)
            ->names('solutions');

        Route::post('solutions-page', [SolutionController::class, 'updatePage'])->name('solutions.updatePage');

        Route::resource('services', ServiceController::class)
            ->names('services');

        Route::get('service-industries', [
            \App\Http\Controllers\Admin\ServiceIndustryController::class,
            'index'
        ])->name('service-industries.index');

        Route::post('service-industries', [
            \App\Http\Controllers\Admin\ServiceIndustryController::class,
            'store'
        ])->name('service-industries.store');

        Route::put('service-industries/{serviceIndustry}', [
            \App\Http\Controllers\Admin\ServiceIndustryController::class,
            'update'
        ])->name('service-industries.update');

        Route::delete('service-industries/{serviceIndustry}', [
            \App\Http\Controllers\Admin\ServiceIndustryController::class,
            'destroy'
        ])->name('service-industries.destroy');

        Route::post('services-page', [ServiceController::class, 'updatePage'])->name('services.updatePage');
        // india desk industries

        Route::post('seminars-page', [SeminarController::class, 'updatePage'])->name('seminars.updatePage');
        Route::resource('india-desks', IndiaDeskController::class)
            ->names('india_desks');

        Route::get('india-desk-industries', [
            \App\Http\Controllers\Admin\IndiaDeskIndustryController::class,
            'index'
        ])->name('india-desk-industries.index');

        Route::post('india-desk-industries', [
            \App\Http\Controllers\Admin\IndiaDeskIndustryController::class,
            'store'
        ])->name('india-desk-industries.store');

        Route::put('india-desk-industries/{indiaDeskIndustry}', [
            \App\Http\Controllers\Admin\IndiaDeskIndustryController::class,
            'update'
        ])->name('india-desk-industries.update');

        Route::delete('india-desk-industries/{indiaDeskIndustry}', [
            \App\Http\Controllers\Admin\IndiaDeskIndustryController::class,
            'destroy'
        ])->name('india-desk-industries.destroy');

        Route::resource('india-desk-faqs', IndiaDeskFaqController::class)->names('india_desk_faqs');

        Route::get('seo', [SeoController::class, 'index'])->name('seo.index');
        Route::post('seo', [SeoController::class, 'store'])->name('seo.store');

        Route::get('/case-studies', [AdminCaseStudyController::class, 'index'])
            ->name('casestudies.index');


        // Route::post('/case-studies', [AdminCaseStudyController::class, 'store'])
        //     ->name('casestudies.store');

        // Route::put('/case-studies/{caseStudy}', [AdminCaseStudyController::class, 'update'])
        //     ->name('casestudies.update');

        // Route::delete('/case-studies/{caseStudy}', [AdminCaseStudyController::class, 'destroy'])
        //     ->name('casestudies.destroy');

        Route::post('case-studies-page', [AdminCaseStudyController::class, 'updatePage'])->name('case_studies.updatePage');

        Route::get('/india-desk-page', [IndiaDeskPageController::class, 'indexTop'])
            ->name('india_desks_page.index');

        Route::put('/india-desk-page', [IndiaDeskPageController::class, 'update'])
            ->name('india_desks_page.update');

        // Service Items (nested under a service)
        Route::get('services/{service}/items', [ServiceItemController::class, 'index'])->name('services.items.index');
        Route::post('services/{service}/items', [ServiceItemController::class, 'store'])->name('services.items.store');
        Route::put('services/{service}/items/{item}', [ServiceItemController::class, 'update'])->name('services.items.update');
        Route::delete('services/{service}/items/{item}', [ServiceItemController::class, 'destroy'])->name('services.items.destroy');

        Route::resource('home-case-studies', AdminHomeCaseStudyController::class)
            ->except(['create', 'edit', 'show'])
            ->names('home_case_studies');

        Route::get('whitepaper', [AdminWhitepaperController::class, 'index'])->name('whitepaper.index');
        Route::post('whitepaper', [AdminWhitepaperController::class, 'update'])->name('whitepaper.update');
        Route::delete('whitepaper/leads/{lead}', [AdminWhitepaperController::class, 'destroyLead'])->name('whitepaper.leads.destroy');
    });

Route::get('/storage/{path}', function (string $path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) abort(404);
    $mime = mime_content_type($fullPath);
    return response()->file($fullPath, ['Content-Type' => $mime]);
})->where('path', '.*')->name('storage.serve')->withoutMiddleware(['web']);

/* =======================
| 404 Fallback
======================= */
Route::fallback(fn() => Inertia::render('NotFound'));

/* =======================
| Auth Routes
======================= */
require __DIR__ . '/auth.php';
