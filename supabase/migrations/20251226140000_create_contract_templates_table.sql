-- Create contract_templates table
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contract_templates_user_id ON public.contract_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_contract_templates_name ON public.contract_templates(name);
CREATE INDEX IF NOT EXISTS idx_contract_templates_is_default ON public.contract_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_contract_templates_created_at ON public.contract_templates(created_at DESC);

-- Enable RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own templates and defaults"
  ON public.contract_templates FOR SELECT
  USING (auth.uid() = user_id OR is_default = true OR user_id IS NULL);

CREATE POLICY "Users can insert own templates"
  ON public.contract_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON public.contract_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own non-default templates"
  ON public.contract_templates FOR DELETE
  USING (auth.uid() = user_id AND is_default = false);

-- Trigger to auto-update updated_at (reuse existing function)
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grants
GRANT ALL ON public.contract_templates TO authenticated;
GRANT ALL ON public.contract_templates TO service_role;

-- Comment
COMMENT ON TABLE public.contract_templates IS 'Stores contract templates with variable placeholders for generating rental contracts';
