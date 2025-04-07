import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
}

const AdminBookManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-accent">Manage Books</h1>
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
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">${book.price.toFixed(2)}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookManager;
