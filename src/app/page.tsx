import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { About } from "@/components/home/about";
import { Services } from "@/components/home/services";
import { BeforeAfterSection } from "@/components/gallery/before-after";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { BookingSection } from "@/components/home/booking-section";
import { Brands } from "@/components/home/brands";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
      <About />
      <Services />
      <BeforeAfterSection />
      <WhyChooseUs />
      <CustomerReviews />
      <BookingSection />
      <Brands />
    </main>
  );
}
