import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const GiftSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="presentes" className="wedding-section bg-card" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Presentes
          </p>
          <h2 className="wedding-heading text-foreground">
            Lista de Presentes
          </h2>
          <div className="wedding-divider" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="w-7 h-7 text-primary" />
            </div>
          </div>

          <p className="wedding-body text-muted-foreground leading-relaxed">
            A sua presença é o nosso maior presente! Mas, se desejar nos
            presentear, preparamos uma lista de presentes com carinho para nos
            ajudar a construir nosso novo lar juntos.
          </p>

          <Button
            asChild
            size="lg"
            className="font-body tracking-[0.15em] uppercase text-sm px-10"
          >
            <a
              href="https://wedding-gift-site-kappa.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Lista de Presentes
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftSection;
