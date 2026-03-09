import Navbar from "@/components/Navbar";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Photo Gallery | Janhitkari Library Hapur"
        description="See photos of Janhitkari Library in Ramgarhi, Hapur — our study areas, facilities, events, and student community."
        path="/gallery"
      />
      <Navbar />
      <div className="pt-20">
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
