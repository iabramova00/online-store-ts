import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "../store/store"; // Import RootState

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationDate: string; // Keep as string for form, convert on submit
  format: string;
  numberOfPages: number | string; // Allow string for form input
  image: string;
  category: string;
  description: string;
  price: number | string; // Allow string for form input
  availabilityStatus: string;
}

const categoryOptions = [
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

const defaultFormState = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publicationDate: "", // Keep as string for date input
  format: "Paperback",
  numberOfPages: "", // Keep as string for number input
  image: "",
  category: "", // Default to empty string for controlled select
  description: "",
  price: "", // Keep as string for number input
  availabilityStatus: "In Stock",
};

const AdminBookManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...defaultFormState });

  // Get token from Redux store
  const token = useSelector((state: RootState) => state.user.token);

  const fetchBooks = async () => {
    setLoading(true); // Ensure loading is true at the start
    setError(""); // Clear previous errors
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      setBooks([]); // Ensure books is an empty array if no token
      return;
    }

    try {
      // Use the token from Redux state
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response for /api/books:", res.data); // Log the response data

      // Defensive check: Ensure the response data is an array
      // Check if the response has a 'books' property and if it's an array
      if (res.data && Array.isArray(res.data.books)) {
        // <--- Checks for res.data.books
        setBooks(res.data.books); // <--- Uses res.data.books
      } else {
        // This block should NOT be hit now, based on your console log
        console.error(
          "API did not return expected object structure with a 'books' array:",
          res.data
        );
        setError("Received invalid data format for books.");
        setBooks([]);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Check console for details.");
      setBooks([]); // Ensure books is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when the component mounts or the token changes
  useEffect(() => {
    fetchBooks();
  }, [token]); // Depend on token

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous form errors

    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    if (!form.category || !categoryOptions.includes(form.category)) {
      return alert("Please select a valid category.");
    }

    // Ensure numeric fields are parsed correctly, handle potential NaN
    const numberOfPagesParsed = parseInt(form.numberOfPages as string, 10);
    const priceParsed = parseFloat(form.price as string);

    if (isNaN(numberOfPagesParsed) || numberOfPagesParsed <= 0) {
      return alert("Please enter a valid number of pages.");
    }
    if (isNaN(priceParsed) || priceParsed < 0) {
      return alert("Please enter a valid price.");
    }

    const payload = {
      ...form,
      numberOfPages: numberOfPagesParsed,
      price: priceParsed,
      // Ensure date is handled correctly if needed, might not need conversion if backend accepts string
      // publicationDate: new Date(form.publicationDate), // Only if backend expects Date object
    };

    try {
      if (isEditMode && editBookId) {
        await axios.put(
          `http://localhost:5000/api/books/${editBookId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Optional: Check for existing ISBN before adding (can be intensive)
        // const checkRes = await axios.get("http://localhost:5000/api/books", { headers: { Authorization: `Bearer ${token}` }});
        // if (Array.isArray(checkRes.data)) {
        //    const existingISBN = checkRes.data.find((b: Book) => b.isbn === form.isbn);
        //    if (existingISBN) return alert("A book with this ISBN already exists.");
        // }

        await axios.post("http://localhost:5000/api/books", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      await fetchBooks(); // Refresh the book list
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save book:", err);

      // Define expected error response structure
      interface ErrorResponseData {
        message?: string;
        error?: string;
      }

      // Use AxiosError type and type guard for the response data
      let backendError = "An unknown error occurred."; // Default error message
      if (axios.isAxiosError<ErrorResponseData>(err) && err.response?.data) {
        // Prefer 'message' if available, fallback to 'error'
        backendError =
          err.response.data.message || err.response.data.error || backendError;
      } else if (err instanceof Error) {
        // Handle non-Axios errors that are standard Error objects
        backendError = err.message;
      }

      alert(`Error saving book: ${backendError}`);
    }
  };

  const handleEdit = (book: Book) => {
    setForm({
      ...book,
      // Ensure values going into the form are strings
      numberOfPages: book.numberOfPages.toString(),
      price: book.price.toString(),
      // Format date for input type="date" (YYYY-MM-DD)
      publicationDate: book.publicationDate
        ? new Date(book.publicationDate).toISOString().split("T")[0]
        : "",
    });
    setEditBookId(book._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (bookId: string) => {
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }
    // Use window.confirm for simplicity
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistic update: Remove book from state immediately
      // setBooks((prev) => prev.filter((b) => b._id !== bookId));
      // Or fetch books again for consistency:
      await fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Error deleting book. Please check console.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ ...defaultFormState });
    setIsEditMode(false);
    setEditBookId(null);
    setError(""); // Clear errors when closing modal
  };

  // Render logic remains largely the same, but relies on 'books' being an array
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-accent">Manage Books</h1>
        <button
          className="bg-accent hover:bg-highlight text-white font-semibold px-4 py-2 rounded transition"
          onClick={() => {
            setIsEditMode(false);
            setForm({ ...defaultFormState });
            setShowModal(true);
          }} // Reset form state when opening for add
        >
          + Add Book
        </button>
      </div>

            {/* Display loading or error state */}
      {loading ? (
        <p className="text-center py-10">Loading books...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        // Enhanced Table Styling - Added overflow-x-auto
        <div className="shadow overflow-hidden overflow-x-auto border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {/* Headers remain the same */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {books.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No books found. Add a new book to get started!
                      </td>
                  </tr>
              ) : (
                  books.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      {/* Removed whitespace-nowrap from Title */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</div>
                      </td>
                      {/* Removed whitespace-nowrap from Author */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">{book.author}</div>
                      </td>
                      {/* Kept whitespace-nowrap for Price (usually short) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${typeof book.price === 'number' ? book.price.toFixed(2) : 'N/A'}
                        </div>
                      </td>
                      {/* Removed whitespace-nowrap from Category */}
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {book.category}
                      </td>
                      {/* Kept whitespace-nowrap for Actions (buttons are fixed width) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-accent hover:text-highlight transition-colors duration-150"
                          title="Edit book"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors duration-150"
                          title="Delete book"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal remains largely the same, ensure form state is handled correctly */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-accent mb-4">
              {isEditMode ? "Edit Book" : "Add New Book"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input fields - ensure 'value' uses form state */}
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Title"
                  className="input"
                />
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  placeholder="Author"
                  className="input"
                />
                <input
                  name="isbn"
                  value={form.isbn}
                  onChange={handleChange}
                  required
                  placeholder="ISBN"
                  className="input"
                  disabled={isEditMode}
                />{" "}
                {/* Disable ISBN edit */}
                <input
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  required
                  placeholder="Publisher"
                  className="input"
                />
                <input
                  name="publicationDate"
                  type="date"
                  value={form.publicationDate}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <select
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option>Paperback</option>
                  <option>Hardcover</option>
                  <option>eBook</option>
                </select>
                <input
                  name="numberOfPages"
                  type="number"
                  value={form.numberOfPages}
                  onChange={handleChange}
                  required
                  placeholder="Pages"
                  className="input"
                  min="1"
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="" disabled>
                    Select category...
                  </option>{" "}
                  {/* Added disabled default option */}
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                  className="input"
                  min="0"
                />
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  required
                  placeholder="Image URL"
                  className="input"
                />
                {form.image /* Simple image preview */ && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-24 h-auto object-contain mt-2 rounded shadow"
                  />
                )}
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                  <option>Pre-Order</option>
                </select>
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Description"
                className="input w-full" // Use input class for consistency
              />

              {/* Display form-specific errors */}
              {/* {error && <p className="text-red-600 text-sm">{error}</p>} */}

              <div className="flex justify-end pt-2 space-x-3">
                <button
                  type="button" // Important: type="button" for cancel
                  onClick={handleCloseModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-highlight text-white font-semibold px-4 py-2 rounded"
                >
                  {isEditMode ? "Save Changes" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookManager;
