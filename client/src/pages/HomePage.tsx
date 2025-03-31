const HomePage = () => {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8">
        <h1 className="text-4xl text-primary font-heading mb-4">Welcome to MyStore</h1>
        <p className="text-lg text-gray-700 font-body max-w-xl">
          Discover great products with a calming experience and clear calls to action.
        </p>
        <button className="mt-6 bg-accent hover:bg-highlight text-white font-medium py-2 px-6 rounded-lg shadow-md transition">
          Shop Now
        </button>
      </main>
    );
  };
  
  export default HomePage;
  