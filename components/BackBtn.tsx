"use client";

import { useRouter } from "next/navigation";

export default function BackBtn() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/", { scroll: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      ←
    </button>
  );
}
