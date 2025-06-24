/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enzwatlgmbtacjmmdwzm.supabase.co",
        pathname: "/storage/v1/object/public/profile-pictures/**",
      },
    ],
  },
};

export default nextConfig;
