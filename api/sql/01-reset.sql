-- Drop all the database  
DROP TABLE IF EXISTS musicians_instruments;
DROP TABLE IF EXISTS musicians_genres;
DROP TABLE IF EXISTS groups_genres;
DROP TABLE IF EXISTS groups_musicians;
DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS musicians;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS instruments;
DROP TABLE IF EXISTS groups;

-- Drop all the type
DROP TYPE IF EXISTS locations;
DROP TYPE IF EXISTS promotions;
DROP TYPE IF EXISTS membership_status;
DROP TYPE IF EXISTS group_roles;