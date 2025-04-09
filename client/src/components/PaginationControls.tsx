interface PaginationProps {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({
  page,
  pages,
  setPage,
}) => {
  if (pages <= 1) return null;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < pages && setPage(page + 1);

  // Builds the pagination range
  const getPaginationRange = () => {
    const delta = 2; // how many pages before/after current
    const range: (number | "...")[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push("...");
    if (pages > 1) range.push(pages);

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center mt-10 gap-2 flex-wrap"
    >
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`px-3 py- text-xl rounded border transition duration-200 ${
          page === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        }`}
      >
        Previous
      </button>

      {paginationRange.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(Number(p))}
            aria-current={p === page ? "page" : undefined}
            className={`px-3 py-1 text-xl rounded border transition duration-200 ${
              p === page
                ? "bg-accent text-white border-accent"
                : "border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={page === pages}
        className={`px-3 py-1 text-xl rounded border transition duration-200 ${
          page === pages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        }`}
      >
        Next
      </button>
    </nav>
  );
};

export default PaginationControls;
