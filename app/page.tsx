import { GlobalSearch } from "@/components/GlobalSearch";
import Link from "next/link";

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

type CategoriesResponse = {
  categories: Category[];
};


export default async function HomePage() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php', { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch categories");

  const data: CategoriesResponse = await res.json();

  return (
    <div className="container mx-auto px-6 py-10 bg-white min-h-screen">
      
      <h1 className="text-center text-4xl font-extrabold text-green-950 mb-10">
        Meal Categories
      </h1>
      
      <GlobalSearch />
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {data.categories.map(item => (
          <li
            key={item.idCategory}
            className="bg-green-50 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
          >
            <img
              src={item.strCategoryThumb}
              alt={item.strCategory}
              className="rounded-t-lg object-cover w-full h-48"
              loading="lazy"
            />

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="italic font-extrabold text-2xl text-green-900 mb-3">
                {item.strCategory}
              </h2>
              <p className="text-green-800 text-sm flex-grow mb-4">
                {item.strCategoryDescription.slice(0, 250)}…
              </p>
              <Link
                href={`/category/${item.strCategory}`}
                className="self-start text-green-950 font-semibold hover:text-green-700 transition-colors duration-200"
              >
                View meals &rarr;
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
