'use client';

import Image from "next/image";
import BackBtn from "@/components/BackBtn";

type Meal = {
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
};

export default async function MealPage({ params }: { params: { id: string } }) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`);
  const data = await res.json();
  const meal: Meal = data.meals[0];

  return <MealDetail meal={meal} />;
}

function MealDetail({ meal }: { meal: Meal }) {
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
        <strong>Category:</strong> <span>{meal.strCategory}</span>{" "}
        <strong>Area:</strong> <span>{meal.strArea}</span>
      </p>

      <div className="w-full h-72 relative rounded overflow-hidden mb-6 shadow-md">
        {meal.strMealThumb && (
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            className="object-cover"
          />
        )}
      </div>

      <h2 className="text-2xl font-semibold text-green-900 mb-3">Ingredients</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 list-disc list-inside text-green-800">
        {ingredients.map((item, idx) => (
          <li key={idx}>
            {item.ingredient} — {item.measure}
          </
