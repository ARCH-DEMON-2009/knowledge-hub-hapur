import { useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { X, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    const loadGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, image_url, caption, sort_order, created_at")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load gallery:", error.message);
      }

      if (isMounted) {
        setImages(data || []);
        setLoading(false);
      }
    };

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  const withCacheVersion = (url: string, version: string) => {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("v", version);
      return parsed.toString();
    } catch {
      const joiner = url.includes("?") ? "&" : "?";
      return `${url}${joiner}v=${encodeURIComponent(version)}`;
    }
  };

  if (loading || images.length === 0) return null;

  return (
    <section className="py-24 bg-cream relative" ref={ref}>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,hsl(var(--gold)/0.06),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,hsl(var(--navy)/0.04),transparent_70%)] blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">
            📸 Gallery
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Our Library in Pictures
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Take a visual tour of our study spaces and facilities.
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 max-w-6xl mx-auto">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="break-inside-avoid mb-5 cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-soft group-hover:shadow-gold transition-all duration-500 border border-transparent group-hover:border-[hsl(var(--gold)/0.25)] bg-muted">
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-all duration-500 z-10 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center shadow-gold">
                      <ZoomIn className="w-5 h-5 text-navy" />
                    </div>
                  </motion.div>
                </div>

                {failedIds[img.id] ? (
                  <div className="w-full min-h-56 flex items-center justify-center p-4 text-center">
                    <p className="font-body text-sm text-muted-foreground">Image failed to load.</p>
                  </div>
                ) : (
                  <img
                    src={withCacheVersion(img.image_url, img.created_at)}
                    alt={img.caption || "Janhitkari Library gallery image"}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={() => setFailedIds((prev) => ({ ...prev, [img.id]: true }))}
                  />
                )}

                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent p-4 pt-10 z-20">
                    <p className="font-body text-sm text-cream font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 flex items-center justify-center text-cream transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="max-w-5xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={withCacheVersion(selectedImage.image_url, selectedImage.created_at)}
                alt={selectedImage.caption || "Gallery image"}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              {selectedImage.caption && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center font-body text-cream/90 mt-4 text-lg"
                >
                  {selectedImage.caption}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;

