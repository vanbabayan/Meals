import Image from "next/image";
import BackBtn from "@/components/BackBtn";

type MealDetail = {
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

type LookupResponse = {
  meals: MealDetail[];
};

type Params = {
  params: Promise<{ id: string }>;
};

export default async function MealPage({ params }: Params) {
  const { id } = await params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Failed to fetch meal with id ${id}`);

  const data: LookupResponse = await res.json();

  if (!data.meals || data.meals.length === 0) {
    return <p className="text-center mt-10 text-red-600">No Meal Found with ID {id}.</p>;
  }

  const meal = data.meals[0];

  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push({ ingredient: ing, measure: meas ?? "" });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="absolute top-4 left-4 z-20">
        <BackBtn />
      </div>
      <h1 className="text-4xl font-extrabold text-green-900 mb-4">{meal.strMeal}</h1>

      <p className="mb-4 text-green-800 space-x-4">
        <strong>Category:</strong> <span>{meal.strCategory}</span>
        <strong>Area:</strong> <span>{meal.strArea}</span>
      </p>

      <div className="w-full h-72 relative rounded overflow-hidden mb-6 shadow-md">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>

      <h2 className="text-2xl font-semibold text-green-900 mb-3">Ingredients</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 list-disc list-inside text-green-800">
        {ingredients.map((item, idx) => (
          <li key={idx}>
            {item.ingredient} — {item.measure}
          </li>
        ))}
      </ul>

      {meal.strYoutube && (
        <a
          href={meal.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-green-900 font-semibold hover:text-green-700 transition-colors duration-200 underline"
        >
          ▶ Watch on YouTube
        </a>
      )}
    </div>
  );
}
