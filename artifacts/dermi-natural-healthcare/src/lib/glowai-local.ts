import { products, type Product } from '@/data/products';

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'about', 'can', 'do', 'does', 'for', 'find', 'give',
  'hello', 'help', 'hey', 'hi', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of',
  'on', 'please', 'product', 'products', 'recommend', 'show', 'some', 'suggest',
  'tell', 'that', 'the', 'this', 'to', 'use', 'what', 'which', 'with', 'you',
]);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const catalog = products.filter((product) => product.status === 'published');

function contactHint() {
  return 'Tap the green WhatsApp button on this page, email derminatural@gmail.com, or call 91372 77233.';
}

function searchableText(product: Product) {
  return normalize([
    product.name,
    product.brand,
    product.category,
    product.sizePack,
    product.description,
    ...product.ingredients,
    ...product.highlights,
  ].join(' '));
}

function rankProducts(query: string) {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(' ').filter((token) => token.length > 2 && !stopWords.has(token));

  return catalog
    .map((product) => {
      const name = normalize(product.name);
      const brand = normalize(product.brand);
      const category = normalize(product.category);
      const text = searchableText(product);
      let score = 0;

      if (name && normalizedQuery.includes(name)) score += 12;
      if (brand && normalizedQuery.includes(brand)) score += 8;
      if (category && normalizedQuery.includes(category)) score += 6;
      for (const token of tokens) {
        if (text.includes(token)) score += 1;
      }

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.displayOrder - b.product.displayOrder)
    .map(({ product }) => product);
}

function formatProduct(product: Product, includeIngredients = false) {
  const details = [`${product.name} (${product.brand})`, `${product.category}`, `${product.sizePack}`];
  if (product.description) details.push(product.description);
  if (includeIngredients) {
    details.push(product.ingredients.length
      ? `Listed ingredients: ${product.ingredients.join(', ')}.`
      : 'The website does not list ingredients for this product.');
  } else if (product.ingredients.length) {
    details.push(`Listed ingredients: ${product.ingredients.join(', ')}.`);
  }
  if (!includeIngredients && product.highlights.length) {
    details.push(`Pack details: ${product.highlights.join(', ')}.`);
  }
  return details.join(' — ');
}

function listProducts(items: Product[], includeIngredients = false) {
  return items.map((product) => formatProduct(product, includeIngredients)).join(' • ');
}

function listProductNames(items: Product[]) {
  return items.map((product) => `${product.name} (${product.brand}, ${product.sizePack})`).join(' • ');
}

function isIngredientQuestion(query: string) {
  const normalizedQuery = normalize(query);
  const asksAboutIngredients = /\b(ingredient|ingredients|formula|contain|contains|what is in|what s in|made of)\b/.test(normalizedQuery);
  const mentionsKnownIngredient = catalog.some((product) =>
    product.ingredients.some((ingredient) => {
      const normalizedIngredient = normalize(ingredient);
      return normalizedIngredient.length > 2 && normalizedQuery.includes(normalizedIngredient);
    }),
  );
  return asksAboutIngredients || mentionsKnownIngredient;
}

export function getGlowAIResponse(message: string) {
  const query = normalize(message);
  if (!query) return 'Please type a product name, brand, category, or ingredient and I’ll look it up in the catalog.';

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste)$/.test(query)) {
    return 'Hello! I can help you find products and share the names, sizes, and ingredients listed on this website. What would you like to know?';
  }

  if (/\b(cure|treat|heal|diagnos|side effect|pregnan|breastfeed|medical advice|dosage|dose|drug interaction|safe for me)\b/.test(query)) {
    return 'I can share product information listed on this site, but I can’t diagnose conditions or advise on treatment, safety, or dosage. Please check the product label and consult a qualified healthcare professional.';
  }

  const asksRoutineOrder = /\b(in what order|what order.*(apply|use|layer)|routine.*order)\b/.test(query);
  if (!asksRoutineOrder && /\b(shipping|delivery|return|refund|order|orders|track|tracking|purchase|checkout|price|prices|cost|buy|where to buy)\b/.test(query)) {
    return `The website doesn’t provide shipping, returns, order tracking, or price details, so I don’t want to guess. ${contactHint()}`;
  }

  if (/\b(contact|phone|email|whatsapp|human|representative|customer service|support)\b/.test(query)) {
    return `You can reach Dermi Natural Healthcare by WhatsApp, email, or phone. ${contactHint()}`;
  }

  if (/\b(how to use|how do i use|usage|how should i apply|apply this|morning routine|night routine|skincare routine|skin care routine|routine|in what order|what order.*(apply|use|layer))\b/.test(query)) {
    return 'This website doesn’t list product-use instructions or a personalized skincare routine. Please follow the directions on the product packaging; for routine or skin-specific advice, consult a qualified professional. I can still help you find products by category or ingredient.';
  }

  if (/\b(category|categories|product type|product types)\b/.test(query)) {
    const categories = [...new Set(catalog.map((product) => product.category))];
    return `The catalog lists these product categories: ${categories.join(', ')}. Ask me for a category to see matching items.`;
  }

  if (isIngredientQuestion(message)) {
    const matches = rankProducts(message);
    if (matches.length) {
      return `Here are the ingredient details listed on the website: ${listProducts(matches.slice(0, 4), true)} The site lists ingredients but doesn’t describe their effects or suitability.`;
    }
    const withIngredients = catalog.filter((product) => product.ingredients.length > 0);
    return `I can share ingredient lists shown on the website, but not medical effects or suitability. Listed ingredients by product: ${withIngredients.map((product) => `${product.name} (${product.brand}): ${product.ingredients.join(', ')}`).join(' • ')}`;
  }

  if (/\b(what is dermi|about dermi|about the company|who are you|what is gletsy|what is neutoglow)\b/.test(query)) {
    if (query.includes('gletsy')) {
      const items = catalog.filter((product) => product.brand === 'GLETSY');
      return `GLETSY is the skincare brand listed by Dermi Natural Healthcare. The catalog includes: ${listProductNames(items)}`;
    }
    if (query.includes('neutoglow')) {
      const items = catalog.filter((product) => product.brand === 'NEUTOGLOW');
      return `NEUTOGLOW is the nutritional supplement brand listed by Dermi Natural Healthcare. The catalog includes: ${listProductNames(items)}`;
    }
    return 'Dermi Natural Healthcare Pvt Ltd is a healthcare and wellness company with two product brands: GLETSY skincare and NEUTOGLOW nutritional supplements.';
  }

  if (/\b(all products|product catalog|browse products|show products|list products|what products)\b/.test(query)) {
    return `The catalog currently lists: ${listProductNames(catalog)}`;
  }

  const matches = rankProducts(message);
  if (matches.length) {
    const isCategoryOrDiscoveryQuery = /\b(recommend|suggest|looking for|find|show me|acne|brightening|sunscreen|face wash|facewash|moisturizer|moisturiser|soap|cream|vitamin|supplement)\b/.test(query);
    const items = matches.slice(0, 4);
    return `${isCategoryOrDiscoveryQuery ? 'Here are matching catalog items' : 'Here is the matching catalog information'}: ${listProducts(items)} Product details are shown as listed by Dermi Natural Healthcare.`;
  }

  if (/\b(find|recommend|suggest|product|catalog|skincare|skin care)\b/.test(query)) {
    return 'Tell me a brand, product type, or listed ingredient and I’ll search the catalog. Categories include face wash, cream, moisturizer, sunscreen, soap, and nutritional supplements.';
  }

  return `I can answer from the product information listed on this website, but I didn’t find a match for that question. ${contactHint()}`;
}
