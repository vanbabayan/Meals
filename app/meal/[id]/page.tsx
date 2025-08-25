import BackBtn from '@/components/BackBtn';
import Image from 'next/image';

interface MealDetailData {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string | undefined;
}

export default async function MealPage({ params }: any) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`
  );
  const data = await res.json();
  const meal: MealDetailData = data.meals[0];

  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({ ingredient, measure: measure || '' });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="absolute top-4 left-4 z-20">
        <BackBtn />
      </div>
      <h1 className="text-3xl font-bold mb-4">{meal.strMeal}</h1>
      <Image
        src={meal.strMealThumb}
        alt={meal.strMeal}
        width={500}
        height={300}
        className="rounded-lg mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
      <ul className="mb-4">
        {ingredients.map((item, index) => (
          <li key={index}>
            {item.ingredient} - {item.measure}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
      <p>{meal.strInstructions}</p>
    </div>
  );
}
