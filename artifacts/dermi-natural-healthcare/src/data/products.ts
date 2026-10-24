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
  packagingOrientation: 'portrait' | 'landscape';
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
    packagingOrientation: 'portrait',
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
    packagingOrientation: 'portrait',
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
    packagingOrientation: 'portrait',
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
    packagingOrientation: 'portrait',
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
    packagingOrientation: 'portrait',
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
    packagingOrientation: 'landscape',
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
    packagingOrientation: 'landscape',
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
    packagingOrientation: 'landscape',
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
  {
    id: 'gletsy-glow-soap',
    slug: 'gletsy-glow-soap',
    brand: 'GLETSY',
    name: 'Gletsy Glow Soap',
    category: 'Soap',
    packagingOrientation: 'landscape',
    sizePack: '75 g',
    description:
      'A 75 g face and body soap. The supplied packaging lists glutathione, kojic acid dipalmitate, and vitamin E.',
    ingredients: ['Glutathione', 'Kojic Acid Dipalmitate', 'Vitamin E'],
    highlights: ['Face & body', '75 g'],
    images: [
      {
        src: '/products/gletsy-glow-soap-front.png',
        alt: 'Front of the Gletsy Glow Soap 75 g box',
      },
      {
        src: '/products/gletsy-glow-soap-back.png',
        alt: 'Ingredients, directions, and package information on the Gletsy Glow Soap box',
      },
    ],
    ...listed,
    displayOrder: 9,
  },
  {
    id: 'gletsy-acne-control-face-wash-new',
    slug: 'gletsy-acne-control-face-wash-new',
    brand: 'GLETSY',
    name: 'Gletsy Acne Control Face Wash',
    category: 'Face wash',
    packagingOrientation: 'portrait',
    sizePack: '100 ml',
    description:
      'An acne-control face wash. The supplied promotional images show salicylic acid and tea tree oil.',
    ingredients: ['Salicylic Acid', 'Tea Tree Oil'],
    highlights: ['Acne control', 'Salicylic acid', 'Tea tree oil'],
    images: [
      {
        src: '/products/gletsy-acne-control-face-wash-box-photo.jpeg',
        alt: 'Gletsy Acne Control Face Wash 100 ml box in a product setting',
      },
      {
        src: '/products/gletsy-acne-control-face-wash-tube-promo.jpeg',
        alt: 'Gletsy Acne Control Face Wash tube and formula information',
      },
      {
        src: '/products/gletsy-acne-control-face-wash-poster.jpeg',
        alt: 'Gletsy Acne Control Face Wash promotional poster',
      },
    ],
    ...listed,
    displayOrder: 10,
  },
  {
    id: 'gletsy-skin-lightening-brightening-cream-new',
    slug: 'gletsy-skin-lightening-brightening-cream-new',
    brand: 'GLETSY',
    name: 'Gletsy Skin Lightening & Brightening Cream',
    category: 'Cream',
    packagingOrientation: 'portrait',
    sizePack: '30 g',
    description:
      'A skin lightening and brightening cream. The supplied packaging lists kojic acid dipalmitate and glutathione.',
    ingredients: ['Kojic Acid Dipalmitate', 'Glutathione'],
    highlights: ['Skin lightening', 'Skin brightening'],
    images: [
      {
        src: '/products/gletsy-skin-lightening-brightening-cream-front-photo.jpeg',
        alt: 'Gletsy Skin Lightening and Brightening Cream package',
      },
      {
        src: '/products/gletsy-skin-lightening-brightening-cream-tube-promo.jpeg',
        alt: 'Gletsy Skin Lightening and Brightening Cream tube and product details',
      },
      {
        src: '/products/gletsy-skin-lightening-brightening-cream-poster.jpeg',
        alt: 'Gletsy Skin Lightening and Brightening Cream product information poster',
      },
    ],
    ...listed,
    displayOrder: 11,
  },
  {
    id: 'gletsy-oil-free-moisturizer-new',
    slug: 'gletsy-oil-free-moisturizer-new',
    brand: 'GLETSY',
    name: 'Gletsy Oil Free Moisturizer',
    category: 'Moisturizer',
    packagingOrientation: 'portrait',
    sizePack: '70 g',
    description:
      'An oil-free moisturizer. The supplied promotional images describe lightweight, fast-absorbing hydration.',
    ingredients: ['Lemon Fruit Extract', 'Centella', 'Willow Bark Extract', 'Cica Extract'],
    highlights: ['Lightweight', 'Fast absorbing', 'Oil free'],
    images: [
      {
        src: '/products/gletsy-oil-free-moisturizer-box-photo.jpeg',
        alt: 'Gletsy Oil Free Moisturizer box in a product setting',
      },
      {
        src: '/products/gletsy-oil-free-moisturizer-tube-promo.jpeg',
        alt: 'Gletsy Oil Free Moisturizer tube and product details',
      },
      {
        src: '/products/gletsy-oil-free-moisturizer-poster.jpeg',
        alt: 'Gletsy Oil Free Moisturizer product information poster',
      },
    ],
    ...listed,
    displayOrder: 12,
  },
  {
    id: 'gletsy-invisible-matte-gel-sunscreen-spf-50',
    slug: 'gletsy-invisible-matte-gel-sunscreen-spf-50',
    brand: 'GLETSY',
    name: 'Gletsy Invisible Matte Gel Sunscreen SPF 50 PA+++',
    category: 'Sunscreen',
    packagingOrientation: 'portrait',
    sizePack: '50 g',
    description:
      'A 50 g invisible matte gel sunscreen labeled SPF 50 PA+++. The packaging describes broad-spectrum UVA and UVB protection.',
    ingredients: ['Alpha Arbutin', 'Niacinamide', 'D-Panthenol'],
    highlights: ['SPF 50 PA+++', 'Invisible matte gel', 'UVA & UVB protection'],
    images: [
      {
        src: '/products/gletsy-sunscreen-spf-50-package-front.png',
        alt: 'Front panel of the Gletsy SPF 50 sunscreen package',
      },
      {
        src: '/products/gletsy-sunscreen-spf-50-promo.jpeg',
        alt: 'Gletsy SPF 50 sunscreen promotional image',
      },
      {
        src: '/products/gletsy-sunscreen-spf-50-package-back.png',
        alt: 'Benefits, ingredients, and directions panel on the Gletsy SPF 50 sunscreen package',
      },
    ],
    ...listed,
    displayOrder: 13,
  },
  {
    id: 'gletsy-skin-whitening-face-wash-new',
    slug: 'gletsy-skin-whitening-face-wash-new',
    brand: 'GLETSY',
    name: 'Gletsy Skin Whitening Face Wash',
    category: 'Face wash',
    packagingOrientation: 'landscape',
    sizePack: '100 ml',
    description:
      'A Gletsy face wash shown in the supplied skin-whitening product poster.',
    ingredients: [],
    highlights: ['Skin whitening'],
    images: [
      {
        src: '/products/gletsy-face-wash-skin-brightening-poster.jpeg',
        alt: 'Gletsy Skin Whitening Face Wash promotional poster',
      },
    ],
    ...listed,
    displayOrder: 14,
  },
  {
    id: 'neutoglow-vitamin-c-1000-mg-new',
    slug: 'neutoglow-vitamin-c-1000-mg-new',
    brand: 'NEUTOGLOW',
    name: 'NeutoGlow 1000 mg Vitamin C Tablet',
    category: 'Vitamin supplement',
    packagingOrientation: 'landscape',
    sizePack: '3 × 10 tablets',
    description:
      'A NeutoGlow vitamin C supplement. The supplied poster lists Vitamin C 1000 mg and Amla Extract.',
    ingredients: ['Vitamin C 1000 mg', 'Amla Extract'],
    highlights: ['Vitamin C 1000 mg'],
    images: [
      {
        src: '/products/neutoglow-vitamin-c-poster.jpeg',
        alt: 'NeutoGlow Vitamin C 1000 mg tablet product information poster',
      },
    ],
    ...listed,
    displayOrder: 15,
  },
  {
    id: 'neutoglow-biotin-tablet-new',
    slug: 'neutoglow-biotin-tablet-new',
    brand: 'NEUTOGLOW',
    name: 'NeutoGlow Biotin Tablet',
    category: 'Nutritional supplement',
    packagingOrientation: 'landscape',
    sizePack: '3 × 10 tablets',
    description:
      'A NeutoGlow biotin supplement. The supplied poster lists biotin and supporting vitamins and minerals.',
    ingredients: ['Biotin', 'Vitamins', 'Zinc', 'Iron'],
    highlights: ['Biotin'],
    images: [
      {
        src: '/products/neutoglow-biotin-poster.jpeg',
        alt: 'NeutoGlow Biotin tablet product information poster',
      },
    ],
    ...listed,
    displayOrder: 16,
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