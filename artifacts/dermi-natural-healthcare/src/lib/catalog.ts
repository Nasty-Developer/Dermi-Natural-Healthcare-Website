import { families, products, type Product, type ProductBrand } from '@/data/products';

/** Every published product, ordered as supplied by the company. */
export const catalog: Product[] = [...products]
  .filter((product) => product.status === 'published')
  .sort((a, b) => a.displayOrder - b.displayOrder);

export type CategoryBucket = {
  name: string;
  count: number;
  slug: string;
};

export type IngredientBucket = {
  name: string;
  count: number;
  slugs: string[];
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoriesOf(list: Product[] = catalog): CategoryBucket[] {
  const buckets = new Map<string, CategoryBucket>();
  list.forEach((product) => {
    const existing = buckets.get(product.category);
    if (existing) existing.count += 1;
    else buckets.set(product.category, { name: product.category, count: 1, slug: slugify(product.category) });
  });
  return [...buckets.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function ingredientsOf(list: Product[] = catalog): IngredientBucket[] {
  const buckets = new Map<string, IngredientBucket>();
  list.forEach((product) => {
    product.ingredients.forEach((raw) => {
      const name = raw.trim();
      if (!name) return;
      const key = name.toLowerCase();
      const existing = buckets.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.slugs.includes(product.slug)) existing.slugs.push(product.slug);
      } else {
        buckets.set(key, { name, count: 1, slugs: [product.slug] });
      }
    });
  });
  return [...buckets.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function brandCounts(list: Product[] = catalog): Record<ProductBrand, number> {
  const counts = { GLETSY: 0, NEUTOGLOW: 0 } as Record<ProductBrand, number>;
  list.forEach((product) => {
    counts[product.brand] += 1;
  });
  return counts;
}

export function totalIngredientMentions(list: Product[] = catalog) {
  return list.reduce((sum, product) => sum + product.ingredients.length, 0);
}

export function brandsOf(): string[] {
  return families.map((family) => family.title);
}

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'az', label: 'Name A–Z' },
  { value: 'za', label: 'Name Z–A' },
  { value: 'brand', label: 'Group by brand' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function sortCatalog(list: Product[], sort: string): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'az':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'za':
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case 'brand':
      return copy.sort((a, b) => a.brand.localeCompare(b.brand) || a.displayOrder - b.displayOrder);
    default:
      return copy.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.displayOrder - b.displayOrder);
  }
}

export function matchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    product.name,
    product.brand,
    product.category,
    product.sizePack,
    product.description,
    ...product.ingredients,
    ...product.highlights,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

export function productBySlug(slug: string | undefined) {
  return catalog.find((product) => product.slug === slug);
}

export function whatsappLink(message: string) {
  return `https://wa.me/919137277233?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(product: Product) {
  return `Hello Dermi Natural team, I would like to ask about ${product.name} (${product.sizePack}, ${product.brand}).`;
}
