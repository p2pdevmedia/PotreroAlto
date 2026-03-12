BEGIN;

INSERT INTO app_users (
  id,
  email,
  display_name,
  avatar_url,
  login_method,
  primary_wallet_address,
  is_guest,
  privy_created_at,
  metadata,
  last_login_at
)
VALUES (
  'did:privy:demo-user-001',
  'escalador.demo@potreroalto.app',
  'Escalador Demo',
  'https://images.example.com/avatar-demo.png',
  'wallet',
  '0x1111111111111111111111111111111111111111',
  false,
  TIMEZONE('utc', NOW()),
  '{"seed": true, "source": "db/migrations/002_seed_privy_user.sql"}'::jsonb,
  TIMEZONE('utc', NOW())
)
ON CONFLICT (id)
DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  login_method = EXCLUDED.login_method,
  primary_wallet_address = EXCLUDED.primary_wallet_address,
  is_guest = EXCLUDED.is_guest,
  privy_created_at = EXCLUDED.privy_created_at,
  metadata = EXCLUDED.metadata,
  last_login_at = EXCLUDED.last_login_at;

INSERT INTO app_user_identities (
  user_id,
  provider,
  provider_user_id,
  wallet_address,
  chain_type,
  is_primary,
  profile
)
VALUES (
  'did:privy:demo-user-001',
  'wallet',
  'wallet:0x1111111111111111111111111111111111111111',
  '0x1111111111111111111111111111111111111111',
  'ethereum',
  true,
  '{"walletClient": "privy", "seed": true}'::jsonb
)
ON CONFLICT (provider, provider_user_id)
DO UPDATE SET
  wallet_address = EXCLUDED.wallet_address,
  chain_type = EXCLUDED.chain_type,
  is_primary = EXCLUDED.is_primary,
  profile = EXCLUDED.profile;

COMMIT;
