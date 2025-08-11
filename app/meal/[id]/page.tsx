import MealDetail from "./MealDetail";

type LookupResponse = {
  meals: MealDetailData[];
};

export type MealDetailData = {
  idMeal: string;
  strMeal: string;
  strMealAlternate: string | null;
  strCategory: string;
  strArea: string;
  strYoutube: string | null;
  strMealThumb: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
};

type Params = {
  params: { id: string };
};

export default async function MealPage({ params }: Params) {
  const { id } = params; 

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Failed to fetch meal with id ${id}`);

  const data: LookupResponse = await res.json();

  if (!data.meals || data.meals.length === 0) {
    return <p className="text-center mt-10 text-red-600">No Meal Found with ID {id}.</p>;
  }

  return <MealDetail meal={data.meals[0]} />;
}
