import React, { useState } from "react";
import axios, { AxiosError } from "axios"; // Import AxiosError explicitly
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Props {
  bookId: string;
  onReviewSubmitted: () => void; // callback to refresh book
}

const ReviewForm: React.FC<Props> = ({ bookId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(5); // Explicitly type state
  const [comment, setComment] = useState<string>(""); // Explicitly type state
  const [error, setError] = useState<string>(""); // Explicitly type state
  const [hoverRating, setHoverRating] = useState<number>(0); // For hover effect on stars

  const token = useSelector((state: RootState) => state.user.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (!comment.trim()) {
        setError("Please enter a comment.");
        return;
    }


    try {
      await axios.post(
        // Assuming you have a proxy setup or use full URL
        // If no proxy: `http://localhost:5000/api/books/${bookId}/reviews`
        `/api/books/${bookId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRating(5); // Reset form
      setComment("");
      onReviewSubmitted(); // Notify parent to refresh
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>; // Adjust type based on your API error structure
      // Prefer 'message' if available from backend validation, fallback to 'error' or generic message
      const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || "Failed to submit review. Please try again.";
      setError(errorMessage);
      console.error("Review submission error:", err); // Log the full error for debugging
    }
  };

  return (
    // Removed bg-gray-50 and p-4. Added border-t and margins.
    <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-200 pt-8 mt-12">
      {/* Matched heading style with ProductDetails "Description" */}
      <h3 className="text-xl font-semibold mb-4 text-primary">Leave a Review</h3>

      {/* Star Rating Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button" // Important: Prevent form submission on star click
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className={`text-3xl cursor-pointer transition-colors duration-150 ease-in-out ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Comment Textarea */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="comment"
          className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition" // Added focus styles matching ProductDetails
          placeholder="Write your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {/* Submit Button - Styled like "Add to Cart" */}
      <button
        type="submit"
        className="px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow hover:bg-accent-dark transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50" // Matched style, added focus offset and disabled state
        disabled={!comment.trim()} // Disable if comment is empty
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
