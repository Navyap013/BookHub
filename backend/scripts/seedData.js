const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const User = require('../models/User');
const Class = require('../models/Class');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookhub2';

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel about the Jazz Age and the American Dream.",
    category: "Fiction",
    language: "English",
    price: 299,
    originalPrice: 399,
    discount: 25,
    stock: 50,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    publisher: "Scribner",
    pages: 180,
    rating: { average: 4.5, count: 120 },
    featured: true,
    trending: true,
    tags: ["classic", "literature", "american"]
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    category: "Fiction",
    language: "English",
    price: 349,
    originalPrice: 449,
    discount: 22,
    stock: 40,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    publisher: "J.B. Lippincott & Co.",
    pages: 281,
    rating: { average: 4.8, count: 200 },
    featured: true,
    trending: true,
    tags: ["classic", "literature", "drama"]
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarian control.",
    category: "Fiction",
    language: "English",
    price: 279,
    originalPrice: 349,
    discount: 20,
    stock: 60,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    publisher: "Secker & Warburg",
    pages: 328,
    rating: { average: 4.6, count: 150 },
    featured: true,
    tags: ["dystopian", "science-fiction", "classic"]
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.",
    category: "Fiction",
    language: "English",
    price: 249,
    originalPrice: 299,
    discount: 17,
    stock: 45,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    publisher: "T. Egerton",
    pages: 432,
    rating: { average: 4.7, count: 180 },
    trending: true,
    tags: ["romance", "classic", "literature"]
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A controversial novel about teenage rebellion and alienation.",
    category: "Fiction",
    language: "English",
    price: 269,
    originalPrice: 329,
    discount: 18,
    stock: 35,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    publisher: "Little, Brown and Company",
    pages: 234,
    rating: { average: 4.3, count: 95 },
    recentlyAdded: true,
    tags: ["coming-of-age", "literature"]
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "An exploration of how Homo sapiens came to dominate Earth.",
    category: "Non-Fiction",
    language: "English",
    price: 499,
    originalPrice: 599,
    discount: 17,
    stock: 30,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    publisher: "Harper",
    pages: 443,
    rating: { average: 4.5, count: 250 },
    featured: true,
    trending: true,
    tags: ["history", "anthropology", "science"]
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical novel about a young Andalusian shepherd's journey.",
    category: "Fiction",
    language: "English",
    price: 199,
    originalPrice: 249,
    discount: 20,
    stock: 80,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    publisher: "HarperTorch",
    pages: 163,
    rating: { average: 4.4, count: 300 },
    trending: true,
    tags: ["philosophy", "inspirational", "adventure"]
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description: "The first book in the magical Harry Potter series.",
    category: "Fiction",
    language: "English",
    price: 399,
    originalPrice: 499,
    discount: 20,
    stock: 100,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    publisher: "Bloomsbury",
    pages: 223,
    rating: { average: 4.9, count: 500 },
    featured: true,
    trending: true,
    tags: ["fantasy", "children", "magic"]
  }
];

const sampleStudentBooks = [
  {
    title: "Mathematics for Class 1",
    author: "NCERT",
    description: "Comprehensive mathematics textbook for Class 1 students with colorful illustrations and fun activities.",
    class: "Class 1",
    subject: "Mathematics",
    language: "English",
    price: 150,
    originalPrice: 200,
    discount: 25,
    stock: 100,
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    publisher: "NCERT",
    pages: 120,
    rating: { average: 4.5, count: 50 },
    featured: true,
    tags: ["math", "class1", "ncert"]
  },
  {
    title: "English Reader Class 2",
    author: "NCERT",
    description: "Engaging English reader with stories, poems, and activities for Class 2 students.",
    class: "Class 2",
    subject: "English",
    language: "English",
    price: 180,
    originalPrice: 220,
    discount: 18,
    stock: 90,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    publisher: "NCERT",
    pages: 150,
    rating: { average: 4.6, count: 45 },
    featured: true,
    tags: ["english", "class2", "ncert"]
  },
  {
    title: "Science Explorer Class 3",
    author: "NCERT",
    description: "Interactive science book that makes learning fun for Class 3 students.",
    class: "Class 3",
    subject: "Science",
    language: "English",
    price: 200,
    originalPrice: 250,
    discount: 20,
    stock: 85,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    publisher: "NCERT",
    pages: 180,
    rating: { average: 4.7, count: 60 },
    featured: true,
    tags: ["science", "class3", "ncert"]
  },
  {
    title: "ABC Fun Book",
    author: "Early Learning Publishers",
    description: "Colorful alphabet book with big letters and fun pictures for Pre-KG children.",
    class: "Pre-KG",
    subject: "English",
    language: "English",
    price: 99,
    originalPrice: 149,
    discount: 33,
    stock: 150,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    publisher: "Early Learning",
    pages: 40,
    rating: { average: 4.8, count: 80 },
    isPreKG: true,
    ageGroup: "2-3",
    featured: true,
    tags: ["alphabet", "prekg", "colors"]
  },
  {
    title: "Numbers 1-10",
    author: "Early Learning Publishers",
    description: "Fun number book with counting activities and colorful illustrations for Pre-KG.",
    class: "Pre-KG",
    subject: "Mathematics",
    language: "English",
    price: 99,
    originalPrice: 149,
    discount: 33,
    stock: 150,
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    publisher: "Early Learning",
    pages: 35,
    rating: { average: 4.7, count: 75 },
    isPreKG: true,
    ageGroup: "2-3",
    featured: true,
    tags: ["numbers", "prekg", "counting"]
  },
  {
    title: "Shapes and Colors",
    author: "Early Learning Publishers",
    description: "Interactive book teaching shapes and colors with big, colorful images.",
    class: "Pre-KG",
    subject: "Art",
    language: "English",
    price: 99,
    originalPrice: 149,
    discount: 33,
    stock: 150,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    publisher: "Early Learning",
    pages: 30,
    rating: { average: 4.9, count: 90 },
    isPreKG: true,
    ageGroup: "2-3",
    featured: true,
    tags: ["shapes", "colors", "prekg"]
  },
  {
    title: "Social Studies Class 5",
    author: "NCERT",
    description: "Comprehensive social studies textbook covering history, geography, and civics.",
    class: "Class 5",
    subject: "Social Studies",
    language: "English",
    price: 250,
    originalPrice: 300,
    discount: 17,
    stock: 70,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    publisher: "NCERT",
    pages: 200,
    rating: { average: 4.4, count: 40 },
    featured: true,
    tags: ["social-studies", "class5", "ncert"]
  },
  {
    title: "Mathematics Class 10",
    author: "NCERT",
    description: "Complete mathematics textbook for Class 10 with solved examples and practice problems.",
    class: "Class 10",
    subject: "Mathematics",
    language: "English",
    price: 350,
    originalPrice: 400,
    discount: 13,
    stock: 60,
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    publisher: "NCERT",
    pages: 350,
    rating: { average: 4.6, count: 100 },
    featured: true,
    tags: ["math", "class10", "ncert"]
  }
];

const sampleClasses = [
  { name: "Pre-KG", description: "Pre-Kindergarten for ages 2-3", ageGroup: "2-3", subjects: ["English", "Mathematics", "Art"] },
  { name: "LKG", description: "Lower Kindergarten", ageGroup: "3-4", subjects: ["English", "Mathematics", "Art"] },
  { name: "UKG", description: "Upper Kindergarten", ageGroup: "4-5", subjects: ["English", "Mathematics", "Science"] },
  { name: "Class 1", description: "First Grade", ageGroup: "5-6", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 2", description: "Second Grade", ageGroup: "6-7", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 3", description: "Third Grade", ageGroup: "7-8", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 4", description: "Fourth Grade", ageGroup: "8-9", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 5", description: "Fifth Grade", ageGroup: "9-10", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 6", description: "Sixth Grade", ageGroup: "10-11", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 7", description: "Seventh Grade", ageGroup: "11-12", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 8", description: "Eighth Grade", ageGroup: "12-13", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 9", description: "Ninth Grade", ageGroup: "13-14", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 10", description: "Tenth Grade", ageGroup: "14-15", subjects: ["English", "Mathematics", "Science", "Social Studies"] },
  { name: "Class 11", description: "Eleventh Grade", ageGroup: "15-16", subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology"] },
  { name: "Class 12", description: "Twelfth Grade", ageGroup: "16-17", subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology"] }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Book.deleteMany({});
    // await StudentBook.deleteMany({});
    // await Class.deleteMany({});

    // Seed Classes
    console.log('Seeding Classes...');
    for (const classData of sampleClasses) {
      await Class.findOneAndUpdate(
        { name: classData.name },
        classData,
        { upsert: true, new: true }
      );
    }
    console.log('Classes seeded successfully');

    // Seed Books
    console.log('Seeding Books...');
    for (const bookData of sampleBooks) {
      await Book.findOneAndUpdate(
        { title: bookData.title, author: bookData.author },
        bookData,
        { upsert: true, new: true }
      );
    }
    console.log('Books seeded successfully');

    // Seed Student Books
    console.log('Seeding Student Books...');
    for (const bookData of sampleStudentBooks) {
      await StudentBook.findOneAndUpdate(
        { title: bookData.title, class: bookData.class },
        bookData,
        { upsert: true, new: true }
      );
    }
    console.log('Student Books seeded successfully');

    console.log('\n✅ Database seeded successfully!');
    console.log(`📚 ${sampleBooks.length} books added`);
    console.log(`📖 ${sampleStudentBooks.length} student books added`);
    console.log(`🎓 ${sampleClasses.length} classes added`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

