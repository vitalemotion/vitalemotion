"use client";

interface ProductFiltersProps {
  activeCategory: string;
  activeType: string;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

const categories = ["Todos", "Libros", "Digital", "Materiales"];
const types = ["Todos", "Fisico", "Digital"];

export default function ProductFilters({
  activeCategory,
  activeType,
  onCategoryChange,
  onTypeChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <div className="flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary hover:text-text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="sm:ml-auto flex gap-3 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeType === t
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
