import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  format: string;
  numberOfPages: number;
  image: string;
  category: string;
  description: string;
  price: number;
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
  publicationDate: "",
  format: "Paperback",
  numberOfPages: "",
  image: "",
  category: "",
  description: "",
  price: "",
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

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.category || !categoryOptions.includes(form.category)) {
      return alert("Please select a valid category.");
    }

    const payload = {
      ...form,
      numberOfPages: parseInt(form.numberOfPages),
      price: parseFloat(form.price),
      publicationDate: new Date(form.publicationDate),
    };

    try {
      if (isEditMode && editBookId) {
        await axios.put(`http://localhost:5000/api/books/${editBookId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const checkRes = await axios.get("http://localhost:5000/api/books");
        const existingISBN = checkRes.data.find((b: Book) => b.isbn === form.isbn);
        if (existingISBN) return alert("A book with this ISBN already exists.");

        await axios.post("http://localhost:5000/api/books", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      await fetchBooks();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save book:", err);
      alert("Error saving book.");
    }
  };

  const handleEdit = (book: Book) => {
    setForm({
      ...book,
      numberOfPages: book.numberOfPages.toString(),
      price: book.price.toString(),
      publicationDate: book.publicationDate?.split("T")[0] || "",
    });
    setEditBookId(book._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Error deleting book.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ ...defaultFormState });
    setIsEditMode(false);
    setEditBookId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-accent">Manage Books</h1>
        <button
          className="bg-accent hover:bg-highlight text-white font-semibold px-4 py-2 rounded transition"
          onClick={() => setShowModal(true)}
        >
          + Add Book
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">${book.price.toFixed(2)}</td>
                <td className="p-3">{book.category}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(book._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-accent mb-4">
              {isEditMode ? "Edit Book" : "Add New Book"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Title" className="input" />
                <input name="author" value={form.author} onChange={handleChange} required placeholder="Author" className="input" />
                <input name="isbn" value={form.isbn} onChange={handleChange} required placeholder="ISBN" className="input" />
                <input name="publisher" value={form.publisher} onChange={handleChange} required placeholder="Publisher" className="input" />
                <input name="publicationDate" type="date" value={form.publicationDate} onChange={handleChange} required className="input" />
                <select name="format" value={form.format} onChange={handleChange} required className="input">
                  <option>Paperback</option>
                  <option>Hardcover</option>
                  <option>eBook</option>
                </select>
                <input name="numberOfPages" type="number" value={form.numberOfPages} onChange={handleChange} required placeholder="Pages" className="input" />
                <select name="category" value={form.category} onChange={handleChange} required className="input">
                  <option value="">Select category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input name="price" type="number" step="0.5" value={form.price} onChange={handleChange} required placeholder="Price" className="input" />
                <input name="image" type="url" value={form.image} onChange={handleChange} required placeholder="Image URL" className="input" />
                {form.image && (
                  <img src={form.image} alt="Preview" className="w-24 h-32 object-cover mt-2 rounded shadow" />
                )}
                <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} required className="input">
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
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
              />

              <div className="flex justify-end pt-2">
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
