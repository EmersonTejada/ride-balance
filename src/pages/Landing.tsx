import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";

export const Landing = () => {
  return (
    <>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
        <Header />
        <main>
          <Hero />
        </main>
      </div>
    </>
  );
};
