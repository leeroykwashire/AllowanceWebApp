# ReactJS Frontend Execution Context

## Project Overview
This document provides context and guidelines for developing the ReactJS frontend for the Zimbabwean Money Transfer Web App. It outlines the architectural choices, state management strategy, API integration, and design principles to be followed throughout the project.

## Architectural Choices
- **Framework:** ReactJS (with Vite for fast development and build)
- **State Management:** Redux Toolkit (RTK) for predictable and scalable state management
- **API Integration:** RTK Query for efficient, declarative data fetching and caching from the Django REST API backend
- **Directory Structure:** Modular and feature-based folder organization for maintainability

## State Management & API Connection
- **Redux Toolkit:**
  - Centralized store for all global state (user, transactions, ads, FX rates)
  - Slices for each major feature (auth, transactions, ads, rates)
- **RTK Query:**
  - Define API services for all backend endpoints
  - Automatic caching, invalidation, and refetching
  - Handles loading, error, and success states for all API calls
  - Simplifies data flow between backend and UI components

## Design Principles
- **Clean, Modern UI:**
  - Use a consistent design system (e.g., Material UI, Chakra UI, or custom components)
  - Responsive layouts for desktop and mobile
  - Clear visual hierarchy and intuitive navigation
  - Accessible color schemes and readable typography
- **Component Structure:**
  - Reusable, well-documented components
  - Separation of concerns: UI, logic, and data fetching
  - Smart (container) vs. dumb (presentational) components
- **Error Handling:**
  - User-friendly error messages for failed API calls
  - Loading indicators and skeleton screens

## Development Workflow
- **Feature Branches:** Work on isolated branches for each feature/module
- **Code Reviews:** Peer review for all pull requests
- **Linting & Formatting:** Enforce code style with ESLint and Prettier
- **Testing:** Unit and integration tests for critical logic and components

## API Integration Plan
- **Endpoints to Connect:**
  - User registration & login (JWT authentication)
  - Transaction calculation & creation
  - Transaction history (with pagination)
  - FX rates retrieval
  - Advertisements for carousel
- **Authentication:**
  - Store JWT tokens securely in Redux state
  - Attach tokens to protected API requests
  - Handle token refresh and logout

## UI/UX Goals
- **Onboarding:** Simple, friendly sign-up and login flows
- **Dashboard:** Clear sections for sending money, viewing ads, and transaction history
- **Feedback:** Immediate feedback for actions (success, error, loading)
- **Accessibility:** Keyboard navigation and screen reader support

## Required Pages & Navigation
- **Landing Page:**
  - The first page all users see
  - Well-styled, visually appealing, and modern
  - Includes company description, images, and carousel ads
  - Prominent links/buttons for Sign Up and Login
  - Responsive and accessible design
- **Login Page:**
  - Secure login form for existing users
  - Clear error handling and feedback
  - Link to Sign Up page
- **Sign Up Page:**
  - Registration form for new users
  - Input validation and user-friendly error messages
  - Link to Login page
- **Dashboard (Authenticated Users):**
  - Main hub for signed-in users
  - Section to make money transfers (with validation and feedback)
  - Section to view past transactions (with pagination)
  - Section to view ads/carousel
  - Clean, organized layout for all dashboard actions

All pages should follow the clean design principles outlined above, with consistent navigation and a focus on user experience.

## Routing Strategy
- **Routing Library:** Use `createBrowserRouter` from React Router for client-side navigation
- **Parent-Child Layouts:**
  - Use `Outlet` to define parent routes and layouts
  - Shared layouts (e.g., navigation bars, footers) are placed in parent components
  - Child pages (e.g., dashboard, login, signup) rendered via `Outlet` to avoid code duplication
- **Navigation:**
  - All page navigations handled via React Router
  - Consistent and maintainable route structure

## Colors:

- **Main Color**
- White: "#ffffff"

- **Other colors**
- Light Blue: "#a7cee6"
- Mid Blue: "#527790"
- Dark Blue: "#1c6593" 

## Next Steps
1. Set up Redux Toolkit and RTK Query in the project
2. Define API services and slices for all backend features
3. Build core UI components with a clean, modern design
4. Connect UI to backend via RTK Query
5. Test and refine user flows for reliability and polish

---

This context document should be referenced throughout development to ensure architectural consistency, maintainable code, and a high-quality user experience.
