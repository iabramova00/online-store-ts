import React from "react";

interface Props {
  reviews: {
    _id?: string;
    name?: string;
    rating: number;
    comment?: string;
    createdAt?: string;
  }[];
}

const ReviewList: React.FC<Props> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {reviews.map((review, index) => (
        <div key={review._id || index} className="border-b pb-3">
          <div className="font-semibold">{review.name || "Anonymous"}</div>
          <div className="text-yellow-500 text-sm">
            {"★".repeat(review.rating)}{" "}
            {"☆".repeat(5 - review.rating)}
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <small className="text-gray-400">
            {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
