
# 🐾 Fetch Dog Finder

A modern web application for finding adoptable dogs, built with React, TypeScript, and Vite.

![Dog Finder Screenshot](https://via.placeholder.com/800x450?text=Dog+Finder+App)

## 🚀 Features

- **Search & Filter**: Find dogs by breed, age range, and location
- **Advanced Sorting**: Sort results by breed, name, age, or location
- **Favorites**: Save dogs you're interested in for later viewing
- **Match Generation**: Get matched with a dog based on your favorites
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **API Status Monitoring**: Check the availability of the backend service

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **UI Components**: Custom components with React Select for advanced inputs
- **HTTP Client**: Axios
- **Development**: ESLint for code quality

## 🏗️ Project Structure

```
fetch-dog-finder/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components (Login, Search, Favorites)
│   ├── services/         # API service functions
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── [config files]        # Configuration files
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/fetch-dog-finder.git
   cd fetch-dog-finder
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser to `https://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🧪 Testing

The project uses Vitest, React Testing Library, and Jest DOM for testing:

```bash
# Run tests
npm test
```

## 📱 API Integration

The application integrates with the Fetch API service:
- Base URL: `https://frontend-take-home-service.fetch.com`
- Authentication: Cookie-based
- Endpoints:
  - `/dogs/breeds` - Get all dog breeds
  - `/dogs/search` - Search for dogs with filters
  - `/dogs` - Get dogs by ID
  - `/dogs/match` - Generate a match based on favorites

## 🔒 Security Features

- HTTPS development server with local certificates
- Secure cookie handling for authentication
- API availability monitoring

## 🧩 Key Components

### Pages
- **LoginPage**: User authentication
- **SearchPage**: Main search interface with filters
- **FavoritesPage**: View and manage favorite dogs
- **ApiStatusPage**: Check API service status

### State Management
- **useFavorites**: Zustand store for managing favorite dogs

## 👨‍💻 For Reviewers

### Code Quality
- TypeScript is used throughout with strict type checking
- ESLint is configured for code quality
- Component structure follows React best practices

### Performance Considerations
- Pagination for dog search results
- Efficient state management with Zustand
- Optimized rendering with proper React patterns

### Future Improvements
- Add comprehensive test coverage
- Implement more advanced filtering options
- Add user profiles and saved searches
- Improve accessibility features
- Add offline support with service workers

## 📄 License

[MIT](LICENSE)
