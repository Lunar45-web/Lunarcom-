import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false during testing to see changes immediately!
})

export async function getSalonData(domain: string) {
  // REMOVED: The 'emma.co.ke' override. 
  // We want to use the actual domain passed from the browser.
  const searchDomain = domain;

  const query = `
    *[_type == "salon" && domain == $searchDomain][0] {
      _id,
      name,
      slug,
      domain,
      primaryColor,
      secondaryColor,
      tagline,
      heroImage,
      heroVideo,
      whatsapp,
      location,
      workingHours,
      "services": *[_type == "service" && salon._ref == ^._id && isActive == true],
      "about": *[_type == "about" && salon._ref == ^._id][0],
      "gallery": *[_type == "gallery" && salon._ref == ^._id && isActive == true] | order(order asc),
      "faqs": *[_type == "faq" && salon._ref == ^._id],
      "reviews": *[_type == "review" && salon._ref == ^._id && status == 'approved'] | order(reviewDate desc)
    }
  `;

  return await client.fetch(query, { searchDomain });
}