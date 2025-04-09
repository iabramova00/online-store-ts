import { Link } from "react-router-dom";

interface ProductCardProps {
  _id: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ _id, title, author, image, price }) => {
  return (
    <Link
      to={`/product/${_id}`}
      aria-label={`View details for ${title}`}
      className="focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] overflow-hidden flex flex-col h-[460px]">
        {/* 📚 Taller image area */}
        <div className="aspect-[2/3] h-[300px] w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 📄 Content area */}
        <div className="p-3 flex flex-col justify-between flex-1">
          <div className="mb-1">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-700 line-clamp-1">{author}</p>
          </div>
          <p className="text-xl font-bold text-accent mt-1">{price.toFixed(2)} лв.</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
