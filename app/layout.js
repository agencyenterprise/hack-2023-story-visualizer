import "react-toastify/dist/ReactToastify.css";
import "@typeform/embed/build/css/popup.css";
import "./globals.css";

import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Story Visualizer - Bring Stories to Life",
  description:
    "Create visuals for stories with Story Visualizer. Generate images with AI and have fun with stories. Great way for children to interact with stories and practice their creativity.",
  icons: [
    {
      url: "/favicon.ico",
      rel: "icon",
      sizes: "any",
    },
  ],
  twitter: {
    card: "summary_large_image",
    title: "Story Visualizer - Bring Stories to Life",
    description:
      "Create visuals for stories with Story Visualizer. Generate images with AI and have fun with stories. Great way for children to interact with stories and practice their creativity.",
    images: "https://www.storyvisualizer.com/logo.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.storyvisualizer.com",
    title: "Story Visualizer - Bring Stories to Life",
    description:
      "Create visuals for stories with Story Visualizer. Generate images with AI and have fun with stories. Great way for children to interact with stories and practice their creativity.",
    images: "https://www.storyvisualizer.com/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
