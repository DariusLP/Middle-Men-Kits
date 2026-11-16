import { ShopCatalogue } from "@/components/shop/shop-catalogue";
import {
  getClubs,
  getCountries,
  getProducts,
  getSeasons,
} from "@/lib/products";

export const metadata = {
  title: "Shop",
};

type SearchParams = Promise<{
  tab?: string;
  club?: string;
  country?: string;
  kit?: string;
  season?: string;
  price?: string;
}>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [products, clubs, countries, seasons] = await Promise.all([
    getProducts(),
    getClubs(),
    getCountries(),
    getSeasons(),
  ]);

  return (
    <ShopCatalogue
      products={products}
      clubs={clubs}
      countries={countries}
      seasons={seasons}
      initial={{
        tab: params.tab || "weekly",
        club: params.club || "",
        country: params.country || "",
        season: params.season || "",
        kit: params.kit || "",
        price: params.price || "",
      }}
    />
  );
}
