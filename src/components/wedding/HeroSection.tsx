import { motion } from "framer-motion";
import heroImage from "@/assets/hero-wedding.jpg";

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Decoração floral do casamento"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
        >
          Estamos nos casando
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-foreground mb-4"
        >
          Eduarda
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-6 mb-4"
        >
          <div className="w-16 h-px bg-gold" />
          <span className="font-display text-3xl md:text-4xl italic text-gold">&</span>
          <div className="w-16 h-px bg-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-foreground mb-10"
        >
          Vinicius
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="space-y-2"
        >
          <p className="font-body text-lg tracking-[0.15em] text-foreground">
            15 de Novembro de 2025
          </p>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-muted-foreground">
            São Paulo, Brasil
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12 bg-gold/50 mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
