import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your client's live domain
  const baseUrl = 'https://salon45.vercel.app' 

  return [
    {
      url: baseUrl,
      lastModified: new Date(), // Tells Google the site was updated today
      changeFrequency: 'weekly', // How often you expect the content to change
      priority: 1, // 1 is the highest priority (The Homepage)
    },
    
    // --- FOR THE FUTURE ---
    // Remember those individual service slug pages you mentioned earlier? 
    // You can add them to the map manually like this:
    /*
    {
      url: `${baseUrl}/services/braiding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Slightly lower priority than the homepage
    },
    */
  ]
}