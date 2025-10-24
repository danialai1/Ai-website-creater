
export interface WebsiteConfig {
  websiteType: string;
  businessName: string;
  description: string;
  tone: string;
  features: string[];
  style: string;
  customCss?: string;
}

export interface Favorite extends WebsiteConfig {
  id: string;
}
