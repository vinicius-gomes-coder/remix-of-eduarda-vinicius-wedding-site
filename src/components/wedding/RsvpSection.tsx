import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Heart,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type GuestSuggestion = { id: string; name: string };

type GuestEntry = {
  id: string;
  name: string;
  email: string;
  status: "idle" | "valid" | "not_found" | "already_confirmed";
  guestDbId?: string;
};

type RsvpPhase = "form" | "submitting" | "done";

let entryIdCounter = 0;
const newEntry = (): GuestEntry => ({
  id: `entry-${++entryIdCounter}`,
  name: "",
  email: "",
  status: "idle",
  guestDbId: undefined,
});

const RsvpSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [phase, setPhase] = useState<RsvpPhase>("form");
  const [guests, setGuests] = useState<GuestEntry[]>([newEntry()]);
  const [message, setMessage] = useState("");
  const [confirmedNames, setConfirmedNames] = useState<string[]>([]);

  // Suggestions state — only for the focused entry
  const [focusedEntryId, setFocusedEntryId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GuestSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchGuests = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const { data } = await supabase
      .from("convidados")
      .select("id, name")
      .ilike("name", `%${query.trim()}%`)
      .limit(5);
    setSuggestions(data || []);
    setShowSuggestions((data || []).length > 0);
  }, []);

  // Debounce search for the focused entry
  const focusedGuest = guests.find((g) => g.id === focusedEntryId);
  useEffect(() => {
    if (!focusedGuest) return;
    const timer = setTimeout(() => searchGuests(focusedGuest.name), 300);
    return () => clearTimeout(timer);
  }, [focusedGuest?.name, searchGuests]);

  const updateGuest = (entryId: string, name: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === entryId
          ? { ...g, name, status: "idle", guestDbId: undefined }
          : g,
      ),
    );
  };

  const updateGuestEmail = (entryId: string, email: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === entryId ? { ...g, email } : g,
      ),
    );
  };
  const selectSuggestion = (entryId: string, guest: GuestSuggestion) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === entryId ? { ...g, name: guest.name, status: "idle" } : g,
      ),
    );
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const addGuest = () => {
    if (guests.length >= 10) return;
    setGuests((prev) => [...prev, newEntry()]);
  };

  const removeGuest = (entryId: string) => {
    if (guests.length <= 1) return;
    setGuests((prev) => prev.filter((g) => g.id !== entryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("submitting");

    const validated: GuestEntry[] = [];

    for (const entry of guests) {
      const trimmed = entry.name.trim();
      if (!trimmed) {
        validated.push({ ...entry, status: "not_found" });
        continue;
      }

      // Look up guest
      const { data: found } = await supabase
        .from("convidados")
        .select("*")
        .ilike("name", trimmed);

      if (!found || found.length === 0) {
        validated.push({ ...entry, status: "not_found" });
        continue;
      }

      if (found && found[0].confirmed) {
        validated.push({
          ...entry,
          status: "already_confirmed",
          guestDbId: found[0].id,
        });
        continue;
      }

      if (found && !found[0].confirmed) {
        validated.push({ ...entry, status: "valid", guestDbId: found[0].id });
        continue;
      }
    }

    setGuests(validated);

    const toConfirm = validated.filter(
      (g) => g.status === "valid" && g.guestDbId,
    );
    const hasErrors = validated.some((g) => g.status === "not_found");

    if (toConfirm.length === 0) {
      // Nothing to confirm, show form with errors
      setPhase("form");
      return;
    }

    if (hasErrors) {
      // Some invalid — show form with statuses so user can fix
      setPhase("form");
      return;
    }

    // All valid — confirm and save email
    for (const guest of toConfirm) {
      await supabase
        .from("convidados" as any)
        .update({ confirmed: true, email: email.trim() || null })
        .eq("id", guest.guestDbId);
    }

    setConfirmedNames(toConfirm.map((g) => g.name.trim()));
    setPhase("done");
  };

  if (phase === "done") {
    return (
      <section id="rsvp" className="wedding-section" ref={ref}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center wedding-card"
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-display text-3xl text-foreground mb-2">
              Obrigado!
            </h3>
            <p className="wedding-body text-muted-foreground">
              {confirmedNames.length === 1
                ? `Presença de ${confirmedNames[0]} confirmada!`
                : `Presenças confirmadas: ${confirmedNames.join(", ")}.`}{" "}
              Mal podemos esperar para celebrar este dia especial com vocês!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

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
          <h2 className="wedding-heading text-foreground">
            Confirmar Presença
          </h2>
          <div className="wedding-divider" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="wedding-card space-y-6"
        >
          <div>
            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3 block">
              Nomes dos convidados
            </label>
            <div className="space-y-3">
              {guests.map((entry, index) => (
                <div key={entry.id} className="relative">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        value={entry.name}
                        onChange={(e) => updateGuest(entry.id, e.target.value)}
                        onFocus={() => {
                          setFocusedEntryId(entry.id);
                          if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 200)
                        }
                        className={`w-full bg-background border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none transition-colors ${
                          entry.status === "not_found"
                            ? "border-destructive"
                            : entry.status === "already_confirmed"
                              ? "border-yellow-500"
                              : "border-border focus:border-primary"
                        }`}
                        placeholder={
                          index === 0
                            ? "Comece a digitar seu nome..."
                            : "Nome completo"
                        }
                        autoComplete="off"
                      />
                      <AnimatePresence>
                        {showSuggestions && focusedEntryId === entry.id && (
                          <motion.ul
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-10 w-full mt-1 bg-background border border-border rounded-sm shadow-lg overflow-hidden"
                          >
                            {suggestions.map((guest) => (
                              <li
                                key={guest.id}
                                onMouseDown={() =>
                                  selectSuggestion(entry.id, guest)
                                }
                                className="px-4 py-3 font-body text-sm text-foreground cursor-pointer hover:bg-accent transition-colors"
                              >
                                {guest.name}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    {guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(entry.id)}
                        className="mt-2.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {entry.status === "not_found" && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-destructive font-body">
                      <AlertCircle className="w-3 h-3" /> Nome não encontrado na
                      lista de convidados
                    </p>
                  )}
                  {entry.status === "already_confirmed" && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-yellow-600 font-body">
                      <CheckCircle2 className="w-3 h-3" /> Presença já
                      confirmada anteriormente
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addGuest}
              className="mt-3 flex items-center gap-1.5 font-body text-xs tracking-[0.1em] uppercase text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar pessoa
            </button>
          </div>

          <div>
            <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
              Seu e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="seuemail@exemplo.com"
            />
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
            disabled={phase === "submitting"}
            className="w-full bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase py-4 rounded-sm hover:bg-sage-dark transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {phase === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              "Confirmar Presença"
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default RsvpSection;
