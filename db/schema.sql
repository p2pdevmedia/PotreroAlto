BEGIN;

CREATE TABLE IF NOT EXISTS sectors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS subsectors (
  id TEXT PRIMARY KEY,
  sector_id TEXT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector TEXT DEFAULT 'Potrero Alto',
  description TEXT DEFAULT '',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  sector_id TEXT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  subsector_id TEXT NOT NULL REFERENCES subsectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT DEFAULT 'Sin grado',
  stars NUMERIC(3,1),
  type TEXT DEFAULT 'Sport',
  description TEXT DEFAULT '',
  image TEXT,
  length_meters INTEGER,
  quickdraws INTEGER,
  equipped_by TEXT,
  equipped_date TEXT,
  first_ascent_by TEXT,
  first_ascent_date TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subsectors_sector_id ON subsectors(sector_id);
CREATE INDEX IF NOT EXISTS idx_routes_sector_id ON routes(sector_id);
CREATE INDEX IF NOT EXISTS idx_routes_subsector_id ON routes(subsector_id);

COMMIT;
