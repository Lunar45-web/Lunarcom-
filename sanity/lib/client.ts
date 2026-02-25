import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Keep this true for fast public data delivery
})

// --- NEW: THE MULTI-TENANT ENGINE ---
export async function getSalonData(domain: string) {
  // If you are testing locally (localhost:3000), default to a live test domain
  // Change 'emma.co.ke' to whatever domain you use for your first test salon
  const searchDomain = domain.includes('localhost') ? 'emma.co.ke' : domain;

  // This GROQ query is pure magic. It finds the salon by domain, 
  // and then uses that salon's `_id` to grab all its related content instantly.
  const query = `
    *[_type == "salon" && domain == $searchDomain][0] {
      _id,
      name,
      slug,
      domain,
      premium,
      primaryColor,
      secondaryColor,
      tagline,
      heroImage,
      heroVideo,
      whatsapp,
      location,
      mapQuery,
      googleMapsUrl,
      workingHours,
      socialLinks,
      
      // 1. Fetch only active services for THIS salon
      "services": *[_type == "service" && salon._ref == ^._id && isActive == true],
      
      // 2. Fetch the About section for THIS salon
      "about": *[_type == "about" && salon._ref == ^._id][0],
      
      // 3. Fetch active Gallery items for THIS salon, ordered perfectly
      "gallery": *[_type == "gallery" && salon._ref == ^._id && isActive == true] | order(order asc),
      
      // 4. Fetch FAQs for THIS salon
      "faqs": *[_type == "faq" && salon._ref == ^._id],
      
      // 5. Fetch only APPROVED reviews for THIS salon, newest first
      "reviews": *[_type == "review" && salon._ref == ^._id && status == 'approved'] | order(reviewDate desc)
    }
  `;

  // Fetch the data from Sanity using the domain variable
  const salonData = await client.fetch(query, { searchDomain });

  return salonData;
}