import { type FormEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter, Link, useParams, type RouterProps } from 'wouter';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Maximize2,
  Menu,
  Phone,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { GlowAIChat } from '@/components/glow-ai-chat';
import { InstallAppButton } from '@/components/install-app-button';
import { BackToTop, ContactLinkFallback, InPageAnchors, ScrollProgress, SkipLink } from '@/components/site-chrome';
import { CategoryGrid, FaqSection, IngredientIndex, TrustBar } from '@/components/home-sections';
import { families, type Product, type ProductBrand, type ProductImage } from '@/data/products';
import { leadershipProfiles } from '@/data/leadership';
import { catalog, categoriesOf, productBySlug, productEnquiryMessage, SORT_OPTIONS, sortCatalog, whatsappLink, matchesQuery } from '@/lib/catalog';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { getPageSeo, getStructuredData, SOCIAL_IMAGE_URL } from '@/lib/seo';

const queryClient = new QueryClient();
const company = 'DERMI NATURAL HEALTHCARE PVT LTD';
const officialLogo = `${import.meta.env.BASE_URL}dermi-natural-logo.webp`;
const publishedProducts = catalog;

function ensureTrailingRouteSlash(path: string) {
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex < 0 ? path : path.slice(0, suffixIndex);
  if (!pathname.startsWith('/') || pathname === '/' || pathname.endsWith('/')) return path;
  return `${pathname}/${suffixIndex < 0 ? '' : path.slice(suffixIndex)}`;
}

const formatRouteHref: NonNullable<RouterProps['hrefs']> = (path) => ensureTrailingRouteSlash(path);
const normalizeRouteNavigation: NonNullable<RouterProps['aroundNav']> = (navigate, to, options) => {
  navigate(ensureTrailingRouteSlash(to), options);
};

function Brand({ dark = false }: { dark?: boolean }) {
  return <Link href="/" className={`brand-lockup ${dark ? 'brand-lockup-dark' : ''}`} data-testid="link-brand-home">
    {!dark && <img src={officialLogo} alt="Dermi Natural Healthcare leaf and DNH monogram" />}
    <span><b>DERMI NATURAL</b><small>HEALTHCARE PVT LTD</small></span>
  </Link>;
}

function Header() {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const updateCompact = () => setCompact(window.scrollY > 28);
    updateCompact();
    window.addEventListener('scroll', updateCompact, { passive: true });
    return () => window.removeEventListener('scroll', updateCompact);
  }, []);
  const nav = [['/about/', 'Our Story'], ['/products/', 'Products'], ['/contact/', 'Contact']];
  const isActive = (href: string) => path === href || (href === '/products/' && path.startsWith('/products'));
  return <>
  <div className="topbar">
    <div className="topbar-inner">
      <span className="topbar-note">
        <b>DERMI NATURAL HEALTHCARE</b>
        <i aria-hidden="true" />
        <span>Skincare &amp; nutritional supplements</span>
      </span>
      <div className="topbar-links">
        <a href="tel:9137277233" data-testid="link-topbar-phone"><Phone size={13} aria-hidden="true" />91372 77233</a>
        <a href="mailto:derminatural@gmail.com" data-testid="link-topbar-email"><Mail size={13} aria-hidden="true" />derminatural@gmail.com</a>
      </div>
    </div>
  </div>
  <header className={`site-header ${compact ? 'is-compact' : ''}`}>
    <ScrollProgress />
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([href, text]) => <Link key={href} href={href} className={`nav-link ${isActive(href) ? 'is-active' : ''}`} aria-current={isActive(href) ? 'page' : undefined} data-testid={`link-nav-${text.toLowerCase().replace(' ', '-')}`}>{text}</Link>)}
        <Link href="/contact/" className="nav-contact" data-testid="link-nav-enquire">Enquire <ArrowUpRight size={14} /></Link>
      </nav>
      <button className="mobile-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} data-testid="button-menu-toggle">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      {[['/', 'Home'], ...nav, ...families.map((family) => [`/${family.slug}/`, family.title])].map(([href, text]) => <Link key={href} href={href} data-testid={`mobile-nav-${text.toLowerCase().replaceAll(' ', '-')}`}>{text}<ArrowUpRight size={15} /></Link>)}
      <div className="mobile-nav-contact">
        <a href="tel:9137277233" data-testid="mobile-nav-phone"><Phone size={14} aria-hidden="true" />91372 77233</a>
        <a href="mailto:derminatural@gmail.com" data-testid="mobile-nav-email"><Mail size={14} aria-hidden="true" />derminatural@gmail.com</a>
      </div>
    </nav>}
  </header>
  </>;
}

function Footer() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const categories = categoriesOf().slice(0, 4);
  return <footer ref={ref} className={`footer scroll-reveal${isVisible ? ' is-visible' : ''}`}>
    <div className="footer-main">
      <div className="footer-brand">
        <Brand dark />
        <p>Thoughtful healthcare and wellness, with clear product information at the centre.</p>
        <div className="footer-tags"><span>Skincare</span><span>Nutritional supplements</span></div>
      </div>
      <div className="footer-column">
        <span className="eyebrow">EXPLORE</span>
        <Link href="/about/">Our Story</Link>
        <Link href="/products/">All products</Link>
        <Link href="/products/#categories">Shop by category</Link>
        <Link href="/#faq">Questions</Link>
        <Link href="/contact/">Contact</Link>
      </div>
      <div className="footer-column">
        <span className="eyebrow">OUR BRANDS</span>
        {families.map((family) => <Link key={family.slug} href={`/${family.slug}/`}>{family.title}</Link>)}
        <span className="eyebrow footer-subhead">CATEGORIES</span>
        {categories.map((category) => <Link key={category.slug} href={`/products/?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>)}
      </div>
      <div className="footer-column">
        <span className="eyebrow">GET IN TOUCH</span>
        <a href="mailto:derminatural@gmail.com">derminatural@gmail.com</a>
        <a href="tel:9137277233">91372 77233</a>
        <a href={whatsappLink('Hello Dermi Natural team, I have a question about your products.')} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} {company}</span>
      <span>Product information is shown as provided.</span>
      <div className="footer-bottom-links">
        <a href="/sitemap.xml">Sitemap</a>
        <Link href="/contact/">Contact us <ArrowUpRight size={13} /></Link>
      </div>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <>
    <SkipLink />
    <Header />
    <main id="main-content">{children}</main>
    <Footer />
    <BackToTop />
    <ContactLinkFallback />
    <InPageAnchors />
  </>;
}
function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }
function SectionIntro({ label, title, body, link, to }: { label: string; title: ReactNode; body?: string; link?: string; to?: string }) {
  return <div className="section-intro"><div><Eyebrow>{label}</Eyebrow><h2 className="serif">{title}</h2>{body && <p>{body}</p>}</div>{link && to && <Link href={to} className="text-link">{link}<ArrowUpRight size={15} /></Link>}</div>;
}
function BrandPill({ brand }: { brand: ProductBrand }) { return <span className={`family-pill family-${brand.toLowerCase()}`}>{brand}</span>; }

function ProductArt({ product, image, compact = false }: { product: Product; image?: ProductImage; compact?: boolean }) {
  const currentImage = image || product.images[0];
  return <div className={`product-art product-art-${product.packagingOrientation} art-${product.brand.toLowerCase()} ${compact ? 'product-art-compact' : ''}`} data-testid={`visual-product-${product.slug}`}>
    <img key={currentImage.src} className="real-pack-image gallery-image-enter" src={currentImage.src} alt={currentImage.alt} loading={compact ? 'lazy' : undefined} decoding="async" />
    {product.images.length > 1 && compact && <span className="art-badge" aria-hidden="true">+{product.images.length - 1} views</span>}
  </div>;
}

function ProductCard({ product }: { product: Product }) {
  const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>();
  return <Link ref={ref} href={`/products/${product.slug}/`} className={`product-card product-card-${product.packagingOrientation} scroll-reveal${isVisible ? ' is-visible' : ''}`} data-testid={`card-product-${product.slug}`}>
    <ProductArt product={product} compact />
    <div className="product-card-copy">
      <div className="product-meta"><BrandPill brand={product.brand} /><span>{product.category}</span></div>
      <h3>{product.name}</h3>
      <p>{product.sizePack}{product.ingredients.length ? ` · ${product.ingredients.slice(0, 2).join(' · ')}` : ''}</p>
      <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
      <span className="card-view">View product</span>
    </div>
  </Link>;
}

function FamilyStrip() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  return <section ref={ref} className={`family-strip page-wrap scroll-reveal${isVisible ? ' is-visible' : ''}`} aria-label="Browse brands">
    <div className="family-strip-heading"><Eyebrow>TWO DISTINCT BRANDS</Eyebrow><p>Explore each range</p></div>
    {families.map((family) => <Link key={family.slug} href={`/${family.slug}/`} className="family-tile" data-testid={`link-family-${family.slug}`}><span>{family.mark}</span><div><b>{family.title}</b><small>{family.descriptor}</small></div><ArrowUpRight size={17} /></Link>)}
  </section>;
}

function Home() {
  const featured = publishedProducts.filter((product) => product.featured).slice(0, 3);
  const featuredReveal = useScrollReveal<HTMLElement>();
  const manifestoReveal = useScrollReveal<HTMLElement>();
  const aboutReveal = useScrollReveal<HTMLElement>();
  const contactReveal = useScrollReveal<HTMLElement>();
  return <Shell><div className="page-enter">
    <section className="home-hero">
      <div className="hero-copy"><Eyebrow>HEALTHCARE &amp; WELLNESS</Eyebrow><h1 className="serif">Care, made<br /><em>considerate.</em></h1><p className="hero-lede">A healthcare company with a clear point of view: thoughtful product ranges, and information you can actually find.</p><div className="hero-actions"><Link href="/products" className="button-primary" data-testid="link-hero-products">Explore our products <ArrowRight size={16} /></Link><Link href="/about" className="text-link" data-testid="link-hero-story">Meet Dermi Natural <ArrowUpRight size={15} /></Link><InstallAppButton /></div><div className="hero-note"><span className="note-mark">01</span><span>Independent product information.<br />A considered portfolio.</span></div></div>
      <div className="hero-art botanical-stage" role="img" aria-label="Dermi Natural Healthcare official mark with a botanical illustration">
        <div className="stage-wash" /><div className="stage-arc stage-arc-one" /><div className="stage-arc stage-arc-two" /><span className="stage-kicker">DERMI NATURAL</span><div className="botanical-shadow botanical-shadow-one" /><div className="botanical-shadow botanical-shadow-two" />
        <svg className="botanical-branch branch-one" viewBox="0 0 250 390" fill="none" aria-hidden="true"><path d="M124 374C116 290 126 212 159 114C172 76 190 44 222 15" stroke="#8b967d" strokeWidth="1.4" /><path d="M142 257C94 238 66 207 44 165C83 172 119 198 146 231" fill="#b7bea8" fillOpacity=".72" /><path d="M155 195C162 150 188 117 229 91C229 135 208 172 164 205" fill="#c6cbb8" fillOpacity=".8" /><path d="M126 312C82 298 53 273 29 235C70 240 105 261 131 290" fill="#d2d4c3" fillOpacity=".9" /><path d="M170 145C170 105 183 68 210 37C222 78 209 116 176 151" fill="#b7bea8" fillOpacity=".7" /><path d="M142 257L88 209M155 195L203 138M126 312L73 269" stroke="#929d84" strokeWidth="1" /></svg>
        <svg className="botanical-branch branch-two" viewBox="0 0 220 320" fill="none" aria-hidden="true"><path d="M33 300C70 226 117 151 190 48" stroke="#aa9a6d" strokeWidth="1.2" /><path d="M77 228C48 218 30 196 23 163C56 176 75 195 84 216" fill="#d1c69e" fillOpacity=".8" /><path d="M121 164C123 129 143 101 178 82C173 116 154 143 127 171" fill="#c6cbb8" fillOpacity=".75" /><path d="M150 122L165 101M91 204L54 180" stroke="#a99a71" strokeWidth="1" /></svg>
        <div className="logo-presence"><img src={officialLogo} alt="Dermi Natural Healthcare official leaf and monogram" /></div><div className="stage-note"><span className="stage-note-rule" /><span>SKINCARE<br />NUTRITIONAL SUPPLEMENTS</span></div><span className="stage-coordinate">DNH&nbsp; / &nbsp;02 BRANDS</span><span className="stage-orb orb-gold" /><span className="stage-orb orb-ivory" />
      </div>
      <div className="hero-footline"><span>DERMI NATURAL HEALTHCARE PVT LTD</span><span>THOUGHTFUL BY DESIGN <ArrowDownRight size={13} /></span></div>
    </section>
    <TrustBar />
    <FamilyStrip />
    <section ref={featuredReveal.ref} className={`featured-section page-wrap scroll-reveal${featuredReveal.isVisible ? ' is-visible' : ''}`}><SectionIntro label="A CLOSER LOOK" title="Selected from our ranges" body="Start with a few products across the Dermi Natural portfolio." link="View all products" to="/products" /><div className="product-grid featured-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <CategoryGrid />
    <section ref={manifestoReveal.ref} className={`manifesto scroll-reveal${manifestoReveal.isVisible ? ' is-visible' : ''}`}><div className="manifesto-number">01 / 03</div><div className="manifesto-copy"><Eyebrow>A CLEARER WAY TO EXPLORE</Eyebrow><h2 className="serif">Good information<br />belongs <em>up front.</em></h2><p>We believe it should be simple to understand what a product is called, which brand it belongs to, and which ingredients are listed. So we put those details where they belong: in the open.</p><Link href="/products" className="button-outline" data-testid="link-manifesto-products">Browse product details <ArrowRight size={16} /></Link></div><div className="manifesto-aside"><span className="big-initial">D</span><span>OUR APPROACH</span><p>Clarity in the details.<br />Care in the presentation.</p></div></section>
    <IngredientIndex />
    <section ref={aboutReveal.ref} className={`home-about page-wrap scroll-reveal${aboutReveal.isVisible ? ' is-visible' : ''}`}><div className="about-number">01<span> / ABOUT</span></div><div><Eyebrow>ABOUT DERMI NATURAL</Eyebrow><h2 className="serif">A company focused<br />on <em>everyday care.</em></h2></div><div className="home-about-text"><p>{company} brings together skincare and nutritional supplement ranges under one roof. Our aim here is simple: a thoughtful, clear place to learn about our products and connect with us.</p><Link href="/about" className="text-link" data-testid="link-home-about">More about us <ArrowUpRight size={15} /></Link></div></section>
    <FaqSection />
    <section ref={contactReveal.ref} className={`contact-banner scroll-reveal${contactReveal.isVisible ? ' is-visible' : ''}`}><div><Eyebrow>HAVE A QUESTION?</Eyebrow><h2 className="serif">We’re easy to<br /><em>reach.</em></h2></div><div className="contact-banner-right"><p>For product enquiries or general information, get in touch with our team directly.</p><Link href="/contact" className="button-primary button-gold" data-testid="link-home-contact">Contact Dermi Natural <ArrowRight size={16} /></Link></div><span className="banner-mark">DNH</span></section>
  </div></Shell>;
}

function About() {
  const featureReveal = useScrollReveal<HTMLDivElement>();
  const valuesReveal = useScrollReveal<HTMLElement>();
  const ctaReveal = useScrollReveal<HTMLElement>();
  return <Shell><div className="page-enter">
    <div className="page-hero page-wrap"><div><Eyebrow>ABOUT DERMI NATURAL</Eyebrow><h1 className="serif">Care is in the<br /><em>consideration.</em></h1></div><div className="page-hero-side"><span className="page-index">01 <i /> ABOUT</span><p>A healthcare and wellness company bringing considered product brands into one clear, connected portfolio.</p></div></div>
    <div ref={featureReveal.ref} className={`about-feature scroll-reveal${featureReveal.isVisible ? ' is-visible' : ''}`}><div className="about-feature-mark"><img src={officialLogo} alt="Dermi Natural Healthcare official transparent brand mark" /><span>THE OFFICIAL MARK</span></div><div className="about-feature-copy"><Eyebrow>WHO WE ARE</Eyebrow><h2 className="serif">Introducing<br />Dermi Natural Healthcare.</h2><p>Dermi Natural Healthcare is a healthcare and wellness company with two product brands: GLETSY and NEUTOGLOW. Each has its own place in the portfolio, from skincare to nutritional supplements.</p><p>This site is designed to make our product information easier to navigate and our company easier to contact.</p></div></div>
    <TrustBar />
    <LeadershipSection />
    <section ref={valuesReveal.ref} className={`values-section page-wrap scroll-reveal${valuesReveal.isVisible ? ' is-visible' : ''}`}><SectionIntro label="WHAT GUIDES US" title="Clarity is a form of care." body="The way information is shared matters. We keep the product names and provided ingredient details visible, and avoid making claims beyond them." /><div className="values-list"><article><span>01</span><div><h3>Clear by default</h3><p>Find product names, brands and ingredient details without having to search through noise.</p></div><ArrowDownRight /></article><article><span>02</span><div><h3>Thoughtful presentation</h3><p>Distinct product ranges, brought together through a consistent and considered company identity.</p></div><ArrowDownRight /></article><article><span>03</span><div><h3>Open conversation</h3><p>Questions and enquiries have a direct route to the people behind Dermi Natural.</p></div><ArrowDownRight /></article></div></section>
    <FamilyStrip />
    <FaqSection label="STILL WONDERING" title="A few things people ask." intro="What this site covers, and where to go for anything it does not." />
    <section ref={ctaReveal.ref} className={`about-cta scroll-reveal${ctaReveal.isVisible ? ' is-visible' : ''}`}><Eyebrow>GET TO KNOW OUR PORTFOLIO</Eyebrow><h2 className="serif">Explore the ranges<br /><em>at your own pace.</em></h2><Link href="/products" className="button-primary" data-testid="link-about-products">Discover products <ArrowRight size={16} /></Link></section>
  </div></Shell>;
}

function LeadershipSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  return <section id="leadership" ref={ref} className={`leadership-section page-wrap${isVisible ? ' is-visible' : ''}`} aria-labelledby="leadership-title" data-testid="section-leadership">
    <header className="leadership-heading">
      <Eyebrow>LEADERSHIP</Eyebrow>
      <h2 id="leadership-title" className="serif">Meet Our <em>Directors</em></h2>
    </header>
    <div className="leadership-grid">
      {leadershipProfiles.map((director, index) => (
        <article className="leadership-card" key={director.id} data-testid={`card-director-${director.id}`}>
          <figure className="leadership-portrait">
            <div className="leadership-photo-frame">
              <img
                src={director.image}
                alt={`Portrait of ${director.name}`}
                loading="lazy"
                decoding="async"
                style={director.imageObjectPosition ? { objectPosition: director.imageObjectPosition } : undefined}
                data-testid={`img-director-${director.id}`}
              />
            </div>
            <figcaption className="leadership-photo-caption">
              <span>OFFICIAL PORTRAIT</span>
              <span>{String(index + 1).padStart(2, '0')} / LEADERSHIP</span>
            </figcaption>
          </figure>
          <div className="leadership-copy">
            <div className="leadership-meta">
              <span className="leadership-meta-number">{String(index + 1).padStart(2, '0')}</span>
              <i aria-hidden="true" />
              <span>{director.role}</span>
            </div>
            <h3>{director.name}</h3>
            <p className="leadership-company">{director.company}</p>
          </div>
        </article>
      ))}
    </div>
  </section>;
}

type FilterState = { query: string; brand: string; category: string; sort: string };

const DEFAULT_FILTERS: FilterState = { query: '', brand: 'All', category: 'All', sort: 'featured' };

function readFiltersFromUrl(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_FILTERS;
  const params = new URLSearchParams(window.location.search);
  const brands = ['All', ...families.map((family) => family.title)];
  const categories = ['All', ...categoriesOf().map((category) => category.name)];
  const brand = params.get('brand') || 'All';
  const category = params.get('category') || 'All';
  const sort = params.get('sort') || 'featured';
  return {
    query: params.get('q') || '',
    brand: brands.includes(brand) ? brand : 'All',
    category: categories.includes(category) ? category : 'All',
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : 'featured',
  };
}

function Products() {
  const [filters, setFilters] = useState<FilterState>(readFiltersFromUrl);
  const directoryReveal = useScrollReveal<HTMLDivElement>();
  const categories = useMemo(() => categoriesOf().map((category) => category.name), []);
  const filtered = useMemo(() => {
    const list = publishedProducts.filter((product) =>
      matchesQuery(product, filters.query) &&
      (filters.brand === 'All' || product.brand === filters.brand) &&
      (filters.category === 'All' || product.category === filters.category));
    return sortCatalog(list, filters.sort);
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set('q', filters.query.trim());
    if (filters.brand !== 'All') params.set('brand', filters.brand);
    if (filters.category !== 'All') params.set('category', filters.category);
    if (filters.sort !== 'featured') params.set('sort', filters.sort);
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ''}`;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(window.history.state, '', next);
    }
  }, [filters]);

  const activeCount = [filters.query.trim() ? 1 : 0, filters.brand !== 'All' ? 1 : 0, filters.category !== 'All' ? 1 : 0].reduce((a, b) => a + b, 0);
  const reset = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), []);
  const update = (patch: Partial<FilterState>) => setFilters((old) => ({ ...old, ...patch }));

  return <Shell><div className="page-enter">
    <div className="products-hero page-wrap"><div><Eyebrow>THE DERMI NATURAL PORTFOLIO</Eyebrow><h1 className="serif">Products,<br /><em>in focus.</em></h1></div><div className="products-hero-side"><span className="page-index">01 <i /> PRODUCT DIRECTORY</span><p>Explore skincare and nutritional supplement ranges. Product information is shared as provided by the company.</p><span className="directory-count">{publishedProducts.length.toString().padStart(2, '0')} <small>PUBLISHED PRODUCTS</small></span></div></div>
    <div ref={directoryReveal.ref} className={`directory page-wrap scroll-reveal${directoryReveal.isVisible ? ' is-visible' : ''}`}>
      <div className="directory-toolbar">
        <label className="search-box"><Search size={17} /><span className="sr-only">Search products</span><input type="search" placeholder="Search names, ingredients or products" value={filters.query} onChange={(event) => update({ query: event.target.value })} data-testid="input-product-search" />{filters.query && <button type="button" className="search-clear" onClick={() => update({ query: '' })} aria-label="Clear search"><X size={14} /></button>}</label>
        <div className="toolbar-right">
          <label className="sort-control"><span>Sort</span><select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} aria-label="Sort products" data-testid="select-sort">{SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
      </div>
      <div className="directory-controls">
        <div className="filter-tabs" role="group" aria-label="Filter products by brand">{['All', ...families.map((family) => family.title)].map((item) => <button key={item} className={filters.brand === item ? 'filter-active' : ''} onClick={() => update({ brand: item })} type="button" aria-pressed={filters.brand === item} data-testid={`filter-brand-${item.toLowerCase()}`}>{item === 'All' ? 'All brands' : item}</button>)}</div>
      </div>
      <div className="directory-controls category-controls"><div className="filter-tabs" role="group" aria-label="Filter products by category">{['All', ...categories].map((item) => <button key={item} className={filters.category === item ? 'filter-active' : ''} onClick={() => update({ category: item })} type="button" aria-pressed={filters.category === item} data-testid={`filter-category-${item.toLowerCase().replaceAll(' ', '-')}`}>{item === 'All' ? 'All categories' : item}</button>)}</div></div>
      <div className="results-line" aria-live="polite">
        <span>{filtered.length === 1 ? '01 PRODUCT' : `${filtered.length.toString().padStart(2, '0')} PRODUCTS`}</span>
        <span className="results-summary">
          {activeCount > 0 && <button type="button" className="clear-filters" onClick={reset} data-testid="button-clear-search">Clear {activeCount > 1 ? 'all filters' : 'filter'} <X size={13} /></button>}
          <span>{filters.brand === 'All' ? 'ALL BRANDS' : filters.brand}{filters.category !== 'All' ? ` / ${filters.category.toUpperCase()}` : ''}</span>
        </span>
      </div>
      {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><div className="empty-icon"><Search /></div><h2 className="serif">Nothing in this view.</h2><p>Try another product name, ingredient or category.</p><button type="button" className="text-link" onClick={reset} data-testid="button-clear-search">Clear filters <X size={14} /></button></div>}
    </div>
    <FamilyStrip />
    <CategoryGrid />
  </div></Shell>;
}

function Lightbox({ product, index, onClose, onStep }: { product: Product; index: number; onClose: () => void; onStep: (delta: number) => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onStep(1);
      if (event.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onStep]);

  const image = product.images[Math.min(index, product.images.length - 1)];
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} packaging image ${index + 1} of ${product.images.length}`} onClick={onClose} data-testid="lightbox">
    <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close image"><X size={20} /></button>
    {product.images.length > 1 && <button type="button" className="lightbox-nav lightbox-prev" onClick={(event) => { event.stopPropagation(); onStep(-1); }} aria-label="Previous image"><ChevronLeft size={22} /></button>}
    <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
      <img src={image.src} alt={image.alt} />
      <figcaption>{image.alt}<span>{index + 1} / {product.images.length}</span></figcaption>
    </figure>
    {product.images.length > 1 && <button type="button" className="lightbox-nav lightbox-next" onClick={(event) => { event.stopPropagation(); onStep(1); }} aria-label="Next image"><ChevronRight size={22} /></button>}
  </div>;
}

function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = productBySlug(params.slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [shareNote, setShareNote] = useState('');
  const detailReveal = useScrollReveal<HTMLElement>();
  const relatedReveal = useScrollReveal<HTMLElement>();
  useEffect(() => setImageIndex(0), [params.slug]);
  if (!product) return <NotFound />;
  const related = publishedProducts.filter((item) => item.brand === product.brand && item.slug !== product.slug).slice(0, 3);
  const activeImage = product.images[Math.min(imageIndex, product.images.length - 1)];
  const step = (delta: number) => setImageIndex((current) => (current + delta + product.images.length) % product.images.length);

  async function share() {
    const url = window.location.href;
    const data = { title: `${product!.name} | Dermi Natural Healthcare`, text: `${product!.name} \u2014 ${product!.sizePack}`, url };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* the share sheet was dismissed */
      }
      return;
    }
    let note = 'Copy the address bar link';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        note = 'Link copied';
      }
    } catch {
      note = 'Copy the address bar link';
    }
    setShareNote(note);
    window.setTimeout(() => setShareNote(''), 2400);
  }

  return <Shell><div className="page-enter">
    <div className="breadcrumb page-wrap"><Link href="/products" data-testid="link-back-products">Products</Link><span>/</span><Link href={`/${product.brand.toLowerCase()}`}>{product.brand}</Link><span>/</span><span>{product.name}</span></div>
    <section ref={detailReveal.ref} className={`detail-layout page-wrap scroll-reveal${detailReveal.isVisible ? ' is-visible' : ''}`}>
      <div className="detail-visual">
        <div className="detail-art-wrap">
          <div className="detail-art">
            <ProductArt product={product} image={activeImage} />
            <button type="button" className="zoom-button" onClick={() => setZoomed(true)} aria-label="View packaging image full screen" data-testid="button-product-zoom"><Maximize2 size={15} />Expand</button>
          </div>
          {product.images.length > 1 && <div className="gallery-thumbs" role="group" aria-label="Product images">{product.images.map((image, index) => <button type="button" key={image.src} className={`gallery-thumb ${imageIndex === index ? 'active' : ''}`} aria-label={`Show image ${index + 1}: ${image.alt}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><img src={image.src} alt="" loading="lazy" /></button>)}</div>}
        </div>
        <div className="detail-actions-bar">
          <a className="button-primary" href={whatsappLink(productEnquiryMessage(product))} target="_blank" rel="noopener noreferrer" data-testid="link-product-whatsapp"><FaWhatsapp size={16} aria-hidden="true" />Ask on WhatsApp</a>
          <button type="button" className="button-outline" onClick={share} data-testid="button-product-share"><Share2 size={15} aria-hidden="true" />Share{shareNote ? ` · ${shareNote}` : ''}</button>
        </div>
      </div>
      <div className="detail-copy">
        <Link href="/products" className="back-link"><ArrowLeft size={14} /> All products</Link>
        <Eyebrow>{product.brand} / {product.category}</Eyebrow>
        <h1 className="serif">{product.name}</h1>
        <p className="detail-note">{product.description}</p>
        <dl className="detail-facts">
          <div><dt>Brand</dt><dd>{product.brand}</dd></div>
          <div><dt>Category</dt><dd>{product.category}</dd></div>
          <div><dt>Size / pack</dt><dd>{product.sizePack}</dd></div>
          <div><dt>Listed ingredients</dt><dd>{product.ingredients.length || '—'}</dd></div>
        </dl>
        {product.ingredients.length > 0 && <>
          <div className="detail-rule" />
          <Eyebrow>INGREDIENTS / FORMULA</Eyebrow>
          <ul className="formula-list">{product.ingredients.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ul>
          <div className="ingredient-links">{product.ingredients.map((item) => <Link key={item} href={`/products/?q=${encodeURIComponent(item)}`} className="ingredient-chip small">{item}<ArrowUpRight size={12} /></Link>)}</div>
        </>}
        {product.highlights.length > 0 && <>
          <div className="detail-rule" />
          <Eyebrow>PACK HIGHLIGHTS</Eyebrow>
          <ul className="highlight-list">{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        </>}
        <p className="information-note">Product information is shown as provided by Dermi Natural Healthcare. For product-specific questions, please contact the company.</p>
        <Link href="/contact" className="button-primary" data-testid="link-product-enquiry">Ask us about this product <ArrowRight size={16} /></Link>
      </div>
    </section>
    {related.length > 0 && <section ref={relatedReveal.ref} className={`related-section page-wrap scroll-reveal${relatedReveal.isVisible ? ' is-visible' : ''}`}><SectionIntro label={`MORE FROM ${product.brand}`} title="Explore the range" link="All products" to="/products" /><div className="product-grid related-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    {zoomed && <Lightbox product={product} index={imageIndex} onClose={() => setZoomed(false)} onStep={step} />}
  </div></Shell>;
}

function BrandPage({ brandSlug }: { brandSlug: string }) {
  const family = families.find((item) => item.slug === brandSlug);
  const familyReveal = useScrollReveal<HTMLElement>();
  const otherReveal = useScrollReveal<HTMLElement>();
  if (!family) return <NotFound />;
  const familyProducts = publishedProducts.filter((product) => product.brand === family.title);
  const familyCategories = categoriesOf(familyProducts);
  const otherFamily = families.find((item) => item.slug !== family.slug);
  return <Shell><div className="page-enter">
    <div className={`family-hero family-hero-${family.slug}`}><div className="family-hero-inner page-wrap"><div><span className="family-mark">{family.mark}</span><Eyebrow>{family.descriptor}</Eyebrow><h1 className="serif">{family.title}</h1><p>{family.intro}</p><Link href="/products" className="button-outline" data-testid={`link-${family.slug}-catalogue`}>Browse all products <ArrowRight size={16} /></Link></div><div className="family-hero-graphic" aria-hidden="true"><span className="family-ring ring-a" /><span className="family-ring ring-b" /><span className="family-watermark">{family.title.slice(0, 1)}</span><span className="family-graphic-caption">A DNH PRODUCT BRAND <i /> {family.mark}</span></div></div></div>
    <div className="family-stats page-wrap">
      <div><b>{String(familyProducts.length).padStart(2, '0')}</b><span>Products in this range</span></div>
      <div><b>{String(familyCategories.length).padStart(2, '0')}</b><span>Categories</span></div>
      <div><b>{family.descriptor}</b><span>Range focus</span></div>
    </div>
    <section ref={familyReveal.ref} className={`family-products page-wrap scroll-reveal${familyReveal.isVisible ? ' is-visible' : ''}`}><div className="family-results-heading"><div><Eyebrow>THE {family.title} COLLECTION</Eyebrow><h2 className="serif">{familyProducts.length.toString().padStart(2, '0')} products</h2></div><p>Product names, pack details and formula information, together in one place.</p></div><div className="product-grid">{familyProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section ref={otherReveal.ref} className={`family-crosslink scroll-reveal${otherReveal.isVisible ? ' is-visible' : ''}`}><div><Eyebrow>DISCOVER MORE</Eyebrow><p>Explore the full Dermi Natural portfolio, or jump straight to our other brand.</p></div><div className="crosslink-actions"><Link className="text-link" href="/products" data-testid="link-family-all-products">View all products <ArrowUpRight size={15} /></Link>{otherFamily && <Link className="button-outline" href={`/${otherFamily.slug}/`}>{otherFamily.title} <ArrowRight size={15} /></Link>}</div></section>
  </div></Shell>;
}

function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [attempted, setAttempted] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const contactReveal = useScrollReveal<HTMLDivElement>();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const errors = { name: !values.name.trim(), email: !emailOk, subject: !values.subject.trim(), message: values.message.trim().length < 12 };
  const valid = !Object.values(errors).some(Boolean);

  const composed = `Name: ${values.name}\nEmail: ${values.email}\nSubject: ${values.subject}\n\n${values.message}`;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAttempted(true); setHandoff(false);
    if (!valid) return;
    const subject = encodeURIComponent(values.subject);
    const body = encodeURIComponent(`Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`);
    window.location.href = `mailto:derminatural@gmail.com?subject=${subject}&body=${body}`;
    setHandoff(true);
  }
  function update(field: keyof typeof values, value: string) { setValues((old) => ({ ...old, [field]: value })); setHandoff(false); }
  return <Shell><div className="page-enter">
    <div className="page-hero contact-hero page-wrap"><div><Eyebrow>CONTACT DERMI NATURAL</Eyebrow><h1 className="serif">A conversation<br /><em>starts here.</em></h1></div><div className="page-hero-side"><span className="page-index">OPEN CHANNEL <i /> DIRECT ENQUIRIES</span><p>For product enquiries or general information, write to us or give us a call.</p></div></div>
    <div ref={contactReveal.ref} className={`contact-layout page-wrap scroll-reveal${contactReveal.isVisible ? ' is-visible' : ''}`}>
      <aside className="contact-details">
        <Eyebrow>REACH OUR TEAM</Eyebrow>
        <h2 className="serif">We’re listening.</h2>
        <p>Choose whichever channel works best for you. We look forward to hearing from you.</p>
        <a href="mailto:derminatural@gmail.com" className="contact-method" data-testid="link-contact-email"><span>EMAIL</span><b>derminatural@gmail.com</b><ArrowUpRight size={16} /></a>
        <a href="tel:9137277233" className="contact-method" data-testid="link-contact-phone"><span>PHONE</span><b>91372 77233</b><ArrowUpRight size={16} /></a>
        <a href={whatsappLink('Hello Dermi Natural team, I have a question about your products.')} className="contact-method" target="_blank" rel="noopener noreferrer" data-testid="link-contact-whatsapp"><span>WHATSAPP</span><b>Message the team</b><ArrowUpRight size={16} /></a>
        <div className="contact-details-foot"><span>DERMI NATURAL HEALTHCARE</span><span>DIRECT ENQUIRIES</span></div>
      </aside>
      <form className="contact-form" onSubmit={submit} noValidate data-testid="form-contact"><div className="form-heading"><span>01 — 04</span><span>YOUR ENQUIRY</span></div>
        <div className="form-row"><label>Your name<input value={values.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" aria-invalid={attempted && errors.name} aria-describedby={attempted && errors.name ? 'err-name' : undefined} placeholder="How should we address you?" data-testid="input-contact-name" />{attempted && errors.name && <small className="field-error" id="err-name">Please enter your name.</small>}</label><label>Email address<input type="email" value={values.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" aria-invalid={attempted && errors.email} aria-describedby={attempted && errors.email ? 'err-email' : undefined} placeholder="you@example.com" data-testid="input-contact-email" />{attempted && errors.email && <small className="field-error" id="err-email">Enter a valid email address.</small>}</label></div>
        <label>Subject<input value={values.subject} onChange={(event) => update('subject', event.target.value)} aria-invalid={attempted && errors.subject} aria-describedby={attempted && errors.subject ? 'err-subject' : undefined} placeholder="What would you like to know?" data-testid="input-contact-subject" />{attempted && errors.subject && <small className="field-error" id="err-subject">Please add a subject.</small>}</label>
        <label>Your message<textarea value={values.message} onChange={(event) => update('message', event.target.value)} rows={5} aria-invalid={attempted && errors.message} aria-describedby={attempted && errors.message ? 'err-message' : 'message-hint'} placeholder="Tell us a little more (at least 12 characters)." data-testid="input-contact-message" />{attempted && errors.message ? <small className="field-error" id="err-message">Please write at least 12 characters.</small> : <small className="field-hint" id="message-hint">Please do not include sensitive medical information.</small>}</label>
        {handoff && <div className="handoff-note" role="status" data-testid="status-mailto-handoff"><Check size={17} /><span>Your email app should open with this message prepared. It has not been sent from this website.</span></div>}
        <div className="form-actions">
          <button className="button-primary form-submit" type="submit" data-testid="button-contact-submit">Prepare email <ArrowUpRight size={16} /></button>
          <a className="button-outline" href={whatsappLink(valid ? composed : 'Hello Dermi Natural team, I have a question about your products.')} target="_blank" rel="noopener noreferrer" data-testid="button-contact-whatsapp"><FaWhatsapp size={16} aria-hidden="true" />Send on WhatsApp</a>
        </div>
        <p className="form-disclaimer">This form prepares a message in your email app. Sending is completed there, not on this website.</p>
      </form>
    </div>
    <div className="contact-quick page-wrap">
      <a href="mailto:derminatural@gmail.com" className="quick-card"><Mail size={18} aria-hidden="true" /><div><b>Email</b><span>derminatural@gmail.com</span></div></a>
      <a href="tel:9137277233" className="quick-card"><Phone size={18} aria-hidden="true" /><div><b>Call</b><span>91372 77233</span></div></a>
      <a href={whatsappLink('Hello Dermi Natural team, I have a question about your products.')} target="_blank" rel="noopener noreferrer" className="quick-card"><FaWhatsapp size={18} aria-hidden="true" /><div><b>WhatsApp</b><span>Start a chat</span></div></a>
    </div>
    <FaqSection label="BEFORE YOU WRITE" title="Quick answers." intro="The most common questions we get, answered up front." />
  </div></Shell>;
}

function NotFound() {
  return <Shell><div className="not-found"><div><Eyebrow>PAGE NOT FOUND</Eyebrow><h1 className="serif">This page isn’t here.</h1><p>Return to the portfolio and continue exploring Dermi Natural.</p><div className="notfound-actions"><Link href="/" className="button-primary">Back to home <ArrowRight size={16} /></Link><Link href="/products" className="button-outline">Browse products</Link></div></div></div></Shell>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/products" component={Products} /><Route path="/products/:slug" component={ProductDetail} />
    <Route path="/gletsy"><BrandPage brandSlug="gletsy" /></Route><Route path="/neutoglow"><BrandPage brandSlug="neutoglow" /></Route>
    <Route path="/contact" component={Contact} /><Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function Metadata() {
  const [location] = useLocation();
  useEffect(() => {
    const page = getPageSeo(location);
    document.title = page.title;
    const setMetaContent = (selector: string, content: string, attribute: 'name' | 'property', key: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, key); document.head.appendChild(tag); }
      tag.content = content;
    };
    setMetaContent('meta[name="description"]', page.description, 'name', 'description');
    setMetaContent('meta[name="robots"]', page.robots, 'name', 'robots');
    setMetaContent('meta[property="og:title"]', page.title, 'property', 'og:title');
    setMetaContent('meta[property="og:description"]', page.description, 'property', 'og:description');
    setMetaContent('meta[property="og:url"]', page.canonicalUrl, 'property', 'og:url');
    setMetaContent('meta[property="og:type"]', page.openGraphType, 'property', 'og:type');
    setMetaContent('meta[property="og:site_name"]', company, 'property', 'og:site_name');
    setMetaContent('meta[property="og:locale"]', 'en_IN', 'property', 'og:locale');
    setMetaContent('meta[property="og:image"]', SOCIAL_IMAGE_URL, 'property', 'og:image');
    setMetaContent('meta[property="og:image:width"]', '1200', 'property', 'og:image:width');
    setMetaContent('meta[property="og:image:height"]', '630', 'property', 'og:image:height');
    setMetaContent('meta[property="og:image:alt"]', 'Dermi Natural Healthcare skincare and wellness product ranges', 'property', 'og:image:alt');
    setMetaContent('meta[name="twitter:card"]', 'summary_large_image', 'name', 'twitter:card');
    setMetaContent('meta[name="twitter:title"]', page.title, 'name', 'twitter:title');
    setMetaContent('meta[name="twitter:description"]', page.description, 'name', 'twitter:description');
    setMetaContent('meta[name="twitter:image"]', SOCIAL_IMAGE_URL, 'name', 'twitter:image');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = page.canonicalUrl;

    const structuredData = getStructuredData(location);
    let structuredDataScript =
      document.querySelector<HTMLScriptElement>(
        'script[type="application/ld+json"][data-site-structured-data]',
      );
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.dataset.siteStructuredData = 'true';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
  }, [location]);
  return null;
}
function App({ ssrPath }: { ssrPath?: RouterProps['ssrPath'] } = {}) {
  useEffect(() => {
    const initialMark = document.getElementById('initial-mark');
    if (!initialMark) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let removalTimer: number | undefined;
    const readyTimer = window.setTimeout(() => {
      initialMark.classList.add('is-leaving');
      if (prefersReducedMotion) {
        initialMark.remove();
        return;
      }
      removalTimer = window.setTimeout(() => initialMark.remove(), 350);
    }, prefersReducedMotion ? 120 : 320);

    return () => {
      window.clearTimeout(readyTimer);
      if (removalTimer !== undefined) window.clearTimeout(removalTimer);
    };
  }, []);

  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
          ssrPath={ssrPath}
          hrefs={formatRouteHref}
          aroundNav={normalizeRouteNavigation}
        >
        <Metadata />
        <Router />
      </WouterRouter>
      <div className="floating-controls">
        <GlowAIChat />
        <WhatsAppButton />
      </div>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
