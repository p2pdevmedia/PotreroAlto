BEGIN;

CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  login_method TEXT NOT NULL DEFAULT 'unknown',
  primary_wallet_address TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT false,
  privy_created_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS app_user_identities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  wallet_address TEXT,
  chain_type TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_users_primary_wallet_address ON app_users (LOWER(primary_wallet_address)) WHERE primary_wallet_address IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_app_user_identities_user_id ON app_user_identities(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_user_identities_wallet_address ON app_user_identities (LOWER(wallet_address)) WHERE wallet_address IS NOT NULL;

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_app_users_touch_updated_at ON app_users;
CREATE TRIGGER trg_app_users_touch_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_app_user_identities_touch_updated_at ON app_user_identities;
CREATE TRIGGER trg_app_user_identities_touch_updated_at
BEFORE UPDATE ON app_user_identities
FOR EACH ROW
EXECUTE FUNCTION touch_updated_at();

COMMIT;
