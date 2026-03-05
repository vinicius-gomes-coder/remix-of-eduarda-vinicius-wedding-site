import { Heart } from "lucide-react";

const WeddingFooter = () => {
  return (
    <footer className="py-12 px-6 bg-primary text-primary-foreground text-center">
      <p className="font-display text-3xl md:text-4xl font-light mb-4">
        Eduarda <span className="text-gold-light">&</span> Vinicius
      </p>
      <p className="font-body text-sm tracking-[0.2em] opacity-70 mb-6">
        15 de Novembro de 2025
      </p>
      <Heart className="w-5 h-5 mx-auto opacity-50" />
      <p className="font-body text-xs tracking-[0.15em] opacity-40 mt-6">
        Feito com amor
      </p>
    </footer>
  );
};

export default WeddingFooter;
