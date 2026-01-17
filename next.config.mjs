/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "img.clerk.com",
      "ik.imagekit.io",
      "firebasestorage.googleapis.com" // ✅ Add this line
    ]
  }
};

export default nextConfig;