import { useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Droplets, FlaskConical, HeartPulse, Leaf, Pill, Sparkles, Sun, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { brandCounts, catalog, categoriesOf, ingredientsOf, totalIngredientMentions } from '@/lib/catalog';
import { faqItems, type FaqItem } from '@/data/faq';

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

function iconForCategory(name: string) {
  const key = name.toLowerCase();
  if (key.includes('wash')) return Droplets;
  if (key.includes('sunscreen') || key.includes('spf')) return Sun;
  if (key.includes('moistur')) return Waves;
  if (key.includes('soap')) return Leaf;
  if (key.includes('vitamin')) return Pill;
  if (key.includes('nutrition')) return HeartPulse;
  if (key.includes('cream')) return Sparkles;
  if (key.includes('serum') || key.includes('gel')) return FlaskConical;
  return Sparkles;
}

/** Factual summary strip: counts are derived from the catalogue, never invented. */
export function TrustBar() {
  const counts = brandCounts();
  const stats = [
    { value: String(catalog.length).padStart(2, '0'), label: 'Products listed' },
    { value: '02', label: 'Product brands', note: `${counts.GLETSY} GLETSY · ${counts.NEUTOGLOW} NEUTOGLOW` },
    { value: String(totalIngredientMentions()).padStart(2, '0'), label: 'Ingredient entries on packs' },
    { value: '02', label: 'Ways to reach us', note: 'Email · Phone' },
  ];
  return (
    <section className="trust-bar" aria-label="Portfolio at a glance">
      <div className="trust-bar-inner page-wrap">
        {stats.map((stat) => (
          <div className="trust-stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
            {stat.note && <small>{stat.note}</small>}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Category entry points, each one deep-linking into a filtered directory. */
export function CategoryGrid() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const categories = categoriesOf().slice(0, 6);
  return (
    <section ref={ref} id="categories" className={`category-section page-wrap scroll-reveal${isVisible ? ' is-visible' : ''}`} aria-labelledby="category-heading">
      <div className="category-head">
        <div>
          <Eyebrow>START WITH WHAT YOU NEED</Eyebrow>
          <h2 id="category-heading" className="serif">Find your <em>formula.</em></h2>
        </div>
        <p>Pick a category to see every pack that lists it. Each card opens the product page with its pack size and printed ingredients.</p>
      </div>
      <div className="category-grid" role="list">
        {categories.map((category, index) => {
          const Icon = iconForCategory(category.name);
          return (
            <Link
              key={category.slug}
              href={`/products/?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              role="listitem"
              style={{ ['--i' as string]: String(index) }}
              data-testid={`link-category-${category.slug}`}
            >
              <span className="category-icon"><Icon size={19} aria-hidden="true" /></span>
              <b>{category.name}</b>
              <small>{category.count === 1 ? '01 product' : `${String(category.count).padStart(2, '0')} products`}</small>
              <ArrowUpRight size={15} className="category-arrow" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Every ingredient printed on a pack, with a count of how often it appears. */
export function IngredientIndex() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const ingredients = ingredientsOf().slice(0, 12);
  return (
    <section ref={ref} id="ingredients" className={`ingredient-section scroll-reveal${isVisible ? ' is-visible' : ''}`} aria-labelledby="ingredient-heading">
      <div className="ingredient-inner page-wrap">
        <div className="ingredient-intro">
          <Eyebrow>WHAT&rsquo;S INSIDE, IN THE OPEN</Eyebrow>
          <h2 id="ingredient-heading" className="serif">Every ingredient<br /><em>we can print.</em></h2>
          <p>These are the ingredient names listed on the supplied packs and posters, collected in one index so you can jump straight to the products that mention them.</p>
          <Link href="/products/" className="button-outline">Browse the full directory <ArrowRight size={16} /></Link>
        </div>
        <div className="ingredient-cloud" role="list" aria-label="Ingredient index">
          {ingredients.map((ingredient) => (
            <Link
              key={ingredient.name}
              href={`/products/?q=${encodeURIComponent(ingredient.name)}`}
              className="ingredient-chip"
              role="listitem"
              data-testid={`link-ingredient-${ingredient.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              <span>{ingredient.name}</span>
              <b>{ingredient.count}</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Compact accordion FAQ, reused on the home and contact pages. */
export function FaqSection({
  label = 'COMMON QUESTIONS',
  title = 'Answers, before you ask.',
  intro = 'The short version of what this site does and does not cover.',
  items = faqItems,
}: {
  label?: string;
  title?: string;
  intro?: string;
  items?: FaqItem[];
}) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section ref={ref} id="faq" className={`faq-section page-wrap scroll-reveal${isVisible ? ' is-visible' : ''}`} aria-labelledby="faq-heading">
      <div className="faq-head">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 id="faq-heading" className="serif">{title}</h2>
        </div>
        <p>{intro}</p>
      </div>
      <div className="faq-list">
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <article key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
              <h3>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  data-testid={`button-faq-${index}`}
                >
                  <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="faq-text">{item.question}</span>
                  <ChevronDown size={17} aria-hidden="true" className="faq-chevron" />
                </button>
              </h3>
              <div
                className="faq-answer"
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
                hidden={!isOpen}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
