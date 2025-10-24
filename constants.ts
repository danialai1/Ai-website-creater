
import type { WebsiteConfig } from './types';

export const WEBSITE_TYPES = [
  "Portfolio",
  "E-commerce Store",
  "Blog",
  "Restaurant",
  "Corporate",
  "Startup Landing Page",
];

export const TONES = [
  "Professional",
  "Friendly & Casual",
  "Modern & Minimalist",
  "Luxury & Elegant",
  "Playful & Fun",
];

export const FEATURES = [
  "Hero Section",
  "About Us Section",
  "Services/Products Section",
  "Testimonials",
  "Image Gallery",
  "Contact Form",
  "Footer with Social Links",
];

export const STYLES = [
  "Minimalist",
  "Bold & Vibrant",
  "Elegant & Corporate",
  "Dark Mode",
  "Custom",
];

export const EXAMPLE_CONFIGS: Omit<WebsiteConfig, 'businessName' | 'description' | 'customCss'>[] = [
    {
        websiteType: "Portfolio",
        tone: "Modern & Minimalist",
        features: ["Hero Section", "Image Gallery", "Contact Form", "Footer with Social Links"],
        style: "Minimalist",
    },
    {
        websiteType: "Restaurant",
        tone: "Friendly & Casual",
        features: ["Hero Section", "About Us Section", "Services/Products Section", "Contact Form"],
        style: "Bold & Vibrant",
    },
    {
        websiteType: "Startup Landing Page",
        tone: "Professional",
        features: ["Hero Section", "Services/Products Section", "Testimonials", "Contact Form"],
        style: "Elegant & Corporate",
    }
];
