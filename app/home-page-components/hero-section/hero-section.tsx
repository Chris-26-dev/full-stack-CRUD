"use client";
import HeroSection1 from "@/app/components/hero-section";
import React from "react";
import { SiNextdotjs, SiPostgresql, SiTailwindcss } from "react-icons/si";

function HeroSection() {
  const heroData = {
    badgeText: "New",
    announcementText: "Check out our latest features",
    mainHeading: {
      text: "Supercharge Your Workflow",
      className: "text-primary",
    },
    subHeading: {
      text: "Build modern apps with speed, scalability, and style. From prototype to production, get the tools you need to ship faster, grow confidently, and impress your users.",
    },
    primaryButton: {
      text: "Get Started",
      //   className: "bg-primary text-white",
      onPrimaryButtonClick: () => alert("Primary CTA clicked"),
    },
    secondaryButton: {
      text: "Learn More",
      className: "text-gray-700",
      onSecondaryButtonClick: () => alert("Secondary CTA clicked"),
    },
    techToolsIcons: [
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Postgres", icon: <SiPostgresql /> },
      { name: "TailwindCSS", icon: <SiTailwindcss /> },
    ],
    className: "mt-12",
  };
  return (
    <div>
      <HeroSection1 {...heroData} />
    </div>
  );
}

export default HeroSection;
