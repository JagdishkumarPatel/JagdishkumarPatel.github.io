/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable Next.js image optimisation (GitHub Pages doesn't support it)
  images: {
    unoptimized: true,
  },
  
  // Ensure URLs end with /
  trailingSlash: true,
}

export default nextConfig;