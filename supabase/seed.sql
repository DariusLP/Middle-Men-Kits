-- Seed catalog for Middle Men (run after schema + migrations)
-- Images live in the Next.js /public/products folder

delete from public.order_items;
delete from public.orders;
delete from public.cart_items;
delete from public.product_variants;
delete from public.products;

insert into public.products (
  id, name, slug, description, club, country, kit_type, season, category,
  base_price, price_on_request, image_path, image_paths, is_weekly, availability_status,
  badge_options, printing_enabled, active
) values
  ('11111111-1111-1111-1111-000000000101', 'Newcastle United GK 23/24', 'newcastle-gk-23-24', 'Green goalkeeper shirt with wave texture and Sela branding.', 'Newcastle United', 'England', 'goalkeeper', '23/24', 'player_version', 650.00, false, '/products/newcastle-gk-23-24.jpg', array['/products/newcastle-gk-23-24.jpg'], true, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000102', 'Bayer Leverkusen Special', 'bayer-leverkusen-special', 'Charcoal Werkself shirt with pink micro-dot detailing.', 'Bayer Leverkusen', 'Germany', 'special', 'Recent', 'player_version', 620.00, false, '/products/bayer-leverkusen-special.jpg', array['/products/bayer-leverkusen-special.jpg','/products/bayer-leverkusen-special-2.jpg'], true, 'available', '["Bundesliga","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000103', 'Newcastle United Away 24/25', 'newcastle-away-24-25', 'Royal blue away shirt with orange Adidas accents.', 'Newcastle United', 'England', 'away', '24/25', 'player_version', 675.00, false, '/products/newcastle-away-24-25.jpg', array['/products/newcastle-away-24-25.jpg'], true, 'available', '["Premier League","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000104', 'FC Porto Home 23/24', 'porto-home-23-24', 'Classic Porto blue-and-white with Super Bock branding.', 'FC Porto', 'Portugal', 'home', '23/24', 'player_version', 640.00, false, '/products/porto-home-23-24.jpg', array['/products/porto-home-23-24.jpg','/products/porto-home-23-24-2.jpg','/products/porto-home-23-24-3.jpg'], false, 'available', '["Primeira Liga","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000105', 'Scotland Special Edition', 'scotland-special', 'Black floral special with teal Adidas shoulder stripes.', 'Scotland', 'Scotland', 'special', 'Recent', 'other', 600.00, false, '/products/scotland-special.jpg', array['/products/scotland-special.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000106', 'South Africa Home', 'south-africa-home', 'Bafana Bafana green home shirt with gold SAFA crest.', 'South Africa', 'South Africa', 'home', 'Classic', 'other', 580.00, false, '/products/south-africa-home.jpg', array['/products/south-africa-home.jpg'], true, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000107', 'England Umbro Long Sleeve', 'england-umbro-long-sleeve', 'White long-sleeve Umbro England shirt with navy and red side panels.', 'England', 'England', 'retro', 'Classic', 'vintage', 720.00, false, '/products/england-umbro-long-sleeve.jpg', array['/products/england-umbro-long-sleeve.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000108', 'England Away 96', 'england-away-96', 'Indigo Euro 96-era away shirt with Three Lions crest.', 'England', 'England', 'away', '1996', 'vintage', 700.00, false, '/products/england-away-96.jpg', array['/products/england-away-96.jpg'], true, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000109', 'England Home Umbro', 'england-home-umbro', 'White Umbro home with St George cross shoulder detail.', 'England', 'England', 'home', 'Classic', 'other', 650.00, false, '/products/england-home-umbro.jpg', array['/products/england-home-umbro.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000110', 'Chelsea Third 24/25', 'chelsea-third-24-25', 'White third kit with pink and black centre stripe.', 'Chelsea', 'England', 'third', '24/25', 'player_version', 680.00, false, '/products/chelsea-third-24-25.jpg', array['/products/chelsea-third-24-25.jpg'], true, 'available', '["Premier League","Conference League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000111', 'Germany Away 90s', 'germany-away-90s', 'Teal Adidas Equipment away with German flag sleeve stripes.', 'Germany', 'Germany', 'away', '1990s', 'vintage', 710.00, false, '/products/germany-away-90s.jpg', array['/products/germany-away-90s.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000112', 'Arsenal Home 11/12', 'arsenal-home-11-12', '125th anniversary red home with white sleeves and Fly Emirates.', 'Arsenal', 'England', 'home', '11/12', 'vintage', 620.00, false, '/products/arsenal-home-11-12.jpg', array['/products/arsenal-home-11-12.jpg'], true, 'available', '["Premier League","FA Cup"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000113', 'France Home 94/96', 'france-home-94-96', 'Royal blue lace-up Adidas classic with rooster crest.', 'France', 'France', 'home', '94/96', 'vintage', 740.00, false, '/products/france-home-94-96.jpg', array['/products/france-home-94-96.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000114', 'Sporting CP Home 03/04', 'sporting-home-03-04', 'Green and white hoops with Banco Espírito Santo branding.', 'Sporting CP', 'Portugal', 'home', '03/04', 'vintage', 590.00, false, '/products/sporting-home-03-04.jpg', array['/products/sporting-home-03-04.jpg','/products/sporting-home-03-04-2.jpg'], false, 'available', '["Primeira Liga"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000115', 'Manchester United Away Sharp', 'man-utd-away-sharp', 'Navy Umbro away with white pinstripes and Sharp digital.', 'Manchester United', 'England', 'away', '1990s', 'vintage', 760.00, false, '/products/man-utd-away-sharp.jpg', array['/products/man-utd-away-sharp.jpg'], true, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000116', 'Al-Nassr Away 23/24', 'al-nassr-away-23-24', 'Away shirt from the recent Al-Nassr drop.', 'Al-Nassr', 'Saudi Arabia', 'away', '23/24', 'player_version', 630.00, false, '/products/al-nassr-away-23-24.jpg', array['/products/al-nassr-away-23-24.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000117', 'Bayer Leverkusen Away 21/22', 'bayer-leverkusen-away-21-22', 'Werkself away from the 21/22 season.', 'Bayer Leverkusen', 'Germany', 'away', '21/22', 'vintage', 560.00, false, '/products/bayer-leverkusen-away-21-22.jpg', array['/products/bayer-leverkusen-away-21-22.jpg'], false, 'available', '["Bundesliga"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000118', 'FC Porto Third 23/24', 'porto-third-23-24', 'Porto third kit from the 23/24 collection.', 'FC Porto', 'Portugal', 'third', '23/24', 'player_version', 640.00, false, '/products/porto-third-23-24.jpg', array['/products/porto-third-23-24.jpg'], false, 'available', '["Primeira Liga"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000119', 'Brazil Away 22', 'brazil-away-22', 'Brazil away shirt from the 2022 cycle.', 'Brazil', 'Brazil', 'away', '2022', 'player_version', 690.00, false, '/products/brazil-away-22.jpg', array['/products/brazil-away-22.jpg'], true, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000120', 'Germany Home 02/04', 'germany-home-02-04', 'White Germany home retro from the early 2000s.', 'Germany', 'Germany', 'home', '02/04', 'vintage', 700.00, false, '/products/germany-home-02-04.jpg', array['/products/germany-home-02-04.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000121', 'Portugal Away 90/92', 'portugal-away-90-92', 'Portugal away retro with classic 90s cut.', 'Portugal', 'Portugal', 'away', '90/92', 'vintage', 680.00, false, '/products/portugal-away-90-92.jpg', array['/products/portugal-away-90-92.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000122', 'Liverpool Away 97/98', 'liverpool-away-97-98', 'Liverpool away from the late 90s.', 'Liverpool', 'England', 'away', '97/98', 'vintage', 720.00, false, '/products/liverpool-away-97-98.jpg', array['/products/liverpool-away-97-98.jpg'], false, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000123', 'Liverpool Centenary Away 91/92', 'liverpool-centenary-away-91-92', 'Centenary-era Liverpool away shirt.', 'Liverpool', 'England', 'away', '91/92', 'vintage', 750.00, false, '/products/liverpool-centenary-away-91-92.jpg', array['/products/liverpool-centenary-away-91-92.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000124', 'Chelsea Home 97/99', 'chelsea-home-97-99', 'Blue Chelsea home from the late 90s.', 'Chelsea', 'England', 'home', '97/99', 'vintage', 710.00, false, '/products/chelsea-home-97-99.jpg', array['/products/chelsea-home-97-99.jpg'], true, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000125', 'Arsenal Away 04/05', 'arsenal-away-04-05', 'Arsenal away from the mid-2000s.', 'Arsenal', 'England', 'away', '04/05', 'vintage', 690.00, false, '/products/arsenal-away-04-05.jpg', array['/products/arsenal-away-04-05.jpg'], false, 'available', '["Premier League","FA Cup"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000126', 'Liverpool Home 85/86', 'liverpool-home-85-86', 'Classic red Liverpool home from the mid-80s.', 'Liverpool', 'England', 'home', '85/86', 'vintage', 780.00, false, '/products/liverpool-home-85-86.jpg', array['/products/liverpool-home-85-86.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000127', 'Liverpool Candy Away 91/92', 'liverpool-candy-away-91-92', 'Candy-sponsored Liverpool away classic.', 'Liverpool', 'England', 'away', '91/92', 'vintage', 760.00, false, '/products/liverpool-candy-away-91-92.jpg', array['/products/liverpool-candy-away-91-92.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000128', 'Chelsea Away 03/04', 'chelsea-away-03-04', 'Chelsea away from the early Roman era.', 'Chelsea', 'England', 'away', '03/04', 'vintage', 670.00, false, '/products/chelsea-away-03-04.jpg', array['/products/chelsea-away-03-04.jpg'], false, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000129', 'Newcastle United Away 97/98', 'newcastle-away-97-98', 'Newcastle away from the late 90s.', 'Newcastle United', 'England', 'away', '97/98', 'vintage', 700.00, false, '/products/newcastle-away-97-98.jpg', array['/products/newcastle-away-97-98.jpg'], false, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000130', 'Bayern Munich 70s Home', 'bayern-70s-home', 'Rare 70s-era Bayern home shirt.', 'Bayern Munich', 'Germany', 'home', '1970s', 'vintage', 800.00, true, '/products/bayern-70s-home.jpg', array['/products/bayern-70s-home.jpg'], false, 'check_required', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000131', 'Arsenal Home 90/92', 'arsenal-home-90-92', 'Early 90s Arsenal home classic.', 'Arsenal', 'England', 'home', '90/92', 'vintage', 730.00, false, '/products/arsenal-home-90-92.jpg', array['/products/arsenal-home-90-92.jpg'], false, 'available', '[]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000132', 'Manchester United Home 00/02', 'man-utd-home-00-02', 'Red United home from the early 2000s.', 'Manchester United', 'England', 'home', '00/02', 'vintage', 720.00, false, '/products/man-utd-home-00-02.jpg', array['/products/man-utd-home-00-02.jpg'], true, 'available', '["Premier League","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000133', 'AC Milan Away 06/07', 'ac-milan-away-06-07', 'AC Milan away from the Champions League winning cycle.', 'AC Milan', 'Italy', 'away', '06/07', 'vintage', 690.00, false, '/products/ac-milan-away-06-07.jpg', array['/products/ac-milan-away-06-07.jpg'], false, 'available', '["Serie A","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000134', 'Newcastle United Home 95/97', 'newcastle-home-95-97', 'Iconic black-and-white Newcastle home.', 'Newcastle United', 'England', 'home', '95/97', 'vintage', 740.00, false, '/products/newcastle-home-95-97.jpg', array['/products/newcastle-home-95-97.jpg'], true, 'available', '["Premier League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000135', 'AC Milan Third 95/96', 'ac-milan-third-95-96', 'Milan third kit from the mid-90s.', 'AC Milan', 'Italy', 'third', '95/96', 'vintage', 710.00, false, '/products/ac-milan-third-95-96.jpg', array['/products/ac-milan-third-95-96.jpg'], false, 'available', '["Serie A"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000136', 'AC Milan Third 06/07', 'ac-milan-third-06-07', 'Milan third from 06/07.', 'AC Milan', 'Italy', 'third', '06/07', 'vintage', 680.00, false, '/products/ac-milan-third-06-07.jpg', array['/products/ac-milan-third-06-07.jpg'], false, 'available', '["Serie A","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000137', 'Bayern Munich Home 95/97', 'bayern-home-95-97', 'Red Bayern home from the mid-90s.', 'Bayern Munich', 'Germany', 'home', '95/97', 'vintage', 730.00, false, '/products/bayern-home-95-97.jpg', array['/products/bayern-home-95-97.jpg'], false, 'available', '["Bundesliga"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000138', 'Bayern Munich Home 05/07', 'bayern-home-05-07', 'Bayern home from the mid-2000s.', 'Bayern Munich', 'Germany', 'home', '05/07', 'vintage', 700.00, false, '/products/bayern-home-05-07.jpg', array['/products/bayern-home-05-07.jpg'], false, 'available', '["Bundesliga","Champions League"]'::jsonb, true, true),
  ('11111111-1111-1111-1111-000000000139', 'Ajax Away 01/02', 'ajax-away-01-02', 'Ajax away with matching back view in gallery.', 'Ajax', 'Netherlands', 'away', '01/02', 'vintage', 670.00, false, '/products/ajax-away-01-02.jpg', array['/products/ajax-away-01-02.jpg','/products/ajax-away-01-02-2.jpg'], false, 'available', '["Eredivisie"]'::jsonb, true, true);

do $$
declare
  p record;
  s text;
  sizes text[] := array['S','M','L','XL','XXL'];
begin
  for p in select id, slug from public.products loop
    foreach s in array sizes loop
      insert into public.product_variants (product_id, size, sku, stock, price_override)
      values (
        p.id,
        s,
        upper(replace(p.slug, '-', '')) || '-' || s,
        case when s in ('M','L') then 24 else 12 end,
        null
      );
    end loop;
  end loop;
end $$;

insert into public.site_settings (key, value, updated_at)
values ('weekly_collection_updated_at', '2026-11-16T08:00:00Z', now())
on conflict (key) do update
set value = excluded.value, updated_at = now();
