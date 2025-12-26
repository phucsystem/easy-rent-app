-- Create tenants table (stricter: id_card required, unique per user, utc timestamps)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  id_card TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  current_address TEXT NOT NULL,
  permanent_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_user_id_card UNIQUE (user_id, id_card)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON public.tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_full_name ON public.tenants(full_name);
CREATE INDEX IF NOT EXISTS idx_tenants_id_card ON public.tenants(id_card);
CREATE INDEX IF NOT EXISTS idx_tenants_phone ON public.tenants(phone);
CREATE INDEX IF NOT EXISTS idx_tenants_created_at ON public.tenants(created_at DESC);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own tenants"
  ON public.tenants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tenants"
  ON public.tenants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tenants"
  ON public.tenants FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tenants"
  ON public.tenants FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grants
GRANT ALL ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;

-- Comment
COMMENT ON TABLE public.tenants IS 'Stores tenant information for rental contracts';
