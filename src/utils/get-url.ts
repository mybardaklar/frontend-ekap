export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  // For client-side logic, we can also check window.location.origin,
  // but usually we want to respect the env vars if set to force a canonical URL.
  // If no env vars are set and we are on client, window.location.origin is a good fallback
  // ONLY if we haven't already defaulted to localhost above (which we did).
  // So let's allow window usage if env logic seems to fail or we want to be dynamic.

  // Actually, for Auth `redirectTo`, dynamic `window.location.origin` is best for Preview URLs
  // *as long as* they are whitelisted.
  // But if the user wants to FORCE production URL, they set NEXT_PUBLIC_SITE_URL.

  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return window.location.origin + '/';
  }

  return url;
};
