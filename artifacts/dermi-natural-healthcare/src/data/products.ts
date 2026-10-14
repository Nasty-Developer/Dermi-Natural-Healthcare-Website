export type ProductBrand = 'GLETSY' | 'NEUTOGLOW';
export type ProductStatus = 'published' | 'draft';

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  brand: ProductBrand;
  name: string;
  category: string;
  sizePack: string;
  description: string;
  ingredients: string[];
  highlights: string[];
  images: ProductImage[];
  status: ProductStatus;
  displayOrder: number;
  featured?: boolean;
};

const listed = {
  status: 'published' as const,
};

export const products: Product[] = [
  {
    id: 'gletsy-acne-control-face-wash',
    slug: 'gletsy-acne-control-face-wash',
    brand: 'GLETSY',
    name: 'Gletsy Acne Control Face Wash',
    category: 'Face wash',
    sizePack: '100 ml',
    description:
      'A 100 ml face wash. The supplied packaging names acne and acne-prone skin and lists salicylic acid and tea tree oil.',
    ingredients: ['Salicylic Acid', 'Tea Tree Oil'],
    highlights: ['Acne Control', 'For acne-prone skin'],
    images: [
      {
        src: '/products/gletsy-acne-control-face-wash.webp',
        alt: 'Front of the Gletsy Acne Control Face Wash 100 ml box',
      },
      {
        src: '/products/gletsy-acne-control-face-wash-angle.webp',
        alt: 'Angled view of the Gletsy Acne Control Face Wash 100 ml box',
      },
    ],
    ...listed,
    displayOrder: 1,
    featured: true,
  },
  {
    id: 'gletsy-skin-lightening-brightening-cream',
    slug: 'gletsy-skin-lightening-brightening-cream',
    brand: 'GLETSY',
    name: 'Gletsy Skin Lightening & Brightening Cream',
    category: 'Cream',
    sizePack: '30 g',
    description:
      'A 30 g cream. The supplied packaging lists kojic acid dipalmitate, glutathione, and mulberry.',
    ingredients: ['Kojic Acid Dipalmitate', 'Glutathione', 'Mulberry'],
    highlights: ['Skin Lightening & Brightening'],
    images: [
      {
        src: '/products/gletsy-skin-lightening-brightening-cream.webp',
        alt: 'Front of the Gletsy Skin Lightening and Brightening Cream 30 g box',
      },
      {
        src: '/products/gletsy-skin-lightening-brightening-cream-box.webp',
        alt: 'Alternate view of the Gletsy Skin Lightening and Brightening Cream box',
      },
    ],
    ...listed,
    displayOrder: 2,
  },
  {
    id: 'gletsy-oil-free-moisturizer',
    slug: 'gletsy-oil-free-moisturizer',
    brand: 'GLETSY',
    name: 'Gletsy Oil Free Moisturizer',
    category: 'Moisturizer',
    sizePack: '70 g',
    description:
      'A 70 g oil-free moisturizer. The supplied packaging notes hydration, quick absorption, and a non-oily, non-greasy texture.',
    ingredients: [],
    highlights: [
      'Oil free',
      'Intense hydration',
      'Quick absorption',
      'Non-oily, non-greasy texture',
    ],
    images: [
      {
        src: '/products/gletsy-oil-free-moisturizer.webp',
        alt: 'Front of the Gletsy Oil Free Moisturizer 70 g box',
      },
      {
        src: '/products/gletsy-oil-free-moisturizer-box.webp',
        alt: 'Alternate view of the Gletsy Oil Free Moisturizer 70 g box',
      },
    ],
    ...listed,
    displayOrder: 3,
  },
  {
    id: 'gletsy-sunscreen-cream-spf-50',
    slug: 'gletsy-sunscreen-cream-spf-50',
    brand: 'GLETSY',
    name: 'Gletsy Sunscreen Cream SPF 50 PA+++',
    category: 'Sunscreen',
    sizePack: '50 g',
    description:
      'A 50 g sunscreen cream labeled SPF 50 PA+++. The supplied packaging lists UVA/UVB, IR, and blue-light protection.',
    ingredients: [],
    highlights: [
      'SPF 50 PA+++',
      'UVA & UVB protection',
      'IR protection',
      'Blue-light protection',
    ],
    images: [
      {
        src: '/products/gletsy-sunscreen-spf-50-pa-plus-plus-plus.webp',
        alt: 'Front of the Gletsy Sunscreen Cream SPF 50 PA+++ 50 g box',
      },
    ],
    ...listed,
    displayOrder: 4,
  },
  {
    id: 'gletsy-face-wash-skin-brightening',
    slug: 'gletsy-face-wash-skin-brightening',
    brand: 'GLETSY',
    name: 'Gletsy Face Wash – Skin Brightening',
    category: 'Face wash',
    sizePack: '100 ml',
    description:
      'A 100 ml face wash. The supplied packaging names skin brightening and lists kojic acid dipalmitate and glutathione.',
    ingredients: ['Kojic Acid Dipalmitate', 'Glutathione'],
    highlights: ['Skin Brightening'],
    images: [
      {
        src: '/products/gletsy-face-wash-skin-brightening.webp',
        alt: 'Front of the Gletsy Face Wash for Skin Brightening 100 ml box',
      },
    ],
    ...listed,
    displayOrder: 5,
  },
  {
    id: 'neutoglow-vitamin-c-1000-mg',
    slug: 'neutoglow-vitamin-c-1000-mg',
    brand: 'NEUTOGLOW',
    name: 'NeutoGlow 1000 mg Vitamin C Tablet',
    category: 'Vitamin supplement',
    sizePack: '3 × 10 tablets',
    description:
      'A 3 × 10 tablet pack. The supplied packaging lists Vitamin C 1000 mg and Amla Extract.',
    ingredients: ['Vitamin C 1000 mg', 'Amla Extract'],
    highlights: ['Vitamin C 1000 mg'],
    images: [
      {
        src: '/products/neutoglow-vitamin-c-1000mg.webp',
        alt: 'Front of the NeutoGlow 1000 mg Vitamin C Tablet 3 × 10 pack',
      },
    ],
    ...listed,
    displayOrder: 6,
    featured: true,
  },
  {
    id: 'neutoglow-biotin-tablet',
    slug: 'neutoglow-biotin-tablet',
    brand: 'NEUTOGLOW',
    name: 'NeutoGlow Biotin Tablet',
    category: 'Nutritional supplement',
    sizePack: '3 × 10 tablets',
    description:
      'A 3 × 10 tablet pack. The supplied packaging lists biotin, B vitamins, vitamins C, D and E, zinc, and iron.',
    ingredients: [
      'Beta-carotene',
      'Vitamin B1',
      'Vitamin B2',
      'Niacinamide',
      'Calcium Pantothenate',
      'Pantothenic Acid',
      'Biotin',
      'Folic Acid',
      'Vitamin C',
      'Vitamin D',
      'Vitamin E',
      'Zinc',
      'Iron',
    ],
    highlights: ['Biotin'],
    images: [
      {
        src: '/products/neutoglow-biotin-tablet.webp',
        alt: 'Front of the NeutoGlow Biotin Tablet 3 × 10 pack',
      },
    ],
    ...listed,
    displayOrder: 7,
  },
  {
    id: 'neutoglow-l-glutathione-tablet',
    slug: 'neutoglow-l-glutathione-tablet',
    brand: 'NEUTOGLOW',
    name: 'NeutoGlow L-Glutathione Tablet',
    category: 'Nutritional supplement',
    sizePack: '3 × 10 tablets',
    description:
      'A 3 × 10 tablet pack. The supplied packaging lists an L-glutathione complex, NAC, astaxanthin, grape seed extract, licorice, vitamins C and E, and zinc.',
    ingredients: [
      'L-Glutathione Complex',
      'N-Acetyl Cysteine (NAC)',
      'Astaxanthin',
      'Grape Seed Extract',
      'Licorice Extract',
      'Vitamin C',
      'Vitamin E',
      'Zinc',
    ],
    highlights: ['L-Glutathione'],
    images: [
      {
        src: '/products/neutoglow-l-glutathione-tablet.webp',
        alt: 'Front of the NeutoGlow L-Glutathione Tablet 3 × 10 pack',
      },
    ],
    ...listed,
    displayOrder: 8,
    featured: true,
  },
];

export const families: {
  slug: string;
  title: ProductBrand;
  descriptor: string;
  intro: string;
  mark: string;
}[] = [
  {
    slug: 'gletsy',
    title: 'GLETSY',
    descriptor: 'SKINCARE',
    intro: 'Explore the Gletsy skincare range and the product information shown on each pack.',
    mark: '01',
  },
  {
    slug: 'neutoglow',
    title: 'NEUTOGLOW',
    descriptor: 'NUTRITIONAL SUPPLEMENTS',
    intro: 'Explore NeutoGlow supplement packs and the information shown on each pack.',
    mark: '02',
  },
];