
# 🐾 Fetch Dog Finder

A modern web application for finding adoptable dogs, built with React, TypeScript, and Vite.

🌐 Live Demo: https://dog-finder-app-six.vercel.app
📂 GitHub Repository: https://github.com/divyamsaraf/dog-finder.git

## 🚀 Features

- **User Authentication**: Secure login with name and email
- **Search & Filter**: Find dogs by breed, age range, and location
- **Advanced Sorting**: Sort results by breed, name, age, or location (ascending or descending)
- **Pagination**: Browse through search results efficiently
- **Favorites**: Save dogs you're interested in for later viewing
- **Match Generation**: Get matched with a dog based on your favorites
- **Random Match**: Discover a random dog if you're not sure what you're looking for
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **API Status Monitoring**: Check the availability of the backend service

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **UI Components**: Material UI (MUI) v5
- **HTTP Client**: Axios
- **Development**: ESLint for code quality
- **Deployment**: Vercel

## 🏗️ Project Structure

```
fetch-dog-finder/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── domain/       # Domain-specific components (DogCard, MatchedDogDialog)
│   │   └── ui/           # Generic UI components
│   ├── pages/            # Page components (Login, Search, Favorites, ApiStatus)
│   ├── services/         # API service functions
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Theme and global styles
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
  - `/auth/login` - Authenticate user with name and email
  - `/auth/logout` - Log out the current user
  - `/dogs/breeds` - Get all dog breeds
  - `/dogs/search` - Search for dogs with filters
  - `/dogs` - Get dogs by ID
  - `/dogs/match` - Generate a match based on favorites
  - `/locations` - Get location information

## 🔒 Security Features

- HTTPS development server with local certificates
- Secure cookie handling for authentication
- API availability monitoring

## 🧩 Key Components

### Pages
- **LoginPage**: User authentication with name and email
- **SearchPage**: Main search interface with filters, sorting, and pagination
- **FavoritesPage**: View and manage favorite dogs
- **ApiStatusPage**: Check API service status

### Components
- **DogCard**: Display dog information with favorite toggle
- **Filters**: Search filters for breed, age, and location
- **MatchedDogDialog**: Display matched dog with details
- **FavoriteButton**: Toggle favorite status for a dog

### State Management
- **useFavorites**: Zustand store for managing favorite dogs
  - Add/remove favorites
  - Check if a dog is favorited
  - Clear all favorites
  - Persist favorites in local storage

## 🌟 Core Functionality

### Authentication Flow
1. Users enter their name and email on the login page
2. Credentials are sent to the API for authentication
3. Upon successful login, users are redirected to the search page
4. Authentication state is maintained with cookies

### Search and Filter
1. Users can search for dogs by breed, age range, and location
2. Results can be sorted by breed, name, age, or location
3. Sort direction can be toggled between ascending and descending
4. Results are paginated for better performance

### Favorites and Matching
1. Users can add dogs to their favorites from search results
2. Favorites are stored in local storage for persistence
3. Users can generate a match based on their favorites
4. A random match can be generated for users who are undecided

## 👨‍💻 For Reviewers

### Code Quality
- TypeScript is used throughout with strict type checking
- ESLint is configured for code quality
- Component structure follows React best practices
- Custom hooks for reusable logic

### Performance Considerations
- Pagination for dog search results
- Efficient state management with Zustand
- Optimized rendering with proper React patterns
- Lazy loading of images

### Future Improvements
- Add comprehensive test coverage
- Implement more advanced filtering options
- Add user profiles and saved searches
- Improve accessibility features
- Add offline support with service workers
- Implement analytics to track user behavior

## 📄 License

[MIT](LICENSE)
