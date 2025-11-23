# Contributing to BookHub 2.0

Thank you for your interest in contributing to BookHub 2.0! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/BookHub_2.0.git
   cd BookHub_2.0
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Changes**
   - Follow the existing code style
   - Write clear, commented code
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Backend
   cd backend
   npm test  # If tests exist
   npm run dev

   # Frontend
   cd frontend
   npm start
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   # or
   git commit -m "fix: Fix bug description"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Backend (Node.js/Express)

- Use async/await for asynchronous operations
- Follow RESTful API conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors properly
- Validate input data

**Example:**
```javascript
// Good
async function getUserById(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
}

// Bad
function getUser(id) {
  return User.findById(id);
}
```

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names
- Extract reusable logic to custom hooks
- Follow React best practices
- Use Tailwind CSS for styling

**Example:**
```javascript
// Good
const BookCard = ({ book, onAddToCart }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <button onClick={() => onAddToCart(book)}>Add to Cart</button>
    </div>
  );
};

// Bad
const BookCard = (props) => {
  return <div>{props.book.title}</div>;
};
```

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test edge cases
- Test error handling

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation
- Add inline comments for complex logic

## 🔍 Code Review Process

1. All pull requests require review
2. Address review comments
3. Ensure CI checks pass
4. Get approval before merging

## 🎯 Areas for Contribution

### High Priority
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Improve error handling
- [ ] Add input validation
- [ ] Performance optimization
- [ ] Security improvements

### Features
- [ ] Email notifications
- [ ] File upload for book covers
- [ ] Advanced search
- [ ] Book preview
- [ ] Reading progress tracking
- [ ] Social sharing
- [ ] Multi-language support

### Documentation
- [ ] API documentation improvements
- [ ] Code examples
- [ ] Tutorial videos
- [ ] Architecture diagrams

## ❓ Questions?

- Open an issue for questions
- Check existing documentation
- Review code comments

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to BookHub 2.0! 🎉**

