import React, { ReactElement, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  className?: string;
  badgeText?: string;
  announcementText?: string;

  mainHeading?: { text?: string; className?: string };
  subHeading?: { text?: string; className?: string };
  primaryButton: {
    text: string;
    className?: string;
    onPrimaryButtonClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    className?: string;
    onSecondaryButtonClick?: () => void;
  };
  techToolsIcons?: { name: string; icon: ReactNode }[];
}

const HeroSection1: React.FC<HeroSectionProps> = ({
  className = "",
  badgeText,
  announcementText,
  mainHeading,
  subHeading,
  primaryButton,
  secondaryButton,
  techToolsIcons,
}) => {
  const default_main_heading: HeroSectionProps["mainHeading"] = mainHeading ?? {
    text: "Visualize Your Data Like Never Before",
    className: "",
  };

  const default_sub_heading: HeroSectionProps["subHeading"] = subHeading ?? {
    text: "Unlock powerful insights with our intuitive data visualization tools. Start your free trial today!",
    className: "",
  };

  const {
    text: primaryButtonText,
    className: primaryButtonClassName = "",
    onPrimaryButtonClick = () => {}, // Provide a default no-op function
  } = primaryButton;

  return (
    <div
      className={`container mx-auto px-4 py-16 md:py-24 text-center ${className}`}
    >
      {/* Optional badge and announcement */}
      {(badgeText || announcementText) && (
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1">
            {badgeText && (
              <span className="mr-2 rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                {badgeText}
              </span>
            )}
            {announcementText && (
              <span className="text-sm font-medium">{announcementText}</span>
            )}
            {announcementText && <ArrowRight className="ml-2 h-4 w-4" />}
          </div>
        </div>
      )}

      {/* Main heading */}
      <h1
        className={`text-5xl font-bold tracking-tight mb-12 max-w-4xl mx-auto ${default_main_heading?.className}`}
      >
        {default_main_heading?.text}
      </h1>

      {/* Subtext */}
      <div className="max-w-3xl mx-auto mb-12 ">
        <p
          className={`flex flex-wrap justify-center items-center text-lg opacity-60 gap-2 ${default_sub_heading.className} `}
        >
          {default_sub_heading.text}
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button
          className={` px-8 py-6 text-base ${primaryButtonClassName}`}
          onClick={onPrimaryButtonClick}
        >
          {primaryButtonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {secondaryButton && (
          <Button
            variant="ghost"
            className={`text-base h-12 ${secondaryButton.className}`}
            onClick={secondaryButton.onSecondaryButtonClick}
          >
            {secondaryButton.text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* icons */}
      <div className="flex justify-center gap-20 w-full max-sm:gap-10 mt-28">
        {techToolsIcons?.map((icon, index) => {
          return (
            <div
              key={icon.name}
              className={` ${
                index === 0 ? "max-sm:hidden" : ""
              } flex justify-center items-center gap-4 flex-col opacity-55`}
            >
              {React.cloneElement(icon.icon as ReactElement, { size: 28 })}
              <span className="text-sm">{icon.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection1;
