import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'fbrvmdkb', // Replace with your ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source).url();
}

// 🔥 MASTER QUERY: Fetches EVERYTHING in one request for speed
export const MASTER_QUERY = `{
  "business": *[_type == "business"][0] {
    ...,
    "heroImageUrl": heroImage.asset->url
  },
  "services": *[_type == "service"] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    shortDescription,
    price,
    duration,
    "imageUrl": mainImage.asset->url
  },
  "testimonials": *[_type == "testimonial"] {
    clientName,
    quote,
    serviceTaken,
    "screenshotUrl": screenshot.asset->url
  },
  "faqs": *[_type == "faq"]
}`;