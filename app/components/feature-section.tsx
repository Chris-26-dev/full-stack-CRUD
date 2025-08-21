"use client";

import React from "react";

import { ListChecks, ChartBar, Workflow, AppWindow } from "lucide-react"; // More icons
import { Badge } from "@/components/ui/badge";

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Revolutionary Projectview",
    description:
      "Plan and structure work how you want. Quickly organizing tasks.",
    icon: <ListChecks />,
  },
  {
    title: "App Integrations",
    description:
      "Bring all your tools and data together. Also join with hundreds of other apps.",
    icon: <AppWindow />, // Example of a custom SVG icon
  },
  {
    title: "Data Reporting",
    description:
      "Get real time insight into progress and allows teams to track their work habits.",
    icon: <ChartBar />,
  },
  {
    title: "Workflow Builder",
    description:
      "Automated processes to coordinate your teams and increase communication.",
    icon: <Workflow />,
  },
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center p-6     text-center ">
      <div
        className="w-20 h-20 text-3xl flex items-center justify-center rounded-md 
      bg-primary/5 text-primary mb-4"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className=" opacity-55 text-sm max-sm:px-10">{description}</p>
    </div>
  );
};

interface FeatureSection1Props {
  featureBadge?: { text: string; className?: string };
  mainHeading?: { text: string; className?: string };
  subHeading?: { text: string; className?: string };
  featuresArray?: Feature[];
}

function FeatureSection1({
  featureBadge,
  mainHeading,
  subHeading,
  featuresArray = features,
}: FeatureSection1Props) {
  const {
    text: featureBadgeText = "Explore Our Features",
    className: featureBadgeClassName = "",
  } = featureBadge || {};

  const {
    text: defaultMainHeading = "Unlock Powerful Capabilities",
    className: mainHeadingClassName = "",
  } = mainHeading || {};

  const {
    text: defaultSubHeading = "Discover how our features can help you achieve your goals and streamline your workflow",
    className: subHeadingClassName = "",
  } = subHeading || {};

  // Determine the number of columns for large screens based on item count.
  // We'll generate the appropriate Tailwind class string.
  let lgGridColsClass = "lg:grid-cols-4"; // Default for 4 or more items
  if (featuresArray.length === 1) {
    lgGridColsClass = "lg:grid-cols-1";
  } else if (featuresArray.length === 2) {
    lgGridColsClass = "lg:grid-cols-2";
  } else if (featuresArray.length === 3) {
    lgGridColsClass = "lg:grid-cols-3";
  }

  return (
    <div className="py-12 ">
      <div className="max-w-7xl flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Badge variant={"secondary"} className={`${featureBadgeClassName}`}>
          {featureBadgeText}
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className={`text-3xl max-sm:px-10 font-extrabold   text-center   w-full sm:text-4xl ${mainHeadingClassName}`}
          >
            {defaultMainHeading}
          </h2>
          <p
            className={`mt-3 text-lg max-sm:px-10 max-sm:text-sm opacity-50 ${subHeadingClassName}`}
          >
            {defaultSubHeading}
          </p>
        </div>
        <div
          className={`mt-10 grid grid-cols-1 md:grid-cols-2 ${lgGridColsClass} gap-8`}
        >
          {featuresArray.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureSection1;
