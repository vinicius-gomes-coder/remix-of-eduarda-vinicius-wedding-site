import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import venueImage from "@/assets/venue.jpg";
import CountdownTimer from "./CountdownTimer";

const CeremonySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const details = [
    { icon: Calendar, label: "Data", value: "15 de Novembro de 2025" },
    { icon: Clock, label: "Horário", value: "16h00" },
    { icon: MapPin, label: "Local", value: "Espaço Villa Garden" },
  ];

  return (
    <section id="cerimonia" className="wedding-section" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Celebre conosco
          </p>
          <h2 className="wedding-heading text-foreground">A Cerimônia</h2>
          <div className="wedding-divider" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <CountdownTimer />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {details.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="font-display text-xl text-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}

            <div className="pt-4">
              <p className="wedding-body text-muted-foreground">
                Rua das Flores, 1234 — Jardim Botânico
                <br />
                São Paulo, SP — Brasil
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img
              src={venueImage}
              alt="Local da cerimônia"
              className="w-full rounded-sm shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CeremonySection;
