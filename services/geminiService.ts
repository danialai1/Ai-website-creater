
import { GoogleGenAI } from "@google/genai";
import type { WebsiteConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (config: WebsiteConfig): string => {
  const featuresList = config.features.join(', ');
  const customCssInstruction = config.style === 'Custom' && config.customCss
    ? `\n- **Custom CSS:** The user has provided custom CSS. Place this inside a <style> tag in the <head>. CSS:\n${config.customCss}`
    : '';

  return `
    You are an expert web developer specializing in creating stunning, responsive, single-page websites using Tailwind CSS.
    Your task is to generate a complete, single HTML file based on the user's request.

    **Website Requirements:**
    - **Website Type:** ${config.websiteType}
    - **Business Name:** ${config.businessName}
    - **Description:** ${config.description}
    - **Tone & Style:** ${config.tone}
    - **Visual Theme:** ${config.style}
    - **Required Sections/Features:** ${featuresList}${customCssInstruction}

    **Technical Specifications:**
    1.  **Single File:** The entire website (HTML, CSS, and JavaScript) must be contained within a single \`index.html\` file.
    2.  **Tailwind CSS:** Use Tailwind CSS for all styling. You MUST include the Tailwind CDN script in the \`<head>\`. Do not use any other CSS frameworks or custom CSS files. All styling should be done with Tailwind classes directly in the HTML markup. If a visual theme is specified (e.g., 'Dark Mode', 'Minimalist'), apply Tailwind classes that reflect that theme throughout the site. For example, for 'Dark Mode', use dark backgrounds (e.g., 'bg-gray-900') and light text. For 'Minimalist', use ample white space and a simple color palette. If custom CSS is provided, include it in a <style> tag in the head.
        \`<script src="https://cdn.tailwindcss.com"></script>\`
    3.  **JavaScript:** If any interactivity is needed (e.g., mobile menu toggle, simple animations), include the JavaScript within a \`<script>\` tag at the end of the \`<body>\`.
    4.  **Responsiveness:** The website must be fully responsive and look great on all screen sizes, from mobile to desktop.
    5.  **Images:** Use placeholder images from \`https://picsum.photos/seed/{seed}/width/height\`. Use descriptive and relevant seed words for each image (e.g., 'portfolio', 'restaurant', 'tech').
    6.  **Content:** Generate relevant and high-quality placeholder text for all sections that fits the specified tone and business type.
    7.  **Structure:** The HTML should be well-structured, semantic, and clean.

    **Output Format:**
    Provide ONLY the raw HTML code for the complete webpage.
    Start with \`<!DOCTYPE html>\` and end with \`</html>\`.
    Do not include any explanations, comments, or markdown formatting like \`\`\`html before or after the code.
  `;
};

export const generateWebsiteCode = async (config: WebsiteConfig): Promise<string> => {
  if (!config.businessName || !config.description) {
    throw new Error("Business Name and Description are required.");
  }
  const prompt = generatePrompt(config);
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating website code:", error);
    throw new Error("Failed to generate website from AI. Please try again.");
  }
};
