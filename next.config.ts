import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "khqmbphkdmexkknzvtgb.supabase.co",
            },
        ],
    },
};

export default nextConfig;
