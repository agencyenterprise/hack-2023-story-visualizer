"use client";

// @ts-ignore
import { SdsNavbar } from "sds-projects";

import {
  CurrencyDollarIcon,
  HomeModernIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

export default function PagesLayout({ children }) {
  return (
    <SdsNavbar
      projectName="Story Visualizer"
      navigation={[
        {
          name: "Story Visualizer",
          page: "/",
          icon: MicrophoneIcon,
        },
        {
          name: "Pricing",
          page: "/pricing",
          icon: CurrencyDollarIcon,
        },
        {
          name: "Who Made This?",
          page: "/who-made-this",
          icon: HomeModernIcon,
        },
      ]}
      customTheme={{
        darkLogo: true,
        colors: {
          background: "bg-[#8F1E42]",
          tabs: "text-white",
          hover: "hover:bg-white hover:text-[#8F1E42]",
          active: "bg-[#8F1E42] text-white",
        },
      }}
      hideSettingsButton
      hideYourProfileButton
      hideUserMenu
    >
      {children}
    </SdsNavbar>
  );
}
