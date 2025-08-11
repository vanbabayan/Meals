'use client';

import { useSearch, Meal } from "./SearchContext";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';

export function GlobalSearch() {
  const { query, setQuery, results, isLoading } = useSearch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto mb-10" ref={ref}>
      <input
        type="text"
        placeholder="Search meals..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-lg border border-green-900/30 p-3 text-lg text-green-950 placeholder-green-900/50 shadow-sm focus:border-green-900 focus:ring-2 focus:ring-green-900/40 transition"
      />
      {open && (
        <ul className="absolute z-20 w-full mt-1 rounded-lg bg-white border border-green-900/20 shadow-lg max-h-64 overflow-auto">
          {isLoading && <li className="px-4 py-2 text-green-900/70">Loading...</li>}
          {!isLoading && results.length === 0 && query.trim() && (
            <li className="px-4 py-2 text-green-900/70">No meals found</li>
          )}
          {!isLoading &&
            results.slice(0, 5).map((meal: Meal) => (
              <li
                key={meal.idMeal}
                className="hover:bg-green-900/5 transition"
              >
                <Link
                  href={`/meal/${meal.idMeal}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="h-10 w-10 rounded object-cover border border-green-900/20"
                  />
                  <span className="text-green-950 font-medium">{meal.strMeal}</span>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
