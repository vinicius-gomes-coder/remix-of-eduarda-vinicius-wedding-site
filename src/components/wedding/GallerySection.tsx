import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import couplePhoto from "@/assets/couple-photo.jpg";

const images = [
  { src: gallery1, alt: "Casal caminhando no jardim", span: "md:row-span-2" },
  { src: gallery2, alt: "Detalhes das alianças", span: "" },
  { src: gallery3, alt: "Casal sorrindo ao pôr do sol", span: "" },
  { src: couplePhoto, alt: "Eduarda e Vinicius", span: "md:col-span-2" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="galeria" className="wedding-section bg-secondary" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Momentos
          </p>
          <h2 className="wedding-heading text-foreground">Galeria</h2>
          <div className="wedding-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className={`overflow-hidden rounded-sm group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover min-h-[250px] transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
