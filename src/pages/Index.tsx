import WeddingNav from "@/components/wedding/WeddingNav";
import HeroSection from "@/components/wedding/HeroSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import CeremonySection from "@/components/wedding/CeremonySection";
import GallerySection from "@/components/wedding/GallerySection";
import RsvpSection from "@/components/wedding/RsvpSection";
import WeddingFooter from "@/components/wedding/WeddingFooter";
import FaqSection from "@/components/wedding/FaqSection";
import GiftSection from "@/components/wedding/GiftSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WeddingNav />
      <HeroSection />
      <OurStorySection />
      <GiftSection />
      <CeremonySection />
      <GallerySection />
      <FaqSection />
      <RsvpSection />
      <WeddingFooter />
    </div>
  );
};

export default Index;
