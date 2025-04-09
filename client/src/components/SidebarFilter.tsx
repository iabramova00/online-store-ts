import React from "react";
import { SortDropdown } from "./sortDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCategory,
  setSelectedTag,
  resetFilters,
  //setSortBy
} from "../store/filterSlice";
import { RootState } from "../store/store";

const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Biographies & Memoirs",
  "Children’s & Educational Books",
  "Business, Economics & Self-Help",
  "Science, Technology & Nature",
  "History, Politics & Society",
  "Art, Design & Literature",
  "Religion, Spirituality & Philosophy",
  "Comics, Manga & Graphic Novels",
];

const tags = ["All", "Bestseller", "Trending", "New Release"];

const SidebarFilter: React.FC = () => {
  const dispatch = useDispatch();

  const { selectedCategory, selectedTag } = useSelector(
    (state: RootState) => state.filters
  );

  return (
    <aside className="bg-primary text-white sticky top-0 px-4 pt-2 space-y-10 self-stretch">
      <div className="pt-6">
        <h3 className="font-semibold text-2xl mb-4">Sort By</h3>
        <SortDropdown />
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-2xl mb-4">Category</h3>
        <ul className="text-xl font-semibold space-y-3">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`cursor-pointer px-3 py-2 rounded transition duration-200 ${selectedCategory === cat
                ? "bg-white text-primary "
                : "hover:bg-teal-500"
                }`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Tag Filter */}
      <div>
        <h3 className="font-semibold text-2xl mb-4">Tag</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => dispatch(setSelectedTag(tag))}
              className={`px-4 py-1 rounded-full border transition duration-200 text-xl font-semibold ${selectedTag === tag
                ? "bg-white text-primary border-white "
                : "border-white hover:bg-teal-500"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => {
            dispatch(resetFilters());
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-full bg-white border-white text-primary text-xl font-semibold py-2 px-4 rounded-full shadow hover:bg-teal-500 hover:text-white transition"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default SidebarFilter;
