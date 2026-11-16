import fs from "fs";
import path from "path";

const root = process.cwd();
const previewDir = path.join(root, ".tmp-kit-preview");
const productsDir = path.join(root, "public", "products");
console.log("previewDir", previewDir, fs.existsSync(previewDir));

/** @type {{ id: string, file: string, slug: string, name: string, club: string, country: string, kit_type: string, season: string, category: string, base_price: number, price_on_request?: boolean, is_weekly?: boolean, availability_status?: string, badge_options?: string[], description: string, extras?: string[] }[]} */
const products = [
  {
    id: "101",
    file: "01.jpeg",
    slug: "newcastle-gk-23-24",
    name: "Newcastle United GK 23/24",
    club: "Newcastle United",
    country: "England",
    kit_type: "goalkeeper",
    season: "23/24",
    category: "player_version",
    base_price: 650,
    is_weekly: true,
    badge_options: ["Premier League"],
    description: "Green goalkeeper shirt with wave texture and Sela branding.",
  },
  {
    id: "102",
    file: "02.jpeg",
    extras: ["07.jpeg"],
    slug: "bayer-leverkusen-special",
    name: "Bayer Leverkusen Special",
    club: "Bayer Leverkusen",
    country: "Germany",
    kit_type: "special",
    season: "Recent",
    category: "player_version",
    base_price: 620,
    is_weekly: true,
    badge_options: ["Bundesliga", "Champions League"],
    description: "Charcoal Werkself shirt with pink micro-dot detailing.",
  },
  {
    id: "103",
    file: "03.jpeg",
    slug: "newcastle-away-24-25",
    name: "Newcastle United Away 24/25",
    club: "Newcastle United",
    country: "England",
    kit_type: "away",
    season: "24/25",
    category: "player_version",
    base_price: 675,
    is_weekly: true,
    badge_options: ["Premier League", "Champions League"],
    description: "Royal blue away shirt with orange Adidas accents.",
  },
  {
    id: "104",
    file: "19.jpeg",
    extras: ["24.jpeg", "04.jpeg"],
    slug: "porto-home-23-24",
    name: "FC Porto Home 23/24",
    club: "FC Porto",
    country: "Portugal",
    kit_type: "home",
    season: "23/24",
    category: "player_version",
    base_price: 640,
    badge_options: ["Primeira Liga", "Champions League"],
    description: "Classic Porto blue-and-white with Super Bock branding.",
  },
  {
    id: "105",
    file: "05.jpeg",
    slug: "scotland-special",
    name: "Scotland Special Edition",
    club: "Scotland",
    country: "Scotland",
    kit_type: "special",
    season: "Recent",
    category: "other",
    base_price: 600,
    badge_options: [],
    description: "Black floral special with teal Adidas shoulder stripes.",
  },
  {
    id: "106",
    file: "06.jpeg",
    slug: "south-africa-home",
    name: "South Africa Home",
    club: "South Africa",
    country: "South Africa",
    kit_type: "home",
    season: "Classic",
    category: "other",
    base_price: 580,
    is_weekly: true,
    badge_options: [],
    description: "Bafana Bafana green home shirt with gold SAFA crest.",
  },
  {
    id: "107",
    file: "08.jpeg",
    slug: "england-umbro-long-sleeve",
    name: "England Umbro Long Sleeve",
    club: "England",
    country: "England",
    kit_type: "retro",
    season: "Classic",
    category: "vintage",
    base_price: 720,
    badge_options: [],
    description: "White long-sleeve Umbro England shirt with navy and red side panels.",
  },
  {
    id: "108",
    file: "09.jpeg",
    slug: "england-away-96",
    name: "England Away 96",
    club: "England",
    country: "England",
    kit_type: "away",
    season: "1996",
    category: "vintage",
    base_price: 700,
    is_weekly: true,
    badge_options: [],
    description: "Indigo Euro 96-era away shirt with Three Lions crest.",
  },
  {
    id: "109",
    file: "10.jpeg",
    slug: "england-home-umbro",
    name: "England Home Umbro",
    club: "England",
    country: "England",
    kit_type: "home",
    season: "Classic",
    category: "other",
    base_price: 650,
    badge_options: [],
    description: "White Umbro home with St George cross shoulder detail.",
  },
  {
    id: "110",
    file: "11.jpeg",
    slug: "chelsea-third-24-25",
    name: "Chelsea Third 24/25",
    club: "Chelsea",
    country: "England",
    kit_type: "third",
    season: "24/25",
    category: "player_version",
    base_price: 680,
    is_weekly: true,
    badge_options: ["Premier League", "Conference League"],
    description: "White third kit with pink and black centre stripe.",
  },
  {
    id: "111",
    file: "12.jpeg",
    slug: "germany-away-90s",
    name: "Germany Away 90s",
    club: "Germany",
    country: "Germany",
    kit_type: "away",
    season: "1990s",
    category: "vintage",
    base_price: 710,
    badge_options: [],
    description: "Teal Adidas Equipment away with German flag sleeve stripes.",
  },
  {
    id: "112",
    file: "13.jpeg",
    slug: "arsenal-home-11-12",
    name: "Arsenal Home 11/12",
    club: "Arsenal",
    country: "England",
    kit_type: "home",
    season: "11/12",
    category: "vintage",
    base_price: 620,
    is_weekly: true,
    badge_options: ["Premier League", "FA Cup"],
    description: "125th anniversary red home with white sleeves and Fly Emirates.",
  },
  {
    id: "113",
    file: "14.jpeg",
    slug: "france-home-94-96",
    name: "France Home 94/96",
    club: "France",
    country: "France",
    kit_type: "home",
    season: "94/96",
    category: "vintage",
    base_price: 740,
    badge_options: [],
    description: "Royal blue lace-up Adidas classic with rooster crest.",
  },
  {
    id: "114",
    file: "33.jpeg",
    extras: ["15.jpeg"],
    slug: "sporting-home-03-04",
    name: "Sporting CP Home 03/04",
    club: "Sporting CP",
    country: "Portugal",
    kit_type: "home",
    season: "03/04",
    category: "vintage",
    base_price: 590,
    badge_options: ["Primeira Liga"],
    description: "Green and white hoops with Banco Espírito Santo branding.",
  },
  {
    id: "115",
    file: "16.jpeg",
    slug: "man-utd-away-sharp",
    name: "Manchester United Away Sharp",
    club: "Manchester United",
    country: "England",
    kit_type: "away",
    season: "1990s",
    category: "vintage",
    base_price: 760,
    is_weekly: true,
    badge_options: ["Premier League"],
    description: "Navy Umbro away with white pinstripes and Sharp digital.",
  },
  {
    id: "116",
    file: "17.jpeg",
    slug: "al-nassr-away-23-24",
    name: "Al-Nassr Away 23/24",
    club: "Al-Nassr",
    country: "Saudi Arabia",
    kit_type: "away",
    season: "23/24",
    category: "player_version",
    base_price: 630,
    badge_options: [],
    description: "Away shirt from the recent Al-Nassr drop.",
  },
  {
    id: "117",
    file: "18.jpeg",
    slug: "bayer-leverkusen-away-21-22",
    name: "Bayer Leverkusen Away 21/22",
    club: "Bayer Leverkusen",
    country: "Germany",
    kit_type: "away",
    season: "21/22",
    category: "vintage",
    base_price: 560,
    badge_options: ["Bundesliga"],
    description: "Werkself away from the 21/22 season.",
  },
  {
    id: "118",
    file: "20.jpeg",
    slug: "porto-third-23-24",
    name: "FC Porto Third 23/24",
    club: "FC Porto",
    country: "Portugal",
    kit_type: "third",
    season: "23/24",
    category: "player_version",
    base_price: 640,
    badge_options: ["Primeira Liga"],
    description: "Porto third kit from the 23/24 collection.",
  },
  {
    id: "119",
    file: "21.jpeg",
    slug: "brazil-away-22",
    name: "Brazil Away 22",
    club: "Brazil",
    country: "Brazil",
    kit_type: "away",
    season: "2022",
    category: "player_version",
    base_price: 690,
    is_weekly: true,
    badge_options: [],
    description: "Brazil away shirt from the 2022 cycle.",
  },
  {
    id: "120",
    file: "22.jpeg",
    slug: "germany-home-02-04",
    name: "Germany Home 02/04",
    club: "Germany",
    country: "Germany",
    kit_type: "home",
    season: "02/04",
    category: "vintage",
    base_price: 700,
    badge_options: [],
    description: "White Germany home retro from the early 2000s.",
  },
  {
    id: "121",
    file: "23.jpeg",
    slug: "portugal-away-90-92",
    name: "Portugal Away 90/92",
    club: "Portugal",
    country: "Portugal",
    kit_type: "away",
    season: "90/92",
    category: "vintage",
    base_price: 680,
    badge_options: [],
    description: "Portugal away retro with classic 90s cut.",
  },
  {
    id: "122",
    file: "25.jpeg",
    slug: "liverpool-away-97-98",
    name: "Liverpool Away 97/98",
    club: "Liverpool",
    country: "England",
    kit_type: "away",
    season: "97/98",
    category: "vintage",
    base_price: 720,
    badge_options: ["Premier League"],
    description: "Liverpool away from the late 90s.",
  },
  {
    id: "123",
    file: "26.jpeg",
    slug: "liverpool-centenary-away-91-92",
    name: "Liverpool Centenary Away 91/92",
    club: "Liverpool",
    country: "England",
    kit_type: "away",
    season: "91/92",
    category: "vintage",
    base_price: 750,
    badge_options: [],
    description: "Centenary-era Liverpool away shirt.",
  },
  {
    id: "124",
    file: "27.jpeg",
    slug: "chelsea-home-97-99",
    name: "Chelsea Home 97/99",
    club: "Chelsea",
    country: "England",
    kit_type: "home",
    season: "97/99",
    category: "vintage",
    base_price: 710,
    is_weekly: true,
    badge_options: ["Premier League"],
    description: "Blue Chelsea home from the late 90s.",
  },
  {
    id: "125",
    file: "28.jpeg",
    slug: "arsenal-away-04-05",
    name: "Arsenal Away 04/05",
    club: "Arsenal",
    country: "England",
    kit_type: "away",
    season: "04/05",
    category: "vintage",
    base_price: 690,
    badge_options: ["Premier League", "FA Cup"],
    description: "Arsenal away from the mid-2000s.",
  },
  {
    id: "126",
    file: "29.jpeg",
    slug: "liverpool-home-85-86",
    name: "Liverpool Home 85/86",
    club: "Liverpool",
    country: "England",
    kit_type: "home",
    season: "85/86",
    category: "vintage",
    base_price: 780,
    badge_options: [],
    description: "Classic red Liverpool home from the mid-80s.",
  },
  {
    id: "127",
    file: "30.jpeg",
    slug: "liverpool-candy-away-91-92",
    name: "Liverpool Candy Away 91/92",
    club: "Liverpool",
    country: "England",
    kit_type: "away",
    season: "91/92",
    category: "vintage",
    base_price: 760,
    badge_options: [],
    description: "Candy-sponsored Liverpool away classic.",
  },
  {
    id: "128",
    file: "31.jpeg",
    slug: "chelsea-away-03-04",
    name: "Chelsea Away 03/04",
    club: "Chelsea",
    country: "England",
    kit_type: "away",
    season: "03/04",
    category: "vintage",
    base_price: 670,
    badge_options: ["Premier League"],
    description: "Chelsea away from the early Roman era.",
  },
  {
    id: "129",
    file: "32.jpeg",
    slug: "newcastle-away-97-98",
    name: "Newcastle United Away 97/98",
    club: "Newcastle United",
    country: "England",
    kit_type: "away",
    season: "97/98",
    category: "vintage",
    base_price: 700,
    badge_options: ["Premier League"],
    description: "Newcastle away from the late 90s.",
  },
  {
    id: "130",
    file: "34.jpeg",
    slug: "bayern-70s-home",
    name: "Bayern Munich 70s Home",
    club: "Bayern Munich",
    country: "Germany",
    kit_type: "home",
    season: "1970s",
    category: "vintage",
    base_price: 800,
    price_on_request: true,
    availability_status: "check_required",
    badge_options: [],
    description: "Rare 70s-era Bayern home shirt.",
  },
  {
    id: "131",
    file: "35.jpeg",
    slug: "arsenal-home-90-92",
    name: "Arsenal Home 90/92",
    club: "Arsenal",
    country: "England",
    kit_type: "home",
    season: "90/92",
    category: "vintage",
    base_price: 730,
    badge_options: [],
    description: "Early 90s Arsenal home classic.",
  },
  {
    id: "132",
    file: "36.jpeg",
    slug: "man-utd-home-00-02",
    name: "Manchester United Home 00/02",
    club: "Manchester United",
    country: "England",
    kit_type: "home",
    season: "00/02",
    category: "vintage",
    base_price: 720,
    is_weekly: true,
    badge_options: ["Premier League", "Champions League"],
    description: "Red United home from the early 2000s.",
  },
  {
    id: "133",
    file: "37.jpeg",
    slug: "ac-milan-away-06-07",
    name: "AC Milan Away 06/07",
    club: "AC Milan",
    country: "Italy",
    kit_type: "away",
    season: "06/07",
    category: "vintage",
    base_price: 690,
    badge_options: ["Serie A", "Champions League"],
    description: "AC Milan away from the Champions League winning cycle.",
  },
  {
    id: "134",
    file: "38.jpeg",
    slug: "newcastle-home-95-97",
    name: "Newcastle United Home 95/97",
    club: "Newcastle United",
    country: "England",
    kit_type: "home",
    season: "95/97",
    category: "vintage",
    base_price: 740,
    is_weekly: true,
    badge_options: ["Premier League"],
    description: "Iconic black-and-white Newcastle home.",
  },
  {
    id: "135",
    file: "39.jpeg",
    slug: "ac-milan-third-95-96",
    name: "AC Milan Third 95/96",
    club: "AC Milan",
    country: "Italy",
    kit_type: "third",
    season: "95/96",
    category: "vintage",
    base_price: 710,
    badge_options: ["Serie A"],
    description: "Milan third kit from the mid-90s.",
  },
  {
    id: "136",
    file: "40.jpeg",
    slug: "ac-milan-third-06-07",
    name: "AC Milan Third 06/07",
    club: "AC Milan",
    country: "Italy",
    kit_type: "third",
    season: "06/07",
    category: "vintage",
    base_price: 680,
    badge_options: ["Serie A", "Champions League"],
    description: "Milan third from 06/07.",
  },
  {
    id: "137",
    file: "41.jpeg",
    slug: "bayern-home-95-97",
    name: "Bayern Munich Home 95/97",
    club: "Bayern Munich",
    country: "Germany",
    kit_type: "home",
    season: "95/97",
    category: "vintage",
    base_price: 730,
    badge_options: ["Bundesliga"],
    description: "Red Bayern home from the mid-90s.",
  },
  {
    id: "138",
    file: "42.jpeg",
    slug: "bayern-home-05-07",
    name: "Bayern Munich Home 05/07",
    club: "Bayern Munich",
    country: "Germany",
    kit_type: "home",
    season: "05/07",
    category: "vintage",
    base_price: 700,
    badge_options: ["Bundesliga", "Champions League"],
    description: "Bayern home from the mid-2000s.",
  },
  {
    id: "139",
    file: "44.jpeg",
    extras: ["43.jpeg"],
    slug: "ajax-away-01-02",
    name: "Ajax Away 01/02",
    club: "Ajax",
    country: "Netherlands",
    kit_type: "away",
    season: "01/02",
    category: "vintage",
    base_price: 670,
    badge_options: ["Eredivisie"],
    description: "Ajax away with matching back view in gallery.",
  },
];

function uuid(n) {
  return `11111111-1111-1111-1111-${String(n).padStart(12, "0")}`;
}

function skuBase(slug) {
  return slug.replace(/-/g, "").toUpperCase();
}

function escapeSql(s) {
  return s.replace(/'/g, "''");
}

// wipe products dir
fs.mkdirSync(productsDir, { recursive: true });
for (const f of fs.readdirSync(productsDir)) {
  fs.unlinkSync(path.join(productsDir, f));
}

const copied = [];
for (const p of products) {
  const files = [p.file, ...(p.extras || [])];
  const paths = [];
  files.forEach((file, idx) => {
    const src = path.join(previewDir, file);
    if (!fs.existsSync(src)) throw new Error(`Missing ${file}`);
    const outName = idx === 0 ? `${p.slug}.jpg` : `${p.slug}-${idx + 1}.jpg`;
    fs.copyFileSync(src, path.join(productsDir, outName));
    paths.push(`/products/${outName}`);
  });
  copied.push({ ...p, paths });
}

const demo = `import type { ProductWithVariants } from "@/lib/types";

export const WEEKLY_COLLECTION_UPDATED_AT = "2026-11-16T08:00:00Z";

/** Local catalog used when Supabase env vars are not configured. */
export const DEMO_PRODUCTS: ProductWithVariants[] = [
${copied
  .map((p, i) => {
    const id = uuid(p.id);
    const weekly = p.is_weekly ?? false;
    const por = p.price_on_request ?? false;
    const avail = p.availability_status ?? "available";
    const badges = JSON.stringify(p.badge_options ?? []);
    const paths = p.paths.map((x) => `"${x}"`).join(", ");
    return `  {
    id: "${id}",
    name: ${JSON.stringify(p.name)},
    slug: "${p.slug}",
    description: ${JSON.stringify(p.description)},
    club: ${JSON.stringify(p.club)},
    country: ${JSON.stringify(p.country)},
    kit_type: "${p.kit_type}",
    season: ${JSON.stringify(p.season)},
    category: "${p.category}",
    base_price: ${p.base_price},
    price_on_request: ${por},
    image_path: "${p.paths[0]}",
    image_paths: [${paths}],
    is_weekly: ${weekly},
    availability_status: "${avail}",
    badge_options: ${badges},
    printing_enabled: true,
    active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-11-16T00:00:00Z",
    product_variants: makeVariants(
      "${id}",
      "${skuBase(p.slug)}",
    ),
  }`;
  })
  .join(",\n")}
];

function makeVariants(productId: string, skuBase: string) {
  return (["S", "M", "L", "XL", "XXL"] as const).map((size) => ({
    id: \`\${productId.slice(0, 8)}-var-\${size.toLowerCase()}\`,
    product_id: productId,
    size,
    sku: \`\${skuBase}-\${size}\`,
    stock: size === "M" || size === "L" ? 24 : 12,
    price_override: null as number | null,
  }));
}
`;

fs.writeFileSync(path.join(root, "src/lib/demo-data.ts"), demo);

const seedValues = copied
  .map((p) => {
    const id = uuid(p.id);
    const badges = escapeSql(JSON.stringify(p.badge_options ?? []));
    const pathsSql = `array[${p.paths.map((x) => `'${x}'`).join(",")}]`;
    return `  ('${id}', '${escapeSql(p.name)}', '${p.slug}', '${escapeSql(p.description)}', '${escapeSql(p.club)}', '${escapeSql(p.country)}', '${p.kit_type}', '${escapeSql(p.season)}', '${p.category}', ${p.base_price.toFixed(2)}, ${p.price_on_request ?? false}, '${p.paths[0]}', ${pathsSql}, ${p.is_weekly ?? false}, '${p.availability_status ?? "available"}', '${badges}'::jsonb, true, true)`;
  })
  .join(",\n");

const seed = `-- Seed catalog for Middle Men (run after schema + migrations)
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
${seedValues};

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
`;

fs.writeFileSync(path.join(root, "supabase/seed.sql"), seed);

const clubs = [...new Set(copied.map((p) => p.club))].sort();
console.log(`products: ${copied.length}`);
console.log(`images: ${fs.readdirSync(productsDir).length}`);
console.log(`clubs: ${clubs.join(", ")}`);
fs.writeFileSync(
  path.join(root, ".tmp-kit-preview/clubs.json"),
  JSON.stringify(clubs, null, 2),
);
