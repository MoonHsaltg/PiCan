import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PiCan - Ghim ý tưởng lên Canvas",
    template: "%s | PiCan",
  },
  description: "Không gian sáng tạo chung dành cho tranh, sketch và những ý tưởng đang lớn lên.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
