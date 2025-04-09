import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import ProductCard from "../components/ProductCard";
import PaginationControls from "../components/PaginationControls";
import SidebarFilter from "../components/SidebarFilter";
import { RootState } from "../store/store";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const { token } = useAuth();
  //const dispatch = useDispatch();

  // Local states for API data
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Get filters from Redux state
  const { searchTerm, selectedCategory, selectedTag, sortBy } = useSelector(
    (state: RootState) => state.filters
  );

  useEffect(() => {
    const controller = new AbortController();
    const delayDebounce = setTimeout(() => {
      const fetchBooks = async () => {
        try {
          setLoading(true);
          setError(null);

          const url = new URL("http://localhost:5000/api/books");

          if (searchTerm) url.searchParams.append("search", searchTerm);
          if (selectedCategory !== "All")
            url.searchParams.append("category", selectedCategory);
          if (selectedTag !== "All")
            url.searchParams.append("tag", selectedTag);
          if (sortBy) url.searchParams.append("sort", sortBy);
          url.searchParams.append("page", page.toString());
          url.searchParams.append("limit", "16");

          const res = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Failed to fetch books");

          const data = await res.json();
          setBooks(data.books);
          setPages(data.pages);
          if (data.books.length === 0) setError("No books found.");
        } catch (err: unknown) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setTimeout(() => setLoading(false), 150);
        }
      };

      fetchBooks();
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [token, searchTerm, selectedCategory, selectedTag, sortBy, page]);

  return (
    <section className="flex flex-col min-h-full pr-6">
      {/* Your exact layout: Sidebar (1fr) + Content (4fr) */}
      <div className="grid grid-cols-[1fr_4fr] gap-8 flex-grow">
        
        {/* Sidebar - remains unchanged */}
        <SidebarFilter />
  
        {/* Main content area (Our Books + Cards + Pagination) */}
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold text-primary text-left border-b-2 border-primary pt-6 mb-6">
            Our Books
          </h1>
  
          {error && <p className="text-center text-red-500">{error}</p>}
  
          <AnimatePresence mode="wait">
            <motion.div
              key={page + searchTerm + selectedCategory + selectedTag + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col flex-grow"
            >
              {/* This is your exact product grid layout, untouched */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 pr-2">
                {loading ? (
                  <div className="col-span-full text-center py-12">Loading...</div>
                ) : (
                  books.map((book, index) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ProductCard {...book} />
                    </motion.div>
                  ))
                )}
              </div>
  
              {/* Keep this at bottom of content, just above footer */}
              <div className="mt-auto pb-8">
                <PaginationControls page={page} pages={pages} setPage={setPage} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
