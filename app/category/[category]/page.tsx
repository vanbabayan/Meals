import MealsGridWithAutocomplete from "@/components/MealsGridWithAutocomplete";

type MealBrief = {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
};

type FilterResponse = {
  meals: MealBrief[];
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Failed to fetch meals for category ${category}`);

  const data: FilterResponse = await res.json();

  return (
    <div>
      <h1 className="text-5xl text-center mt-2 text-green-950 font-black">
        Meals in {category}
      </h1>
      {data.meals ? (
        <MealsGridWithAutocomplete meals={data.meals} />
      ) : (
        <p>No Meals found for category {category}</p>
      )}
    </div>
  );
}
