import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
  {
    question: "O que devo vestir?",
    answer: "Por gentileza, vestir traje social.",
  },
  {
    question: "Haverá uma recepção?",
    answer:
      "Sim, a recepção será no mesmo local logo após a cerimônia. Bebidas e jantar serão servidos.",
  },
  {
    question: "Posso levar acompanhante?",
    answer:
      "Não, o convite é nominal e contabilizado na lista de presença de convidados. Pedimos por gentileza que respeite o nome indicado no convite.",
  },
  {
    question: "Qual o endereço do evento?",
    answer:
      "Av. Otacílio Negrão de Lima, 17.171\nPampulha, Belo Horizonte.\nCASA ORLA",
  },
  {
    question: "Qual a data e horário da cerimônia?",
    answer: "Dia 15 de maio de 2026 (sexta-feira) às 16:30.",
  },
];

const FaqSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="duvidas" className="wedding-section" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Tire suas dúvidas
          </p>
          <h2 className="wedding-heading text-foreground">
            Suas Perguntas, Respondidas
          </h2>
          <div className="wedding-divider" />
        </motion.div>

        <div className="space-y-10">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="text-center"
            >
              <h3 className="font-display text-lg text-primary underline underline-offset-4 decoration-primary/40 mb-2">
                {faq.question}
              </h3>
              <p className="wedding-body text-muted-foreground whitespace-pre-line">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
