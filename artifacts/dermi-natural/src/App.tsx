import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link, useParams } from 'wouter';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Menu, Search, X } from 'lucide-react';
import { families, products, type Family, type Product } from '@/data/products';
import officialLogo from '@/assets/brand/official-logo.jpg';

const queryClient = new QueryClient();
const company = 'DERMI NATURAL HEALTHCARE PVT LTD';

function Brand({ dark = false }: { dark?: boolean }) {
  return <Link href="/" className={`brand-lockup ${dark ? 'brand-lockup-dark' : ''}`} data-testid="link-brand-home">
    <img src={officialLogo} alt="Dermi Natural Healthcare monogram and leaf logo" />
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
  const nav = [
    ['/about', 'Our story'], ['/products', 'Products'], ['/contact', 'Contact'],
  ];
  return <header className={`site-header ${compact ? 'is-compact' : ''}`}>
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([href, text]) => <Link key={href} href={href} className={`nav-link ${path === href || (href === '/products' && path.startsWith('/products')) ? 'is-active' : ''}`} data-testid={`link-nav-${text.toLowerCase().replace(' ', '-')}`}>{text}</Link>)}
        <Link href="/contact" className="nav-contact" data-testid="link-nav-enquire">Enquire <ArrowUpRight size={14} /></Link>
      </nav>
      <button className="mobile-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-menu-toggle">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">
      {[['/', 'Home'], ...nav, ['/gletsy', 'Gletsy'], ['/neutoglow', 'Neutoglow'], ['/neutozinc', 'Neutozinc']].map(([href, text]) => <Link key={href} href={href} data-testid={`mobile-nav-${text.toLowerCase()}`}>{text}<ArrowUpRight size={15} /></Link>)}
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand"><Brand dark /><p>Thoughtful healthcare and wellness, with clear product information at the centre.</p></div>
      <div className="footer-column"><span className="eyebrow">EXPLORE</span><Link href="/about">Our story</Link><Link href="/products">All products</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-column"><span className="eyebrow">OUR FAMILIES</span><Link href="/gletsy">Gletsy</Link><Link href="/neutoglow">Neutoglow</Link><Link href="/neutozinc">Neutozinc</Link></div>
      <div className="footer-column"><span className="eyebrow">GET IN TOUCH</span><a href="mailto:derminatural@gmail.com">derminatural@gmail.com</a><a href="tel:9137277233">91372 77233</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {company}</span><span>Privacy, terms and product notices await official company wording.</span><Link href="/contact">Contact us <ArrowUpRight size={13} /></Link></div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

function SectionIntro({ label, title, body, link, to }: { label: string; title: string; body?: string; link?: string; to?: string }) {
  return <div className="section-intro"><div><Eyebrow>{label}</Eyebrow><h2 className="serif">{title}</h2>{body && <p>{body}</p>}</div>{link && to && <Link href={to} className="text-link">{link}<ArrowUpRight size={15} /></Link>}</div>;
}

function ProductArt({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const palette: Record<Family, string> = { Gletsy: 'art-gletsy', Neutoglow: 'art-neutoglow', Neutozinc: 'art-neutozinc' };
  return <div className={`product-art ${palette[product.family]} ${compact ? 'product-art-compact' : ''}`} data-testid={`visual-product-${product.slug}`}>
    <img className={`real-pack-image ${loaded ? 'visible' : ''}`} src={product.image} alt={`${product.name} product pack`} onLoad={() => setLoaded(true)} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
    {!loaded && <>
      <div className="art-coordinate">DNH / {product.family.toUpperCase()}</div>
      <div className="image-placeholder-art" aria-hidden="true">
        <span className="placeholder-orbit placeholder-orbit-outer" />
        <span className="placeholder-orbit placeholder-orbit-inner" />
        <span className="placeholder-leaf placeholder-leaf-one" />
        <span className="placeholder-leaf placeholder-leaf-two" />
        <span className="placeholder-leaf placeholder-leaf-three" />
        <div className="placeholder-message"><span>OFFICIAL PRODUCT IMAGE</span><b>To be added</b></div>
      </div>
      <span className="art-edition">{product.family.toUpperCase()}</span>
    </>}
  </div>;
}

function FamilyPill({ family }: { family: Family }) { return <span className={`family-pill family-${family.toLowerCase()}`}>{family}</span>; }

function ProductCard({ product }: { product: Product }) {
  return <Link href={`/products/${product.slug}`} className="product-card" data-testid={`card-product-${product.slug}`}>
    <ProductArt product={product} compact />
    <div className="product-card-copy"><div className="product-meta"><FamilyPill family={product.family} /><span>{product.category}</span></div><h3>{product.name}</h3><p>{product.ingredients.join(' · ')}</p><span className="card-arrow"><ArrowUpRight size={17} /></span></div>
  </Link>;
}

function FamilyStrip() {
  return <section className="family-strip page-wrap">
    <div className="family-strip-heading"><Eyebrow>THREE DISTINCT FAMILIES</Eyebrow><p>Explore each range</p></div>
    {families.map((family) => <Link key={family.slug} href={`/${family.slug}`} className={`family-tile family-tile-${family.slug}`} data-testid={`link-family-${family.slug}`}><span>{family.mark}</span><div><b>{family.title}</b><small>{family.descriptor}</small></div><ArrowUpRight size={17} /></Link>)}
  </section>;
}

function Home() {
  const featured = products.filter((p) => ['gletsy-glow-soap', 'neutoglow-g600', 'neutozinc-tab'].includes(p.slug));
  return <Shell><div className="page-enter">
    <section className="home-hero">
      <div className="hero-copy"><Eyebrow>HEALTHCARE & WELLNESS</Eyebrow><h1 className="serif">Care, made<br /><em>considerate.</em></h1><p className="hero-lede">A healthcare company with a clear point of view: thoughtful product ranges, and information you can actually find.</p><div className="hero-actions"><Link href="/products" className="button-primary" data-testid="link-hero-products">Explore our products <ArrowRight size={16} /></Link><Link href="/about" className="text-link" data-testid="link-hero-story">Meet Dermi Natural <ArrowUpRight size={15} /></Link></div><div className="hero-note"><span className="note-mark">01</span><span>Independent product information.<br />A considered portfolio.</span></div></div>
       <div className="hero-art botanical-stage" role="img" aria-label="Dermi Natural official leaf and monogram with a botanical illustration">
         <div className="stage-wash" />
         <div className="stage-arc stage-arc-one" />
         <div className="stage-arc stage-arc-two" />
         <span className="stage-kicker">DERMI NATURAL</span>
         <div className="botanical-shadow botanical-shadow-one" />
         <div className="botanical-shadow botanical-shadow-two" />
         <svg className="botanical-branch branch-one" viewBox="0 0 250 390" fill="none" aria-hidden="true">
           <path d="M124 374C116 290 126 212 159 114C172 76 190 44 222 15" stroke="#8b967d" strokeWidth="1.4" />
           <path d="M142 257C94 238 66 207 44 165C83 172 119 198 146 231" fill="#b7bea8" fillOpacity=".72" />
           <path d="M155 195C162 150 188 117 229 91C229 135 208 172 164 205" fill="#c6cbb8" fillOpacity=".8" />
           <path d="M126 312C82 298 53 273 29 235C70 240 105 261 131 290" fill="#d2d4c3" fillOpacity=".9" />
           <path d="M170 145C170 105 183 68 210 37C222 78 209 116 176 151" fill="#b7bea8" fillOpacity=".7" />
           <path d="M142 257L88 209M155 195L203 138M126 312L73 269" stroke="#929d84" strokeWidth="1" />
         </svg>
         <svg className="botanical-branch branch-two" viewBox="0 0 220 320" fill="none" aria-hidden="true">
           <path d="M33 300C70 226 117 151 190 48" stroke="#aa9a6d" strokeWidth="1.2" />
           <path d="M77 228C48 218 30 196 23 163C56 176 75 195 84 216" fill="#d1c69e" fillOpacity=".8" />
           <path d="M121 164C123 129 143 101 178 82C173 116 154 143 127 171" fill="#c6cbb8" fillOpacity=".75" />
           <path d="M150 122L165 101M91 204L54 180" stroke="#a99a71" strokeWidth="1" />
         </svg>
         <div className="logo-presence"><img src={officialLogo} alt="Official Dermi Natural leaf and monogram" /></div>
         <div className="stage-note"><span className="stage-note-rule" /><span>SKINCARE<br />NUTRITIONAL SUPPLEMENTS</span></div>
         <span className="stage-coordinate">DNH&nbsp; / &nbsp;03 FAMILIES</span>
         <span className="stage-orb orb-gold" /><span className="stage-orb orb-ivory" />
       </div>
      <div className="hero-footline"><span>DERMI NATURAL HEALTHCARE PVT LTD</span><span>THOUGHTFUL BY DESIGN <ArrowDownRight size={13} /></span></div>
    </section>
    <FamilyStrip />
    <section className="featured-section page-wrap"><SectionIntro label="A CLOSER LOOK" title="Selected from our ranges" body="Start with a few products across the Dermi Natural portfolio." link="View all products" to="/products" /><div className="product-grid featured-grid">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
    <section className="manifesto"><div className="manifesto-number">01 / 03</div><div className="manifesto-copy"><Eyebrow>A CLEARER WAY TO EXPLORE</Eyebrow><h2 className="serif">Good information<br />belongs <em>up front.</em></h2><p>We believe it should be simple to understand what a product is called, which family it belongs to, and which ingredients are listed. So we put those details where they belong: in the open.</p><Link href="/products" className="button-outline" data-testid="link-manifesto-products">Browse product details <ArrowRight size={16} /></Link></div><div className="manifesto-aside"><span className="big-initial">D</span><span>OUR APPROACH</span><p>Clarity in the details.<br />Care in the presentation.</p></div></section>
    <section className="home-about page-wrap"><div className="about-number">01<span> / ABOUT</span></div><div><Eyebrow>ABOUT DERMI NATURAL</Eyebrow><h2 className="serif">A company focused<br />on <em>everyday care.</em></h2></div><div className="home-about-text"><p>{company} brings together skincare and nutritional supplement ranges under one roof. Our aim here is simple: a thoughtful, clear place to learn about our products and connect with us.</p><Link href="/about" className="text-link" data-testid="link-home-about">More about us <ArrowUpRight size={15} /></Link></div></section>
    <section className="contact-banner"><div><Eyebrow>HAVE A QUESTION?</Eyebrow><h2 className="serif">We’re easy to<br /><em>reach.</em></h2></div><div className="contact-banner-right"><p>For product enquiries or general information, get in touch with our team directly.</p><Link href="/contact" className="button-primary button-gold" data-testid="link-home-contact">Contact Dermi Natural <ArrowRight size={16} /></Link></div><span className="banner-mark">DNH</span></section>
  </div></Shell>;
}

function About() {
  return <Shell><div className="page-enter">
    <div className="page-hero page-wrap"><div><Eyebrow>ABOUT DERMI NATURAL</Eyebrow><h1 className="serif">Care is in the<br /><em>consideration.</em></h1></div><div className="page-hero-side"><span className="page-index">01 <i></i> ABOUT</span><p>A healthcare and wellness company bringing considered product families into one clear, connected portfolio.</p></div></div>
     <div className="about-feature"><div className="about-feature-mark"><img src={officialLogo} alt="Dermi Natural official brand logo" /><span>THE OFFICIAL MARK</span></div><div className="about-feature-copy"><Eyebrow>WHO WE ARE</Eyebrow><h2 className="serif">Introducing<br />{company.toLowerCase()}.</h2><p>Dermi Natural Healthcare is a healthcare and wellness company with three product families: GLETSY, NEUTOGLOW and NEUTOZINC. Each has its own place in the portfolio, from skincare to nutritional supplements.</p><p>This site is designed to make our product information easier to navigate and our company easier to contact.</p></div></div>
    <section className="values-section page-wrap"><SectionIntro label="WHAT GUIDES US" title="Clarity is a form of care." body="The way information is shared matters. We keep the product names and provided ingredient details visible, and avoid making claims beyond them."/><div className="values-list"><article><span>01</span><div><h3>Clear by default</h3><p>Find product names, families and ingredient details without having to search through noise.</p></div><ArrowDownRight /></article><article><span>02</span><div><h3>Thoughtful presentation</h3><p>Distinct ranges, brought together through a consistent and considered company identity.</p></div><ArrowDownRight /></article><article><span>03</span><div><h3>Open conversation</h3><p>Questions and enquiries have a direct route to the people behind Dermi Natural.</p></div><ArrowDownRight /></article></div></section>
    <FamilyStrip />
    <section className="about-cta"><Eyebrow>GET TO KNOW OUR PORTFOLIO</Eyebrow><h2 className="serif">Explore the ranges<br /><em>at your own pace.</em></h2><Link href="/products" className="button-primary" data-testid="link-about-products">Discover products <ArrowRight size={16} /></Link></section>
  </div></Shell>;
}

function Products() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('All');
  const filtered = useMemo(() => products.filter((product) => {
    const q = query.trim().toLowerCase();
    return (!q || [product.name, product.family, product.category, ...product.ingredients].join(' ').toLowerCase().includes(q)) && (family === 'All' || product.family === family);
  }), [query, family]);
  return <Shell><div className="page-enter">
    <div className="products-hero page-wrap"><div><Eyebrow>THE Dermi Natural PORTFOLIO</Eyebrow><h1 className="serif">Products,<br /><em>in focus.</em></h1></div><div className="products-hero-side"><span className="page-index">01 <i></i> PRODUCT DIRECTORY</span><p>Explore skincare and nutritional supplement ranges. Product information is shared as provided by the company.</p><span className="directory-count">{products.length.toString().padStart(2, '0')} <small>PRODUCTS LISTED</small></span></div></div>
    <div className="directory page-wrap"><div className="directory-controls"><label className="search-box"><Search size={17} /><span className="sr-only">Search products</span><input type="search" placeholder="Search products or ingredients" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-product-search" /><kbd>⌕</kbd></label><div className="filter-tabs" role="group" aria-label="Filter products by family">{['All', 'Gletsy', 'Neutoglow', 'Neutozinc'].map((item) => <button key={item} className={family === item ? 'filter-active' : ''} onClick={() => setFamily(item)} type="button" data-testid={`filter-family-${item.toLowerCase()}`}>{item}</button>)}</div></div>
      <div className="results-line"><span>{filtered.length === 1 ? '1 PRODUCT' : `${filtered.length.toString().padStart(2, '0')} PRODUCTS`}</span><span>{family === 'All' ? 'ALL FAMILIES' : family.toUpperCase()}</span></div>
      {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="empty-results"><div className="empty-icon"><Search /></div><h2 className="serif">Nothing in this view.</h2><p>Try another product name, ingredient or family.</p><button type="button" className="text-link" onClick={() => { setQuery(''); setFamily('All'); }} data-testid="button-clear-search">Clear filters <X size={14} /></button></div>}
    </div><FamilyStrip />
  </div></Shell>;
}

function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return <NotFound />;
  const related = products.filter((item) => item.family === product.family && item.slug !== product.slug).slice(0, 3);
  return <Shell><div className="page-enter">
    <div className="breadcrumb page-wrap"><Link href="/products" data-testid="link-back-products">Products</Link><span>/</span><FamilyPill family={product.family} /><span>/</span><span>{product.name}</span></div>
    <section className="detail-layout page-wrap"><div className="detail-art"><ProductArt product={product} /></div><div className="detail-copy"><Link href="/products" className="back-link"><ArrowLeft size={14} /> All products</Link><Eyebrow>{product.family.toUpperCase()} / {product.category.toUpperCase()}</Eyebrow><h1 className="serif">{product.name}</h1><p className="detail-note">{product.description}</p><div className="detail-rule" /><Eyebrow>INGREDIENTS / FORMULA</Eyebrow><ul className="formula-list">{product.ingredients.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ul><p className="information-note">Ingredient information is shown as provided by Dermi Natural Healthcare. For product-specific questions, please contact the company.</p><Link href="/contact" className="button-primary" data-testid="link-product-enquiry">Ask us about this product <ArrowRight size={16} /></Link></div></section>
    {related.length > 0 && <section className="related-section page-wrap"><SectionIntro label={`MORE FROM ${product.family.toUpperCase()}`} title="Explore the range" link="All products" to="/products" /><div className="product-grid related-grid">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></section>}
  </div></Shell>;
}

function FamilyPage({ familySlug }: { familySlug: string }) {
  const family = families.find((item) => item.slug === familySlug);
  if (!family) return <NotFound />;
  const familyProducts = products.filter((product) => product.family.toLowerCase() === family.title.toLowerCase());
  return <Shell><div className="page-enter">
    <div className={`family-hero family-hero-${family.slug}`}><div className="family-hero-inner page-wrap"><div><span className="family-mark">{family.mark}</span><Eyebrow>{family.descriptor}</Eyebrow><h1 className="serif">{family.title}</h1><p>{family.intro}</p><Link href="/products" className="button-outline" data-testid={`link-${family.slug}-catalogue`}>Browse all products <ArrowRight size={16} /></Link></div><div className="family-hero-graphic" aria-hidden="true"><span className="family-ring ring-a" /><span className="family-ring ring-b" /><span className="family-watermark">{family.title.slice(0, 1)}</span><span className="family-graphic-caption">A DNH PRODUCT FAMILY <i /> {family.mark} — 03</span></div></div></div>
    <section className="family-products page-wrap"><div className="family-results-heading"><div><Eyebrow>THE {family.title.toUpperCase()} COLLECTION</Eyebrow><h2 className="serif">{familyProducts.length.toString().padStart(2, '0')} products</h2></div><p>Product names and formula details, together in one place.</p></div><div className="product-grid">{familyProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section>
    <section className="family-crosslink"><Eyebrow>DISCOVER MORE</Eyebrow><p>Explore the full Dermi Natural portfolio.</p><Link className="text-link" href="/products" data-testid="link-family-all-products">View all product families <ArrowUpRight size={15} /></Link></section>
  </div></Shell>;
}

function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [attempted, setAttempted] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const errors = { name: !values.name.trim(), email: !emailOk, subject: !values.subject.trim(), message: values.message.trim().length < 12 };
  const valid = !Object.values(errors).some(Boolean);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAttempted(true); setHandoff(false);
    if (!valid) return;
    const subject = encodeURIComponent(values.subject);
    const body = encodeURIComponent(`Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`);
    window.location.href = `mailto:derminatural@gmail.com?subject=${subject}&body=${body}`;
    setHandoff(true);
  }
  function update(field: keyof typeof values, value: string) { setValues((old) => ({ ...old, [field]: value })); setHandoff(false); }
  return <Shell><div className="page-enter">
     <div className="page-hero contact-hero page-wrap"><div><Eyebrow>CONTACT DERMI NATURAL</Eyebrow><h1 className="serif">A conversation<br /><em>starts here.</em></h1></div><div className="page-hero-side"><span className="page-index">OPEN CHANNEL <i></i> DIRECT ENQUIRIES</span><p>For product enquiries or general information, write to us or give us a call.</p></div></div>
     <div className="contact-layout page-wrap"><aside className="contact-details"><Eyebrow>REACH OUR TEAM</Eyebrow><h2 className="serif">We’re listening.</h2><p>Choose whichever channel works best for you. We look forward to hearing from you.</p><a href="mailto:derminatural@gmail.com" className="contact-method" data-testid="link-contact-email"><span>EMAIL</span><b>derminatural@gmail.com</b><ArrowUpRight size={16} /></a><a href="tel:9137277233" className="contact-method" data-testid="link-contact-phone"><span>PHONE</span><b>91372 77233</b><ArrowUpRight size={16} /></a><div className="contact-details-foot"><span>DERMI NATURAL HEALTHCARE</span><span>DIRECT ENQUIRIES</span></div></aside>
      <form className="contact-form" onSubmit={submit} noValidate data-testid="form-contact"><div className="form-heading"><span>01 — 04</span><span>YOUR ENQUIRY</span></div>
        <div className="form-row"><label>Your name<input value={values.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" aria-invalid={attempted && errors.name} aria-describedby={attempted && errors.name ? 'err-name' : undefined} placeholder="How should we address you?" data-testid="input-contact-name" />{attempted && errors.name && <small className="field-error" id="err-name">Please enter your name.</small>}</label><label>Email address<input type="email" value={values.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" aria-invalid={attempted && errors.email} aria-describedby={attempted && errors.email ? 'err-email' : undefined} placeholder="you@example.com" data-testid="input-contact-email" />{attempted && errors.email && <small className="field-error" id="err-email">Enter a valid email address.</small>}</label></div>
        <label>Subject<input value={values.subject} onChange={(e) => update('subject', e.target.value)} aria-invalid={attempted && errors.subject} aria-describedby={attempted && errors.subject ? 'err-subject' : undefined} placeholder="What would you like to know?" data-testid="input-contact-subject" />{attempted && errors.subject && <small className="field-error" id="err-subject">Please add a subject.</small>}</label>
        <label>Your message<textarea value={values.message} onChange={(e) => update('message', e.target.value)} rows={5} aria-invalid={attempted && errors.message} aria-describedby={attempted && errors.message ? 'err-message' : 'message-hint'} placeholder="Tell us a little more (at least 12 characters)." data-testid="input-contact-message" />{attempted && errors.message ? <small className="field-error" id="err-message">Please write at least 12 characters.</small> : <small className="field-hint" id="message-hint">Please do not include sensitive medical information.</small>}</label>
        {handoff && <div className="handoff-note" role="status" data-testid="status-mailto-handoff"><Check size={17} /><span>Your email app should open with this message prepared. It has not been sent from this website.</span></div>}
        <button className="button-primary form-submit" type="submit" data-testid="button-contact-submit">Prepare email <ArrowUpRight size={16} /></button><p className="form-disclaimer">This form prepares a message in your email app. Sending is completed there, not on this website.</p>
      </form>
    </div>
  </div></Shell>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/products" component={Products} />
    <Route path="/products/:slug" component={ProductDetail} />
    <Route path="/gletsy"><FamilyPage familySlug="gletsy" /></Route>
    <Route path="/neutoglow"><FamilyPage familySlug="neutoglow" /></Route>
    <Route path="/neutozinc"><FamilyPage familySlug="neutozinc" /></Route>
    <Route path="/contact" component={Contact} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Metadata() {
  const [location] = useLocation();
  useEffect(() => {
    const product = location.startsWith('/products/') ? products.find((item) => item.slug === location.split('/').pop()) : undefined;
    const family = families.find((item) => location === `/${item.slug}`);
    const page = location === '/'
      ? { title: 'Dermi Natural Healthcare | Thoughtful care, clearly presented', description: 'Explore the GLETSY, NEUTOGLOW and NEUTOZINC product families from Dermi Natural Healthcare Pvt Ltd.' }
      : location === '/about'
        ? { title: 'About Dermi Natural Healthcare', description: 'Learn about Dermi Natural Healthcare Pvt Ltd and its GLETSY, NEUTOGLOW and NEUTOZINC product families.' }
        : location === '/products'
          ? { title: 'Products | Dermi Natural Healthcare', description: 'Search the Dermi Natural catalog by product name, listed ingredients, or family.' }
          : location === '/contact'
            ? { title: 'Contact | Dermi Natural Healthcare', description: 'Contact Dermi Natural Healthcare Pvt Ltd by email or phone, or prepare an enquiry.' }
            : product
              ? { title: `${product.name} | Dermi Natural Healthcare`, description: `${product.name} from ${product.family}. Listed formula: ${product.ingredients.join(', ')}.` }
              : family
                ? { title: `${family.title} | Dermi Natural Healthcare`, description: `${family.intro} Explore ${family.title} product names and formula details.` }
                : { title: 'Dermi Natural Healthcare', description: 'Explore products from Dermi Natural Healthcare Pvt Ltd.' };
    document.title = page.title;
    const setMetaContent = (selector: string, content: string, attribute: 'name' | 'property', key: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMetaContent('meta[name="description"]', page.description, 'name', 'description');
    setMetaContent('meta[property="og:title"]', page.title, 'property', 'og:title');
    setMetaContent('meta[property="og:description"]', page.description, 'property', 'og:description');
    setMetaContent('meta[property="og:image"]', new URL(officialLogo, window.location.href).toString(), 'property', 'og:image');
    setMetaContent('meta[name="twitter:title"]', page.title, 'name', 'twitter:title');
    setMetaContent('meta[name="twitter:description"]', page.description, 'name', 'twitter:description');
    setMetaContent('meta[name="twitter:image"]', new URL(officialLogo, window.location.href).toString(), 'name', 'twitter:image');
  }, [location]);
  return null;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Metadata /><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;