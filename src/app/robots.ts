import type { MetadataRoute } from 'next';

/**
 * Robots.txt generator function that complies with the Robots Exclusion Standard.
 * Next.js App Router exposes this as a dynamic /robots.txt route automatically.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.greenhopperevents.in';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/gallery', '/book-event'],
      disallow: [
        '/admin/',       // Exclude admin dashboard and management tools from indexing
        '/api/',         // Exclude API route handlers
        '/file/',        // Exclude secure document download handlers
        '/file-error/',  // Exclude file access error landing pages
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
