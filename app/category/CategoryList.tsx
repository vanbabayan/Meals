'use client';

import MealList from "@/components/MealList";

type MealBrief = {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
};

interface CategoryListProps {
  category: string;
  meals: MealBrief[] | null;
}

export default function CategoryList({ category, meals }: CategoryListProps) {
  if (!meals) {
    return <p>No Meals found for category {category}</p>;
  }

  return <MealList meals={meals} />;
}
