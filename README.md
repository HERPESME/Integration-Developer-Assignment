# Apify Integration Web Application

A professional web application that demonstrates seamless integration with the Apify platform, allowing users to authenticate, browse actors, configure inputs dynamically, and execute actor runs with real-time feedback.

## 🚀 Features

### Core Functionality
- **Secure Authentication**: API key-based authentication with the Apify platform.
- **Dynamic Actor Discovery**: Browse and select from your available Apify actors.
- **Runtime Schema Loading**: Dynamically fetch and render actor input schemas.
- **Interactive Form Generation**: Auto-generate forms based on JSON schema specifications.
- **Real-time Execution**: Execute actors and display results with comprehensive feedback.
- **Modern UI/UX**: Sleek, responsive dark-themed interface built with React and Tailwind CSS for a professional user experience.

### Technical Highlights
- **Security First**: API keys handled securely via a backend proxy, never stored client-side.
- **Error Handling**: Comprehensive error handling with user-friendly messages.
- **Type Safety**: Full TypeScript implementation for robust, maintainable code.
- **Performance**: Optimized API calls with clear loading states.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## 📸 Screenshots

*A glimpse of the modern, dark-themed interface.*

*(Placeholder for screenshot of the API Key Form)*
**Caption: Secure API Key Authentication**

*(Placeholder for screenshot of the Actor Selector)*
**Caption: Responsive Actor Selection Grid**

*(Placeholder for screenshot of the Schema Form)*
**Caption: Dynamic Input Schema Form**

*(Placeholder for screenshot of the Results Display)*
**Caption: Comprehensive Results Display**

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
- **Styling**: Tailwind CSS for a modern, utility-first design system.
- **Forms**: `react-hook-form` for performant and flexible form handling.
- **State Management**: React hooks for local state management
- **API Client**: Axios for HTTP requests with proper error handling

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Security**: Helmet for security headers, CORS for cross-origin requests
- **Rate Limiting**: Express rate limiter to prevent abuse
- **API Integration**: Secure proxy to the Apify API with robust error handling.
- **Validation**: Server-side validation of all incoming data.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- An Apify account with an API key.

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



## 🎯 Usage Guide

### Step 1: Authentication
- Enter your Apify API key into the secure authentication form.
- The application validates your key and fetches your available actors.

### Step 2: Actor Selection
- Browse your actors in a responsive grid, with clear indicators for public/private status.
- Select an actor to proceed to the configuration step.

### Step 3: Input Configuration
- The application dynamically loads the actor's input schema and generates a user-friendly form.
- Required fields are clearly marked and validated in real-time.
- The UI supports various input types, including strings, numbers, booleans (as toggle switches), arrays, and objects.

### Step 4: Execution & Results
- Execute the actor with your configured inputs.
- Monitor the execution status and view comprehensive results in a clean, readable format.
- Download results as a JSON file or copy individual items to your clipboard.

## 🧪 Testing

For testing purposes, I recommend using one of these popular public actors:

1. **Web Scraper** (`apify/web-scraper`)
   - Great for testing complex input schemas with various data types.

2. **Google Search Scraper** (`apify/google-search-scraper`)
    - Simple input schema, ideal for quick execution tests.

3. **Website Content Crawler** (`apify/website-content-crawler`)
   - Good for testing URL validation and crawling functionality.

## 🐛 Troubleshooting

Encountered an issue? Here are some common problems and their solutions.

### "Invalid API Key" or "Failed to authenticate"
This error appears if the API key you've entered is incorrect or doesn't have the required permissions.

**Solution:**
1.  Double-check that you have copied the API key correctly from your [Apify Account Integrations](https://console.apify.com/account/integrations) page.
2.  Ensure there are no extra spaces or characters.
3.  Verify that your Apify account is active.

### "The provided input does not match the actor schema requirements"
This error occurs when the data you've entered into the actor's input form does not meet the validation rules defined by the actor's developer.

**Solution:**
-   **Check Required Fields**: Ensure all fields marked with a red asterisk (`*`) are filled out. The "Required Fields" panel on the right side of the screen lists all mandatory inputs.
-   **Verify Data Types**: Make sure you are entering the correct type of data (e.g., a number for a numeric field, text for a string field).
-   **Correct Formatting**: Some fields require specific formats, such as a valid JSON object or a full URL (`https://...`). Review the field's description for guidance.
-   **Check Value Ranges**: If the field has minimum or maximum value requirements, ensure your input falls within that range.

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

-   **API Key Protection**: Keys are transmitted securely and never stored in `localStorage` or exposed on the client-side.
-   **CORS Configuration**: Properly configured Cross-Origin Resource Sharing to restrict access.
-   **Rate Limiting**: Protection against API abuse and brute-force attacks.
-   **Input Validation**: All inputs are validated on both the client and server.
-   **Security Headers**: `Helmet.js` is used for security-focused HTTP headers.

## 🚀 Deployment

### Frontend Deployment
The React application can be deployed to any static hosting service like Vercel, Netlify, or AWS S3.

```bash
cd client
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment
The Express server can be deployed to any Node.js hosting service like Heroku, Render, or AWS Elastic Beanstalk.

```bash
cd server
# Set production environment variables
# Deploy to your hosting service
```



## 🎯 Future Enhancements

- **Actor Run History**: View and manage previous actor executions.
- **Batch Execution**: Run multiple actors simultaneously.
- **Scheduled Runs**: Set up recurring actor executions.
- **Advanced Filtering**: Filter actors by category, performance, etc.
- **Real-time Updates**: WebSocket integration for live run status updates.
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
