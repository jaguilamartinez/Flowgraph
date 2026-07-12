import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Component catalog and token reference for the Flowgraph AI design system.",
};

export default function DesignSystemPage() {
  return <GalleryClient />;
}
