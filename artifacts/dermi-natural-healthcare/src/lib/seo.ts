import { families, products, type Product } from '@/data/products';

export const SITE_ORIGIN = 'https://www.derminatural.com';
export const SOCIAL_IMAGE_PATH = '/og-dermi-natural-healthcare.png';
export const SOCIAL_IMAGE_URL = new URL(SOCIAL_IMAGE_PATH, SITE_ORIGIN).toString();
const COMPANY_NAME = 'Dermi Natural Healthcare Pvt Ltd';

export type PageSeo = {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  openGraphType: 'website' | 'product';
};

export function normalizeSeoPath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  if (!pathname.startsWith('/')) return `/${pathname}`;
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '') || '/';
}

function productKey(product: Product) {
  return [product.brand, product.name, product.sizePack, product.category]
    .map((part) => part.trim().toLowerCase())
    .join('|');
}

function getCanonicalProduct(product: Product) {
  return products
    .filter((item) => item.status === 'published' && productKey(item) === productKey(product))
    .sort((a, b) => a.displayOrder - b.displayOrder)[0] ?? product;
}

function getUniquePublishedProducts() {
  const seen = new Set<string>();
  return products
    .filter((product) => product.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter((product) => {
      const key = productKey(product);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function productTitle(product: Product, alternateImages: boolean) {
  if (alternateImages) return `${product.name} | Product photos`;
  const titleWithSize = `${product.name} | ${product.sizePack} | ${product.brand}`;
  if (titleWithSize.length <= 65) return titleWithSize;
  return `${product.name} | ${product.brand}`;
}

export function getPageSeo(path: string): PageSeo {
  const normalizedPath = normalizeSeoPath(path);
  const product = normalizedPath.startsWith('/products/')
    ? products.find((item) => item.slug === normalizedPath.slice('/products/'.length) && item.status === 'published')
    : undefined;
  const canonicalProduct = product ? getCanonicalProduct(product) : undefined;
  const alternateProductPage = !!product && canonicalProduct?.slug !== product.slug;
  const family = families.find((item) => normalizedPath === `/${item.slug}`);

  let title: string;
  let description: string;
  let openGraphType: PageSeo['openGraphType'] = 'website';
  let indexable = true;

  if (normalizedPath === '/') {
    title = 'Derminatural Skincare & Wellness | Dermi Natural Healthcare';
    description = 'Discover GLETSY skincare and NEUTOGLOW nutritional supplements from Dermi Natural Healthcare. Browse products, listed ingredients and contact details.';
  } else if (normalizedPath === '/about') {
    title = 'About Dermi Natural Healthcare Pvt Ltd | Derminatural';
    description = "Learn about Dermi Natural Healthcare Pvt Ltd, its GLETSY skincare and NEUTOGLOW supplement brands, and the directors behind the company's product portfolio.";
  } else if (normalizedPath === '/products') {
    title = 'Skincare & Wellness Products | Dermi Natural Healthcare';
    description = 'Explore GLETSY skincare and NEUTOGLOW nutritional supplements by brand, category or listed ingredient. Find pack sizes and product details in one place.';
  } else if (normalizedPath === '/contact') {
    title = 'Contact Dermi Natural Healthcare Pvt Ltd | Derminatural';
    description = 'Contact Dermi Natural Healthcare for product questions or general information. Find direct company contact details and use the enquiry form to get in touch.';
  } else if (product) {
    title = productTitle(product, alternateProductPage);
    description = alternateProductPage
      ? `See promotional product images and packaging details for ${product.name} from Dermi Natural Healthcare.`
      : `Explore ${product.name} from ${product.brand}. View pack size, listed ingredients and product details from Dermi Natural Healthcare.`;
    openGraphType = 'product';
    if (alternateProductPage) indexable = false;
  } else if (family) {
    title = family.title === 'GLETSY'
      ? 'GLETSY Skincare Products | Dermi Natural Healthcare'
      : 'NEUTOGLOW Nutritional Supplements | Dermi Natural Healthcare';
    description = family.title === 'GLETSY'
      ? 'Explore GLETSY skincare products by category, with product sizes and details listed by Dermi Natural Healthcare.'
      : 'Explore NEUTOGLOW nutritional supplements by category, with pack sizes and details listed by Dermi Natural Healthcare.';
  } else {
    title = 'Page not found | Dermi Natural Healthcare';
    description = 'This page could not be found. Explore Dermi Natural Healthcare products or contact the company.';
    indexable = false;
  }

  const canonicalPath = alternateProductPage && canonicalProduct
    ? `/products/${canonicalProduct.slug}`
    : normalizedPath;
  const canonicalRoute = canonicalPath === '/' ? '/' : `${canonicalPath}/`;
  const canonicalUrl = new URL(canonicalRoute, `${SITE_ORIGIN}/`).toString();

  return {
    title,
    description,
    canonicalUrl,
    robots: indexable ? 'index,follow' : 'noindex,follow',
    openGraphType,
  };
}

function getProductSchema(product: Product, canonicalUrl: string) {
  return {
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: product.name,
    description: product.description,
    image: product.images.map((image) => new URL(image.src, `${SITE_ORIGIN}/`).toString()),
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
  };
}

function getItemListSchema(items: Product[], canonicalUrl: string) {
  return {
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#products`,
    itemListElement: items.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: new URL(`/products/${product.slug}/`, `${SITE_ORIGIN}/`).toString(),
      name: product.name,
    })),
  };
}

export function getStructuredData(path: string) {
  const normalizedPath = normalizeSeoPath(path);
  const page = getPageSeo(normalizedPath);
  const product = normalizedPath.startsWith('/products/')
    ? products.find((item) => item.slug === normalizedPath.slice('/products/'.length) && item.status === 'published')
    : undefined;
  const canonicalProduct = product ? getCanonicalProduct(product) : undefined;
  const alternateProductPage = !!product && canonicalProduct?.slug !== product.slug;
  const family = families.find((item) => normalizedPath === `/${item.slug}`);
  const publishedProducts = getUniquePublishedProducts();

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'Dermi Natural Healthcare',
      legalName: COMPANY_NAME,
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/dermi-natural-logo.png', `${SITE_ORIGIN}/`).toString(),
        width: 1600,
        height: 1065,
      },
      email: 'derminatural@gmail.com',
      telephone: '+919137277233',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'general enquiries',
        email: 'derminatural@gmail.com',
        telephone: '+919137277233',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: 'Dermi Natural Healthcare',
      url: SITE_ORIGIN,
      inLanguage: 'en-IN',
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    },
  ];

  if (product && !alternateProductPage) {
    graph.push(getProductSchema(product, page.canonicalUrl));
    const familyName = product.brand;
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${page.canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: new URL('/products/', SITE_ORIGIN).toString() },
        { '@type': 'ListItem', position: 3, name: familyName, item: new URL(`/${familyName.toLowerCase()}/`, SITE_ORIGIN).toString() },
        { '@type': 'ListItem', position: 4, name: product.name, item: page.canonicalUrl },
      ],
    });
  } else if (normalizedPath === '/products') {
    graph.push(getItemListSchema(publishedProducts, page.canonicalUrl));
  } else if (family) {
    graph.push(getItemListSchema(
      publishedProducts.filter((item) => item.brand === family.title),
      page.canonicalUrl,
    ));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function getPrerenderPaths() {
  const staticPaths = ['/', '/about', '/products', '/contact', ...families.map((family) => `/${family.slug}`)];
  const productPaths = products
    .filter((product) => product.status === 'published')
    .map((product) => `/products/${product.slug}`);
  return [...staticPaths, ...productPaths];
}

export function getIndexablePaths() {
  return getPrerenderPaths().filter((path) => getPageSeo(path).robots.startsWith('index'));
}
