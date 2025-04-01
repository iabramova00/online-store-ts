// src/pages/ProductsPage.tsx
const ProductsPage: React.FC = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Our Products
        </h1>
        <p className="text-center text-gray-600">
          This is a protected route. Only logged-in users can see this.
        </p>
      </div>
    );
  };
  
  export default ProductsPage;
  