import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  coverImage?: string;
}

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
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

    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-accent mb-8">
        Admin Book Manager
      </h1>

      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && books.length === 0 && <p>No books available.</p>}

      {!loading && books.length > 0 && (
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-accent text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Genre</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {books.map((book) => (
              <tr key={book._id} className="border-t">
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.genre}</td>
                <td className="p-3 space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
