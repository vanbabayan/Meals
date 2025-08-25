import Image from "next/image";
import Link from "next/link";

export default async function MealPage(props: unknown) {
  const { params } = props as { params: { id: string } };
  const { id } = params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch meal with id ${id}`);
  }

  const data = await res.json();
  const meal = data?.meals?.[0] ?? null;

  const ingredients: { ingredient: string; measure: string }[] = [];
  if (meal) {
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const meas = meal[`strMeasure${i}`];
      if (ing && typeof ing === "string" && ing.trim()) {
        ingredients.push({ ingredient: ing.trim(), measure: (meas ?? "").trim() });
      }
    }
  }

  const categoryHref =
    meal?.strCategory && meal.strCategory.trim()
      ? `/category/${encodeURIComponent(meal.strCategory)}`
      : "/";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 relative">
      <div className="absolute top-4 left-4 z-20">
        <Link href={categoryHref} className="text-green-900 font-semibold hover:underline">
          ← Back
        </Link>
      </div>

      {!meal ? (
        <div className="py-20 text-center text-green-900">
          <h2 className="text-2xl font-bold">Meal not found</h2>
          <p className="mt-2">This meal does not exist or could not be loaded.</p>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-green-900 mb-4">{meal.strMeal}</h1>

          <p className="mb-4 text-green-800 space-x-4">
            <strong>Category:</strong> <span>{meal.strCategory}</span>
            <strong className="ml-4">Area:</strong> <span>{meal.strArea}</span>
          </p>

          <div className="w-full h-72 relative rounded overflow-hidden mb-6 shadow-md">
            {meal.strMealThumb?.trim() && (
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal ?? "Meal image"}
                fill
                className="object-cover"
              />
            )}
          </div>

          <h2 className="text-2xl font-semibold text-green-900 mb-3">Ingredients</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 list-disc list-inside text-green-800">
            {ingredients.length > 0 ? (
              ingredients.map((item, idx) => (
                <li key={item.ingredient + idx}>
                  {item.ingredient} — {item.measure}
                </li>
              ))
            ) : (
              <li>No ingredients listed</li>
            )}
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
        </>
      )}
    </div>
  );
}
