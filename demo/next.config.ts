import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // демо живёт в подпапке репозитория лендинга — корень воркспейса свой
  turbopack: { root: __dirname },
  // Демо-стенд не должен индексироваться ни при каких условиях.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
