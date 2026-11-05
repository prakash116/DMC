import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { About } from "@/components/home/about";
import { Services } from "@/components/home/services";
import { Brands } from "@/components/home/brands";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
      <About />
      <Services />
      <Brands />
    </main>
  );
}
