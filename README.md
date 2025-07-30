# Apify Integration Web Application

A professional web application that demonstrates seamless integration with the Apify platform, allowing users to authenticate, browse actors, configure inputs dynamically, and execute actor runs with real-time feedback.

## 🚀 Features

### Core Functionality
- **Secure Authentication**: API key-based authentication with Apify platform
- **Dynamic Actor Discovery**: Browse and select from your available Apify actors
- **Runtime Schema Loading**: Dynamically fetch and render actor input schemas
- **Interactive Form Generation**: Auto-generate forms based on JSON schema specifications
- **Real-time Execution**: Execute actors and display results with comprehensive feedback
- **Professional UI/UX**: Modern, responsive interface built with React and Tailwind CSS

### Technical Highlights
- **Security First**: API keys handled securely, never stored client-side
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript implementation for robust development
- **Performance**: Optimized API calls with proper loading states
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Forms**: React Hook Form with Yup validation
- **State Management**: React hooks for local state management
- **API Client**: Axios for HTTP requests with proper error handling

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Security**: Helmet for security headers, CORS for cross-origin requests
- **Rate Limiting**: Express rate limiter to prevent abuse
- **API Integration**: Secure proxy to Apify API with proper error handling
- **Validation**: Input validation and sanitization

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Apify account with API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Integration-Developer-Assignment
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend development server on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000` and enter your Apify API key to get started.

### Manual Setup

If you prefer to start servers individually:

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🔧 Configuration

### Environment Variables

**Backend** (`server/.env`):
```env
PORT=5001
CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Getting Your Apify API Key

1. Visit [Apify Console](https://console.apify.com/account/integrations)
2. Navigate to "Integrations" in your account settings
3. Copy your API token
4. Use this token in the application's authentication form

## 🎯 Usage Guide

### Step 1: Authentication
- Enter your Apify API key in the secure authentication form
- The application will validate your key and fetch your available actors

### Step 2: Actor Selection
- Browse through your available actors with detailed information
- View actor descriptions, run statistics, and visibility status
- Select an actor to proceed to configuration

### Step 3: Input Configuration
- The application dynamically loads the actor's input schema
- Fill out the auto-generated form based on the schema requirements
- Required fields are clearly marked and validated
- Support for various input types: strings, numbers, booleans, arrays, objects

### Step 4: Execution & Results
- Execute the actor with your configured inputs
- Monitor execution status in real-time
- View comprehensive results with download and copy functionality
- Access detailed run statistics and performance metrics

## 🧪 Testing

For testing purposes, I recommend using one of these popular public actors:

1. **Web Scraper** (`apify/web-scraper`)
   - Great for testing complex input schemas
   - Requires URL and CSS selectors

2. **Google Search Results** (`apify/google-search-results`)
   - Simple input schema with search queries
   - Fast execution for quick testing

3. **Website Content Crawler** (`apify/website-content-crawler`)
   - Good for testing URL validation
   - Produces structured output data

## 🎨 Design Decisions

### User Experience
- **Progressive Disclosure**: Information revealed step-by-step to avoid overwhelming users
- **Clear Navigation**: Breadcrumb-style navigation with back buttons
- **Immediate Feedback**: Loading states and error messages for all actions
- **Responsive Design**: Optimized for both desktop and mobile usage

### Technical Architecture
- **Separation of Concerns**: Clear separation between frontend and backend responsibilities
- **Security by Design**: API keys never stored in frontend, secure proxy pattern
- **Type Safety**: Full TypeScript implementation prevents runtime errors
- **Error Boundaries**: Comprehensive error handling at all levels

### Performance Optimizations
- **Lazy Loading**: Components loaded only when needed
- **Efficient Re-renders**: Optimized React hooks usage
- **API Caching**: Intelligent caching of actor schemas
- **Bundle Optimization**: Tree-shaking and code splitting

## 📁 Project Structure

```
Integration-Developer-Assignment/
├── client/                     # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ApiKeyForm.tsx
│   │   │   ├── ActorSelector.tsx
│   │   │   ├── SchemaForm.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorAlert.tsx
│   │   ├── services/          # API services
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main application component
│   │   └── index.tsx          # Application entry point
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── package.json           # Frontend dependencies
├── server/                     # Node.js backend
│   ├── index.js               # Express server
│   ├── .env.example           # Environment variables template
│   └── package.json           # Backend dependencies
├── package.json               # Root package.json with scripts
└── README.md                  # This file
```

## 🔒 Security Considerations

- **API Key Protection**: Keys are transmitted securely and never stored in localStorage
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: All inputs validated on both client and server
- **Security Headers**: Helmet.js for security-focused HTTP headers

## 🚀 Deployment

### Frontend Deployment
The React application can be deployed to any static hosting service:

```bash
cd client
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment
The Express server can be deployed to any Node.js hosting service:

```bash
cd server
# Set production environment variables
# Deploy to your hosting service
```

### Environment Configuration
Update the `REACT_APP_API_URL` environment variable to point to your production backend URL.

## 🎯 Future Enhancements

- **Actor Run History**: View and manage previous actor executions
- **Batch Execution**: Run multiple actors simultaneously
- **Scheduled Runs**: Set up recurring actor executions
- **Advanced Filtering**: Filter actors by category, performance, etc.
- **Real-time Updates**: WebSocket integration for live run status updates
- **Export Options**: Multiple export formats for results (CSV, XML, etc.)

## 🤝 Contributing

This project demonstrates professional development practices:
- Clean, maintainable code structure
- Comprehensive error handling
- Type safety with TypeScript
- Responsive, accessible UI design
- Security-first approach
- Detailed documentation

## 📄 License

MIT License - feel free to use this code for learning and development purposes.

---

**Built with ❤️ for the Apify Integration Developer Assignment**