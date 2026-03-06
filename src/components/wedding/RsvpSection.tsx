import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Heart, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type RsvpStatus = "idle" | "loading" | "confirmed" | "already_confirmed" | "not_found";

type GuestSuggestion = { id: string; name: string };

const RsvpSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState("Somente eu");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<GuestSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchGuests = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const { data } = await supabase
      .from("guests")
      .select("id, name")
      .ilike("name", `%${query.trim()}%`)
      .limit(5);
    setSuggestions(data || []);
    setShowSuggestions((data || []).length > 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchGuests(name), 300);
    return () => clearTimeout(timer);
  }, [name, searchGuests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const trimmedName = name.trim();

    // Check if guest is in the list (case-insensitive)
    const { data: guests, error: guestError } = await supabase
      .from("guests")
      .select("id")
      .ilike("name", trimmedName);

    if (guestError || !guests || guests.length === 0) {
      setStatus("not_found");
      return;
    }

    const guest = guests[0];

    // Check if already confirmed
    const { data: existing } = await supabase
      .from("rsvp_confirmations")
      .select("id")
      .eq("guest_id", guest.id);

    if (existing && existing.length > 0) {
      setStatus("already_confirmed");
      return;
    }

    // Parse guest count
    const countMap: Record<string, number> = {
      "Somente eu": 0,
      "1 acompanhante": 1,
      "2 acompanhantes": 2,
      "3 acompanhantes": 3,
    };

    const { error: insertError } = await supabase
      .from("rsvp_confirmations")
      .insert({
        guest_id: guest.id,
        guest_count: countMap[guestCount] ?? 0,
        message: message.trim() || null,
      });

    if (insertError) {
      console.error("Erro ao confirmar presença:", insertError);
      return;
    }

    setStatus("confirmed");
  };

  const renderFeedback = () => {
    if (status === "confirmed") {
      return (
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
      );
    }

    if (status === "already_confirmed") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center wedding-card"
        >
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-display text-3xl text-foreground mb-2">Já confirmado!</h3>
          <p className="wedding-body text-muted-foreground">
            Você já confirmou sua presença anteriormente. Nos vemos na festa! 🎉
          </p>
        </motion.div>
      );
    }

    if (status === "not_found") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center wedding-card"
        >
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="font-display text-3xl text-foreground mb-2">Nome não encontrado</h3>
          <p className="wedding-body text-muted-foreground mb-4">
            Infelizmente o nome informado não está na lista de convidados. 
            Por favor, verifique se digitou corretamente ou entre em contato com os noivos.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="font-body text-sm tracking-[0.15em] uppercase text-primary hover:underline transition-colors"
          >
            Tentar novamente
          </button>
        </motion.div>
      );
    }

    return null;
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

        {status !== "idle" && status !== "loading" ? (
          renderFeedback()
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Deixe uma mensagem carinhosa..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase py-4 rounded-sm hover:bg-sage-dark transition-colors duration-300 disabled:opacity-50"
            >
              {status === "loading" ? "Verificando..." : "Confirmar Presença"}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
