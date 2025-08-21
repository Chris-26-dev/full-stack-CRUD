"use client";

import Footer1 from "@/app/components/footer";
import React from "react";

import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

export default function FooterSection() {
  // 🔹 Mock data for footer
  const mockFooterData = {
    sectionId: "footer",
    website: "Full Stack CRUD",
    websiteDescription:
      "Nextify.io is your go-to platform for building scalable, modern web apps with speed and simplicity. Trusted by startups and enterprises alike.",
    handle: "nextifydevs",
    socialLinks: [
      { href: "https://instagram.com/nextify", icon: FaInstagram },
      { href: "https://youtube.com/@nextify", icon: FaYoutube },
      { href: "https://facebook.com/nextify", icon: FaFacebook },
      { href: "https://twitter.com/nextify", icon: FaTwitter },
      { href: "https://linkedin.com/company/nextify", icon: FaLinkedin },
    ],
    footerNavigation: {
      Product: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Integrations", href: "/integrations" },
        { label: "Docs", href: "/docs" },
      ],
      Company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
      ],
      Support: [
        { label: "Help Center", href: "/help" },
        { label: "Community", href: "/community" },
        { label: "Contact", href: "/contact" },
        { label: "Status", href: "/status" },
      ],
    },
  };

  return (
    <main>
      {/* Page content here */}
      <Footer1
        sectionId={mockFooterData.sectionId}
        website={mockFooterData.website}
        websiteDescription={mockFooterData.websiteDescription}
        handle={mockFooterData.handle}
        socialLinks={mockFooterData.socialLinks}
        footerNavigation={mockFooterData.footerNavigation}
      />
    </main>
  );
}
