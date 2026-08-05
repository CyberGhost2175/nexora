import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContactSection } from "@/components/sections/ContactSection";
import { CoverSection } from "@/components/sections/CoverSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { getDictionary, hasLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} lang={lang} />
      <main className="mx-auto w-full max-w-[1400px] px-container-padding lg:px-page-margin">
        <CoverSection dict={dict} />
        <ProblemSection dict={dict} />
        <SolutionSection dict={dict} />
        <PricingSection dict={dict} />
        <ContactSection dict={dict} lang={lang} />
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  );
}
