// Utility function for image placeholders
export const getImagePlaceholder = (type = 'book') => {
  const placeholders = {
    book: 'https://via.placeholder.com/400x600/0ea5e9/ffffff?text=Book+Cover',
    studentBook: 'https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Student+Book',
    user: 'https://via.placeholder.com/200x200/0ea5e9/ffffff?text=User',
    prekg: 'https://via.placeholder.com/400x600/ec4899/ffffff?text=Pre-KG+Book'
  };
  return placeholders[type] || placeholders.book;
};

export const handleImageError = (e, placeholder) => {
  e.target.src = placeholder || getImagePlaceholder();
};

