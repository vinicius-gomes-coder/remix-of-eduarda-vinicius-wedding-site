import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WEDDING_DATE = new Date("2026-05-15T17:00:00");

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
      return {
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / (1000 * 60)) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="text-center">
          <motion.div
            key={value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="wedding-card min-w-[70px] md:min-w-[90px] py-4"
          >
            <span className="font-display text-3xl md:text-5xl font-light text-primary">
              {String(value).padStart(2, "0")}
            </span>
          </motion.div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mt-3">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
