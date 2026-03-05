import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Heart } from "lucide-react";

const RsvpSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="wedding-section" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Esperamos por você
          </p>
          <h2 className="wedding-heading text-foreground">Confirmar Presença</h2>
          <div className="wedding-divider" />
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center wedding-card"
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-display text-3xl text-foreground mb-2">Obrigado!</h3>
            <p className="wedding-body text-muted-foreground">
              Sua presença confirmada nos enche de alegria. Mal podemos esperar para
              celebrar este dia especial com você!
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="wedding-card space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                Número de acompanhantes
              </label>
              <select
                className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option>Somente eu</option>
                <option>1 acompanhante</option>
                <option>2 acompanhantes</option>
                <option>3 acompanhantes</option>
              </select>
            </div>

            <div>
              <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                Mensagem para os noivos (opcional)
              </label>
              <textarea
                rows={3}
                className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Deixe uma mensagem carinhosa..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase py-4 rounded-sm hover:bg-sage-dark transition-colors duration-300"
            >
              Confirmar Presença
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
