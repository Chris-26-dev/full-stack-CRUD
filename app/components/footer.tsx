import React from "react";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface SocialLink {
  href: string;
  icon: IconType;
}

interface FooterNavigation {
  [key: string]: { label: string; href: string }[];
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { href: "#", icon: FaInstagram },
  { href: "#", icon: FaYoutube },
  { href: "#", icon: FaFacebook },
  { href: "#", icon: FaTwitter },
  { href: "#", icon: FaLinkedin },
];

const DEFAULT_FOOTER_NAVIGATION: FooterNavigation = {
  Solutions: [
    { label: "Summary", href: "#" },
    { label: "Plans", href: "#" },
    { label: "Store", href: "#" },
    { label: "Capabilities", href: "#" },
  ],
  Organization: [
    { label: "Profile", href: "#" },
    { label: "Members", href: "#" },
    { label: "News", href: "#" },
    { label: "Jobs", href: "#" },
  ],
};

interface Footer1Props {
  sectionId?: string;
  website?: string;
  websiteDescription?: string;
  handle?: string;
  classname?: string;
  socialLinks?: SocialLink[];
  footerNavigation?: FooterNavigation;
}

export default function Footer1({
  sectionId = "",
  website = "domain.com",
  websiteDescription = " This is a description of the website",
  handle = "@username",
  classname,
  footerNavigation = DEFAULT_FOOTER_NAVIGATION,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: Footer1Props) {
  // LEFT SECTION
  function LeftSection() {
    return (
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="mb-4 font-semibold text-2xl">{website}</div>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base max-w-md">
          {websiteDescription}
        </p>
        <div className="flex items-center space-x-4 text-muted-foreground">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:opacity-75 transition-opacity duration-200"
              aria-label={`Social link ${index + 1}`}
            >
              <link.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  function RightSection() {
    return (
      <div className="w-full lg:w-1/2 ">
        <div className="flex flex-wrap gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
          {Object.entries(footerNavigation).map(([title, links]) => (
            <div key={title} className="min-w-0">
              <div className="mb-4 font-semibold text-md sm:text-lg">
                {title}
              </div>
              <ul className="space-y-2 text-muted-foreground">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:underline text-sm sm:text-base transition-all duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //MAIN JSX
  return (
    <footer
      id={sectionId}
      className={`w-full py-6 sm:py-8 lg:py-12 flex flex-col gap-4 text-sm
      px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-10 ${classname || ""}`}
    >
      {/* Main content section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 mb-6 sm:mb-8 lg:mb-10">
        <LeftSection />
        <RightSection />
      </div>

      {/* Separator */}
      <Separator className="h-[1px] my-4" />

      {/* Bottom section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-xs sm:text-sm">
        <div className="text-center sm:text-left">
          <span className="font-semibold opacity-60">{website}</span>
          <span className="ml-1">&copy; All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1 text-center sm:text-right">
          <span>Made with</span>
          <Heart className="text-red-500 h-4 w-4 fill-current mx-1" />
          <span>by</span>
          <span className="font-semibold ml-1">@{handle}</span>
        </div>
      </div>
    </footer>
  );
}
