import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  isbn: string;
  publisher: string;
  numberOfPages: number;
  publicationDate: string;
  language?: string;
  format: string;
  availabilityStatus: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then((res) => res.json())
      .then(setBook)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (!book) return <p className="text-center mt-12 text-red-500">Book not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      <div className="flex justify-center">
        <img src={book.image} alt={book.title} className="max-h-[500px] object-contain" />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-lg text-gray-700 mb-4">by {book.author}</p>
        <p className="text-2xl font-bold text-accent mb-6">
          {book.price.toFixed(2)} лв.
        </p>
        <p className={`mb-4 font-medium ${book.availabilityStatus === "In Stock" ? "text-green-600" : "text-red-500"}`}>
          {book.availabilityStatus}
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{book.description}</p>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>Pages:</strong> {book.numberOfPages}</p>
          <p><strong>Published:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
          {book.language && <p><strong>Language:</strong> {book.language}</p>}
          <p><strong>Format:</strong> {book.format}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
