import MealList from "@/components/MealList";

export type MealBrief = {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
};

type FilterResponse = {
  meals: MealBrief[] | null;
};

type Props = { params: { category: string } };

export default async function CategoryPage(props: unknown) {
  const { params } = props as Props;           
  const { category } = params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
      category
    )}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch meals for category ${category}`);
  }

  const data: FilterResponse = await res.json();
  const meals = data.meals ?? [];

  return (
    <div>
      <h1 className="text-5xl text-center mt-2 text-green-950 font-black">
        Meals in {category}
      </h1>

      {meals.length > 0 ? (
        <MealList meals={meals} />
      ) : (
        <p className="text-center mt-6 text-green-900">No Meals found for {category}</p>
      )}
    </div>
  );
}
