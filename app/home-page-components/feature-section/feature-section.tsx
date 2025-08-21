import React from "react";

import { Cloud, ShieldCheck, Zap, LineChart } from "lucide-react";
import FeatureSection1, { Feature } from "@/app/components/feature-section";

function FeatureSection() {
  // 🔹 Mock data to pass into FeatureSection1
  const mockFeatureSectionData = {
    featureBadge: {
      text: "Why Choose Us?",
      className: "bg-primary/10 text-primary px-3 py-1",
    },
    mainHeading: {
      text: "Everything you need to scale your business",
      className: "text-gray-900",
    },
    subHeading: {
      text: "From lightning-fast performance to enterprise-grade security, our platform is built to help teams move faster and smarter.",
      className: "text-gray-500",
    },
    featuresArray: [
      {
        title: "Blazing Fast Performance",
        description:
          "Experience instant load times and real-time updates that keep your workflow smooth and uninterrupted.",
        icon: <Zap />,
      },
      {
        title: "Enterprise-Grade Security",
        description:
          "Your data is protected with top-tier encryption and compliance with global security standards.",
        icon: <ShieldCheck />,
      },
      {
        title: "Scalable Cloud Infrastructure",
        description:
          "Scale effortlessly as your business grows with our robust and reliable cloud-based architecture.",
        icon: <Cloud />,
      },
      {
        title: "Actionable Insights",
        description:
          "Track performance and gain valuable insights with powerful analytics and custom reporting.",
        icon: <LineChart />,
      },
    ] satisfies Feature[],
  };
  return (
    <main>
      <FeatureSection1
        featureBadge={mockFeatureSectionData.featureBadge}
        mainHeading={mockFeatureSectionData.mainHeading}
        subHeading={mockFeatureSectionData.subHeading}
        featuresArray={mockFeatureSectionData.featuresArray}
      />
    </main>
  );
}

export default FeatureSection;
