import WeddingNav from "@/components/wedding/WeddingNav";
import HeroSection from "@/components/wedding/HeroSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import CeremonySection from "@/components/wedding/CeremonySection";
import GallerySection from "@/components/wedding/GallerySection";
import FaqSection from "@/components/wedding/FaqSection";
import GiftSection from "@/components/wedding/GiftSection";
import RsvpSection from "@/components/wedding/RsvpSection";
import WeddingFooter from "@/components/wedding/WeddingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WeddingNav />
      <HeroSection />
      <OurStorySection />
      <CeremonySection />
      <GallerySection />
      <FaqSection />
      <RsvpSection />
      <WeddingFooter />
    </div>
  );
};

export default Index;
