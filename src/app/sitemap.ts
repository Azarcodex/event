import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

/**
 * Sitemap generator function that creates the dynamic XML sitemap structure.
 * Next.js App Router exposes this as a dynamic /sitemap.xml route automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.greenhopperevents.in';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-event`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic Event Pages (Fetched from Database)
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    // Fetch only needed fields (id, updatedAt) using projection and lean queries for memory efficiency
    const events = await Event.find({}, '_id updatedAt').lean();

    dynamicPages = events.map((event: any) => ({
      url: `${baseUrl}/events/${event._id}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
