import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setImages(data);
      });
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-24 bg-cream relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">📸 Gallery</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Our Library in Pictures
          </h2>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-5xl mx-auto">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="break-inside-avoid mb-4 cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <div className="rounded-xl overflow-hidden shadow-soft group-hover:shadow-gold transition-shadow duration-300">
                <img
                  src={img.image_url}
                  alt={img.caption || "Janhitkari Library gallery image"}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="p-3 bg-card">
                    <p className="font-body text-sm text-muted-foreground">{img.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-navy/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-4xl max-h-[90vh] relative"
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || "Gallery image"}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            {selectedImage.caption && (
              <p className="text-center font-body text-cream/80 mt-4">{selectedImage.caption}</p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
