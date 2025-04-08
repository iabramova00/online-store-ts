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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const delayDebounce = setTimeout(() => {
      const fetchBooks = async () => {
        try {
          setLoading(true);         // Reset loading
          setError(null);           // Clear any previous error

          const res = await fetch(
            `http://localhost:5000/api/books?search=${encodeURIComponent(searchTerm)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          );

          if (!res.ok) throw new Error("Failed to fetch books");

          const data = await res.json();

          if (data.length === 0) {
            setError("No books found.");
          } else {
            setError(null); // clear again just in case
          }

          setBooks(data);
        } catch (err: unknown) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setTimeout(() => setLoading(false), 150); // ✨ avoid flicker
        }
      };

      fetchBooks();
    }, 300); // debounce

    return () => {
      clearTimeout(delayDebounce);
      controller.abort(); // abort previous fetch
    };
  }, [token, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-primary mb-10">
        Our Books
      </h1>

      {/* {loading && <p className="text-center">Loading...</p>} */}
      {/* {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
          <span className="text-accent font-medium">Loading books...</span>
        </div>
      )} */}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">No books available.</p>
      )}

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <Link to={`/product/${book._id}`} key={book._id}>
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
            >
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

                <p className="text-lg font-bold text-accent">{book.price.toFixed(2)} лв.</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
