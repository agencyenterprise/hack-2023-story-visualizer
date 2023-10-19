"use client";

// @ts-ignore
import { PricingPage } from "sds-projects";

export default function Pricing() {
  return (
    <PricingPage
      freeTierFeatures={[
        "Create rich stories",
        "Show your story to the world",
        "Unlimited access to the app",
        "Quick and easy to use",
        "No ads",
      ]}
    />
  );
}
