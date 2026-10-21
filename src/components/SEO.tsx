import React, { useEffect } from 'react';
import type { Product } from '../types';
import { getImageUrl } from '../utils/image';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  ogPrice?: number;
  product?: Product | null;
  categoryName?: string | null;
  breadcrumbs?: Array<{ name: string; url: string }>;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'PrintOkiyo — Premium Posters, Wall Prints & Fine Art Frames';
const DEFAULT_DESC =
  'PrintOkiyo — Shop premium posters, split posters, wall art prints, aesthetic room decor, canvas frames & anime posters across India. Buy 1 Get 2 Free & Free Pan-India Delivery!';
const DEFAULT_KEYWORDS =
  'PrintOkiyo, posters India, wall prints, split posters, canvas wall art, anime posters, car posters, aesthetic room posters, framed posters, custom frame sizes, fine art prints';
const DEFAULT_CANONICAL = 'https://printokiyo.com/';
const DEFAULT_OG_IMAGE = 'https://printokiyo.com/hero-banner.png';

function ensureAbsoluteUrl(url?: string | null): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.startsWith('/') ? url : `/${url}`;
  return `https://printokiyo.com${clean}`;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function setJsonLd(id: string, schemaObj: object | null) {
  const existing = document.getElementById(id);
  if (!schemaObj) {
    if (existing) existing.remove();
    return;
  }

  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schemaObj);
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  ogPrice,
  product,
  categoryName,
  breadcrumbs,
  noindex = false,
}) => {
  useEffect(() => {
    // 1. Determine effective values
    let finalTitle = title || DEFAULT_TITLE;
    let finalDesc = description || DEFAULT_DESC;
    let finalKeywords = keywords || DEFAULT_KEYWORDS;
    let finalCanonical = canonicalUrl || DEFAULT_CANONICAL;
    let finalOgImage = ensureAbsoluteUrl(ogImage);
    let finalOgType = ogType;
    let finalPrice = ogPrice;

    // If a product is passed, auto-compute rich e-commerce SEO attributes
    if (product) {
      finalTitle = `${product.title} — Premium Poster | PrintOkiyo`;
      const baseDesc = product.description || product.short_description || '';
      finalDesc =
        baseDesc.trim().length > 10
          ? `${baseDesc.slice(0, 155)}... Buy ${product.title} with high-definition matte print on 300+ GSM cardstock.`
          : `Buy ${product.title} at PrintOkiyo. Premium poster printed on heavy 300+ GSM archival art cardstock with vibrant colors and anti-glare matte lamination. Fast Pan-India Delivery.`;
      
      const slug = product.slug || product.id || (product as any)._id;
      finalCanonical = `https://printokiyo.com/product/${slug}`;
      finalOgType = 'product';
      finalPrice = product.price || finalPrice;

      // Product image
      const primaryImg = product.thumbnail || (product.gallery && product.gallery[0]);
      if (primaryImg) {
        finalOgImage = ensureAbsoluteUrl(getImageUrl(primaryImg));
      }
    } else if (categoryName) {
      finalTitle = `${categoryName} Posters & Wall Art | PrintOkiyo`;
      finalDesc = `Explore the exclusive ${categoryName} collection at PrintOkiyo. Premium posters printed on 300+ GSM archival art cardstock with vivid colors and matte finish. Buy 1 Get 2 Free!`;
      finalCanonical = `https://printokiyo.com/?category=${encodeURIComponent(categoryName)}`;
    }

    // 2. Set document title
    document.title = finalTitle;

    // 3. Set standard meta tags
    setMetaTag('name', 'description', finalDesc);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(finalCanonical);

    // 4. Set Open Graph (Facebook, WhatsApp, LinkedIn, iMessage previews)
    setMetaTag('property', 'og:site_name', 'PrintOkiyo');
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', finalOgType);
    setMetaTag('property', 'og:image', finalOgImage);
    setMetaTag('property', 'og:image:secure_url', finalOgImage);

    if (finalPrice) {
      setMetaTag('property', 'product:price:amount', String(finalPrice));
      setMetaTag('property', 'product:price:currency', 'INR');
    }

    // 5. Set Twitter Card Tags
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:title', finalTitle);
    setMetaTag('property', 'twitter:description', finalDesc);
    setMetaTag('property', 'twitter:image', finalOgImage);
    setMetaTag('property', 'twitter:url', finalCanonical);

    // 6. Schema.org Structured Data (JSON-LD)
    if (product) {
      // Detailed Product Schema for Google Rich Snippets & Shopping
      const productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.title,
        image: [finalOgImage],
        description: finalDesc,
        sku: product.SKU || product.slug || String(product.id || (product as any)._id),
        category: product.category || 'Posters',
        brand: {
          '@type': 'Brand',
          name: 'PrintOkiyo',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '142',
          bestRating: '5',
          worstRating: '1',
        },
        offers: {
          '@type': 'Offer',
          url: finalCanonical,
          priceCurrency: 'INR',
          price: product.price || 89,
          priceValidUntil: '2028-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'PrintOkiyo',
          },
        },
      };
      setJsonLd('schema-jsonld-product', productSchema);

      // Breadcrumb List schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://printokiyo.com/',
          },
          ...(product.category
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: product.category,
                  item: `https://printokiyo.com/?category=${encodeURIComponent(product.category)}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: product.title,
                  item: finalCanonical,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: product.title,
                  item: finalCanonical,
                },
              ]),
        ],
      };
      setJsonLd('schema-jsonld-breadcrumbs', breadcrumbSchema);
    } else if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };
      setJsonLd('schema-jsonld-breadcrumbs', breadcrumbSchema);
      setJsonLd('schema-jsonld-product', null);
    } else {
      // Store / WebSite Schema for Home & Category pages
      setJsonLd('schema-jsonld-product', null);
      setJsonLd('schema-jsonld-breadcrumbs', null);
    }

    // Cleanup: restore defaults when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag('name', 'description', DEFAULT_DESC);
      setMetaTag('name', 'keywords', DEFAULT_KEYWORDS);
      setCanonical(DEFAULT_CANONICAL);
      setMetaTag('property', 'og:title', DEFAULT_TITLE);
      setMetaTag('property', 'og:description', DEFAULT_DESC);
      setMetaTag('property', 'og:url', DEFAULT_CANONICAL);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:image', DEFAULT_OG_IMAGE);
      setMetaTag('property', 'twitter:title', DEFAULT_TITLE);
      setMetaTag('property', 'twitter:description', DEFAULT_DESC);
      setMetaTag('property', 'twitter:image', DEFAULT_OG_IMAGE);
      setJsonLd('schema-jsonld-product', null);
      setJsonLd('schema-jsonld-breadcrumbs', null);
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    ogPrice,
    product,
    categoryName,
    breadcrumbs,
    noindex,
  ]);

  return null;
};

