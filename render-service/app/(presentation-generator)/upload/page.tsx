import React from "react";

import UploadPage from "./components/UploadPage";
import Header from "@/app/(presentation-generator)/(dashboard)/dashboard/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WiseDeck | AI presentation generator",
  description:
    "WiseDeck is an AI presentation generator with custom layouts, multi-model support (OpenAI, Gemini, Ollama), and PDF/PPTX export.",
  keywords: [
    "presentation generator",
    "AI presentations",
    "data visualization",
    "automatic presentation maker",
    "professional slides",
    "data-driven presentations",
    "document to presentation",
    "presentation automation",
    "smart presentation tool",
    "business presentations",
  ],
  openGraph: {
    title: "Create Presentation | WiseDeck",
    description:
      "WiseDeck is an AI presentation generator with custom layouts, multi-model support (OpenAI, Gemini, Ollama), and PDF/PPTX export.",
    type: "website",
    siteName: "WiseDeck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Presentation | WiseDeck",
    description:
      "WiseDeck is an AI presentation generator with custom layouts, multi-model support (OpenAI, Gemini, Ollama), and PDF/PPTX export.",
  },
};

const page = () => {
  return (
    <div className="relative">
      <Header />
      <div className="flex flex-col items-center justify-center  mb-8">
        <h1 className="text-[64px] font-normal font-unbounded text-[#101323] ">
          AI Presentation
        </h1>
        <p className="text-xl font-syne text-[#101323CC]">Choose a design, set preferences, and generate polished slides.</p>
      </div>

      <UploadPage />
    </div>
  );
};

export default page;
