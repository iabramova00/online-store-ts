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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("All");

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

          const res = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Failed to fetch books");

          const data = await res.json();

          if (data.length === 0) {
            setError("No books found.");
          } else {
            setError(null);
          }

          setBooks(data);
        } catch (err: unknown) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setTimeout(() => setLoading(false), 150); // Smooth fade
        }
      };

      fetchBooks();
    }, 300); // debounce

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [token, searchTerm, selectedCategory, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-10">
        Our Books
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">No books available.</p>
      )}

      <div className="flex gap-8">
        {/* SIDEBAR */}
        <aside className="w-64 sticky top-24 h-fit bg-accent/10 p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-accent mb-4">Filter by Category</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md transition font-medium ${selectedCategory === cat
                      ? "bg-accent text-white"
                      : "hover:bg-accent/20 text-accent"
                    }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="max-w-md mb-6">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-accent mb-2">Filter by Tag</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selectedTag === tag
                      ? "bg-accent text-white border-accent"
                      : "border-accent/30 text-accent hover:bg-accent/10"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <Link to={`/product/${book._id}`} key={book._id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
                  <div className="w-full h-80 flex items-center justify-center overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 h-[3em]">
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
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
