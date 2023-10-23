"use client";

// @ts-ignore
import { PricingPage } from "sds-projects";

export default function Pricing() {
  return (
    <PricingPage
      freeTierFeatures={[
        "Visualize your words",
        "Unlimited access to the app",
        "Quick and easy to use",
        "No ads",
        "Free!",
      ]}
    />
  );
}
