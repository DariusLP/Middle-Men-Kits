-- Multi-image support for products
-- Run in Supabase SQL editor after schema.sql

alter table public.products
  add column if not exists image_paths text[] not null default '{}';

update public.products
set image_paths = array[image_path]
where image_path is not null
  and coalesce(cardinality(image_paths), 0) = 0;
