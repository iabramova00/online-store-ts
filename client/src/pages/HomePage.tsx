import HeroCarousel from "../components/HeroCarousel";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Optional Welcome Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to The Bookmark
        </h1>
        <p className="text-lg text-gray-700">
          Discover your next favorite book from our curated collection.
        </p>
      </section>
      <HeroCarousel />
    </div>
  );
};

export default HomePage;
