import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Flowgraph Lab",
  description: "Develop and run Flowgraph/Kratos applications",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
