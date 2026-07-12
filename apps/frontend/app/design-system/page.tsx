import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Design system",
  description: "Reference for Flowgraph AI frontend design tokens and components.",
};

export default function DesignSystemPage() {
  return <GalleryClient />;
}
