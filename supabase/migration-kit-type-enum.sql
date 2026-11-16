-- Expand kit_type enum for newer catalog values
-- Run BEFORE seed.sql on existing projects

alter type public.kit_type add value if not exists 'goalkeeper';
alter type public.kit_type add value if not exists 'retro';
alter type public.kit_type add value if not exists 'special';
