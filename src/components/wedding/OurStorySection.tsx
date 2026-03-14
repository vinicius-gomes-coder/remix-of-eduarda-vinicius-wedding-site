import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import couplePhoto from "@/assets/couple-photo.jpg";

const OurStorySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="historia" className="wedding-section bg-secondary" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Conheça
          </p>
          <h2 className="wedding-heading text-foreground">Nossa História</h2>
          <div className="wedding-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src={couplePhoto}
                alt="Eduarda e Vinicius"
                className="w-full max-w-md mx-auto rounded-sm shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/30 rounded-sm -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="wedding-body text-foreground">
              Nos conhecemos de uma forma bem atual: pela internet. O que
              começou com um encontro despretensioso no cinema para assistir
              Shazam acabou se transformando em algo muito maior.
            </p>
            <p className="wedding-body text-foreground">
              Desde então, fomos construindo nossa história juntos,
              compartilhando sonhos, risadas e muitos momentos especiais ao
              longo do caminho.
            </p>
            <p className="wedding-body text-foreground">
              Agora chegou a hora de dar o próximo passo e celebrar o nosso amor
              ao lado das pessoas que fazem parte da nossa história... <br />E
              você é uma delas.
            </p>
            <div className="pt-4">
              <p className="font-display text-2xl italic text-primary">
                "Tudo tem o seu tempo determinado, e há tempo para todo
                propósito debaixo do céu." - Eclesiastes 3:1
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
