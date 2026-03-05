-- Table: lista de convidados
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: confirmações de presença
CREATE TABLE public.rsvp_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  guest_count INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_confirmations ENABLE ROW LEVEL SECURITY;

-- Guests: anyone can read (public wedding site)
CREATE POLICY "Anyone can view guests" ON public.guests FOR SELECT USING (true);

-- RSVP confirmations: anyone can read and insert (public form)
CREATE POLICY "Anyone can view confirmations" ON public.rsvp_confirmations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert confirmations" ON public.rsvp_confirmations FOR INSERT WITH CHECK (true);