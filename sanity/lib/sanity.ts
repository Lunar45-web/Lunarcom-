import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  // Use environment variables for safety, or keep your ID if you prefer
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fbrvmdkd', 
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true, // Set to true for faster delivery of service pages
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) return '';
  return builder.image(source).auto('format').url();
}

// NOTE: We don't need MASTER_QUERY here anymore because our 
// getSalonData function handles the domain-specific logic.