import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora",
  description: "",
  robots: { index: false, follow: false },
};

// Даты мок-данных считаются относительно текущего момента (дедлайны,
// таймеры SLA, срок лицензии), поэтому статический пререндер на этапе
// сборки не подходит — рендерим страницы на каждый запрос.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="bg-canvas font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
