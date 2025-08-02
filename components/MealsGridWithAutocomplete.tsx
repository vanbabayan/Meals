'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BackBtn from "./BackBtn";

type MealBrief = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type Props = {
  meals: MealBrief[];
};

export default function MealsGridWithAutocomplete({ meals }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showDropDown, setShowDropDown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 8;

  const filtered = useMemo(() =>
    meals.filter(m =>
      m.strMeal.toLowerCase().includes(query.toLowerCase())
    ),
    [meals, query]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const current = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const prev = () => setPage(p => Math.max(1, p - 1));
  const next = () => setPage(p => Math.min(totalPages, p + 1));

  const suggestions = useMemo(() => {
    if (!query) return [];
    return meals
      .filter(m => m.strMeal.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [meals, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4" ref={wrapperRef}>
         <div className="absolute top-4 left-4 z-20">
           <BackBtn />
         </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Meal..."
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setPage(1);
            setShowDropDown(true);
          }}
          onFocus={() => {
            if (query) setShowDropDown(true);
          }}
          className="w-full p-2 mb-4 border rounded"
        />
        {
          showDropDown && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded shadow-md z-10 max-h-48 overflow-y-auto">
              {suggestions.map(meal => (
                <li key={meal.idMeal} className="flex items-center p-2 hover:bg-gray-100">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    width={40}
                    height={40}
                    className="rounded mr-2"
                  />
                  <Link
                    href={`/meal/${meal.idMeal}`}
                    className="text-gray-800 hover:underline"
                    onClick={() => setShowDropDown(false)}
                  >
                    {meal.strMeal}
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      </div>

      
      {filtered.length === 0 ? (
        <p className="text-gray-500 mt-4">No meals found.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {current.map(meal => (
              <li key={meal.idMeal}>
                <Link href={`/meal/${meal.idMeal}`}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "3/2" }}>
                    <Image
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      fill
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 text-center">{meal.strMeal}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              disabled={page === 1}
              className="px-4 py-2 bg-green-900 text-white rounded    cursor-pointer transition-colors duration-300
            hover:bg-white hover:text-green-900
            disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:text-white   
              disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span>{page} / {totalPages}</span>
            <button
              onClick={next}
              disabled={page === totalPages}
             className="px-4 py-2 bg-green-900 text-white rounded    cursor-pointer transition-colors duration-300
            hover:bg-white hover:text-green-900
            disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:text-white   
              disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
