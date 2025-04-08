import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tags = ["All", "Bestseller", "Trending", "New Release"];

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

  // Reset page to 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  useEffect(() => {
    const controller = new AbortController();

    const delayDebounce = setTimeout(() => {
      const fetchBooks = async () => {
        try {
          setLoading(true);
          setError(null);

          const url = new URL("http://localhost:5000/api/books");
          if (searchTerm) url.searchParams.append("search", searchTerm);
          if (selectedCategory !== "All") url.searchParams.append("category", selectedCategory);
          if (selectedTag !== "All") url.searchParams.append("tag", selectedTag);
          url.searchParams.append("page", page.toString());
          url.searchParams.append("limit", "10");

          const res = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Failed to fetch books");

          const data = await res.json();
          setBooks(data.books);
          setPages(data.pages);

          if (data.books.length === 0) {
            setError("No books found.");
          } else {
            setError(null);
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setTimeout(() => setLoading(false), 150); // smooth fade
        }
      };

      fetchBooks();
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [token, searchTerm, selectedCategory, selectedTag, page]);

  const getPaginationRange = () => {
    const totalPageNumbers = 9;
    const siblingCount = 1;
  
    const range = (start: number, end: number): number[] =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);
  
    if (pages <= totalPageNumbers) return range(1, pages);
  
    const leftSiblingIndex = Math.max(page - siblingCount, 2);
    const rightSiblingIndex = Math.min(page + siblingCount, pages - 1);
  
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < pages - 1;
  
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  
    const pagination: (number | "...")[] = [1];
  
    if (shouldShowLeftDots) pagination.push("...");
    pagination.push(...middleRange);
    if (shouldShowRightDots) pagination.push("...");
    pagination.push(pages);
  
    return pagination;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-10">
        Our Books
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">No books available.</p>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-primary/5 p-4 rounded-xl space-y-6 sticky top-24 self-start h-fit">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Category</h3>
            <ul className="space-y-1 text-sm">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setPage(1);
                    setSelectedCategory(cat);
                  }}
                  className={`cursor-pointer px-2 py-1 rounded-md ${selectedCategory === cat
                      ? "bg-accent text-white"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Tag Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Tag</h3>
            <ul className="flex flex-wrap gap-2 text-sm">
              {tags.map((tag) => (
                <li
                  key={tag}
                  onClick={() => {
                    setPage(1);
                    setSelectedTag(tag);
                  }}
                  className={`cursor-pointer px-3 py-1 rounded-full border ${selectedTag === tag
                      ? "bg-accent text-white"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
            {books.map((book) => (
              <Link to={`/product/${book._id}`} key={book._id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full">
                  <div className="w-full h-80 flex items-center justify-center overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-base text-gray-600 mb-3 line-clamp-1">
                        {book.author}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-accent">
                      {book.price.toFixed(2)} лв.
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex flex-wrap items-center justify-center mt-10 gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={page === 1}
              >
                Prev
              </button>

              {getPaginationRange().map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="px-3 py-1 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 border rounded ${page === p ? "bg-accent text-white" : "hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={page === pages}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
