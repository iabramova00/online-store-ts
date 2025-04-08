import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/online-store-ts";

const categoryMap: Record<string, string> = {
  fiction: "Fiction",
  nonfiction: "Non-Fiction",
  biography: "Biographies & Memoirs",
  children: "Children’s & Educational Books",
  business: "Business, Economics & Self-Help",
  science: "Science, Technology & Nature",
  history: "History, Politics & Society",
  art: "Art, Design & Literature",
  religion: "Religion, Spirituality & Philosophy",
  comics: "Comics, Manga & Graphic Novels",
};

const categories = Object.keys(categoryMap);
type CategoryKey = keyof typeof categoryMap;

const getRandomTag = (): string | null => {
  const tags = ["Bestseller", "Trending", "New Release", null];
  return tags[Math.floor(Math.random() * tags.length)];
};

const fetchBooksForCategory = async (searchTerm: string) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    searchTerm
  )}&maxResults=40`;
  const response = await axios.get(url);
  return response.data.items || [];
};

// ✅ Updated: richer search terms
const searchTerms: Record<CategoryKey, string[]> = {
  fiction: [
    "award winning fiction",
    "modern literary novels",
    "top rated contemporary fiction",
    // "critically acclaimed novels 2024",
    // "popular fiction books new releases",
    // "literary fiction award winners",
  ],
  nonfiction: [
    "bestselling non-fiction",
    "true stories recent",
    "non-fiction current affairs",
    // "current events nonfiction 2024",
    // "real life inspiring stories",
    // "best nonfiction books 2023 2024",
  ],
  biography: [
    "inspiring life stories",
    "famous autobiographies",
    "modern memoirs",
    // "bestselling memoirs 2024",
    // "celebrity biographies",
    // "autobiographies of inspiring leaders",
  ],
  children: [
    "award winning children's books",
    "interactive early learning books",
    "bedtime stories for ages 3-8",
    // "new children's books 2024",
    // "bestselling picture books",
    // "fun educational books for kids",
  ],
  business: [
    "entrepreneurship and startups",
    "business leadership books",
    "self-help for success and productivity",
    // "business innovation 2024",
    // "entrepreneurship and success",
    // "top business books for professionals",
  ],
  science: [
    "technology and innovation",
    "recent biology discoveries",
    "data science for beginners",
    "climate change and environment",
    // "cutting-edge science books",
    // "ai and technology books",
    // "environmental science trends 2024",
  ],
  history: [
    "modern world history",
    "historical figures biographies",
    "politics and social change",
    // "modern world history books",
    // "historical nonfiction 2023",
    // "history of social movements",
  ],
  art: [
    "modern art and design",
    "classic literature",
    "creative writing",
    // "contemporary art books",
    // "design thinking and creativity",
    // "modern literature and culture",
  ],
  religion: [
    "spirituality and mindfulness",
    "modern philosophy",
    "comparative religion",
    // "mindfulness and spirituality 2024",
    // "philosophy and modern ethics",
    // "world religions explained",
  ],
  comics: [
    "critically acclaimed graphic novels",
    "manga for teens and adults",
    "comic series with strong characters",
    // "new manga releases 2024",
    // "top graphic novels for adults",
    // "bestselling superhero comics",
  ],
};

const seedBooks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    for (const key of categories) {
      const displayCategory = categoryMap[key];
      const queries = searchTerms[key as CategoryKey];
      let results: any[] = [];

      console.log(`🔍 Fetching books for: ${displayCategory}`);

      for (const query of queries) {
        console.log(`   ➤ Searching: "${query}"`);
        const queryResults = await fetchBooksForCategory(query);
        console.log(`     ↳ Fetched ${queryResults.length} books`);
        results = [...results, ...queryResults];
      }

      // ✅ Optional limiter to avoid overflow
      if (results.length > 150) {
        results = results.slice(0, 150);
      }

      console.log(
        `   🔍 ${results.length} raw results found for ${displayCategory}`
      );

      let addedCount = 0;
      let skippedOld = 0;
      let skippedImage = 0;
      let skippedISBN = 0;
      let skippedAuthor = 0;

      for (const item of results) {
        const info = item.volumeInfo;

        const bookData = {
          title: info.title?.substring(0, 120),
          author: info.authors?.join(", ") || "Unknown Author",
          isbn:
            info.industryIdentifiers?.[0]?.identifier ||
            info.industryIdentifiers?.[1]?.identifier ||
            null,
          publisher: info.publisher || "Unknown Publisher",
          publicationDate: info.publishedDate
            ? new Date(info.publishedDate)
            : new Date(),
          format: "Paperback",
          numberOfPages: info.pageCount || 100,
          image:
            info.imageLinks?.thumbnail?.replace("http://", "https://") || null,
          category: displayCategory,
          description: info.description || "No description available.",
          price: parseFloat((Math.random() * 20 + 5).toFixed(2)),
          availabilityStatus: "In Stock",
          tag: getRandomTag(),
        };

        const reasons: string[] = [];

        if (bookData.publicationDate < new Date("2010-01-01")) {
          skippedOld++;
          reasons.push("Too old");
        }
        if (!bookData.image) {
          skippedImage++;
          reasons.push("Missing image");
        }
        if (!bookData.isbn) {
          skippedISBN++;
          reasons.push("Missing ISBN");
        }
        if (bookData.author === "Unknown Author") {
          skippedAuthor++;
          reasons.push("Unknown Author");
        }

        if (reasons.length > 0) {
          console.warn(
            `⚠️ Skipping: ${bookData.title} — ${reasons.join(", ")}`
          );
          continue;
        }

        try {
          const book = new Book(bookData);
          await book.save();
          addedCount++;
        } catch {
          // Duplicate or validation error, silently skipped
        }
      }

      console.log(
        `   ➤ Skipped: too old (${skippedOld}), no image (${skippedImage}), no ISBN (${skippedISBN}), unknown author (${skippedAuthor})`
      );
      console.log(
        `✅ Added ${addedCount} books to category: ${displayCategory}`
      );
    }

    await mongoose.disconnect();
    console.log("✅ Done seeding books.");
  } catch (err) {
    console.error("❌ Error during book seeding:", err);
  }
};

seedBooks();
