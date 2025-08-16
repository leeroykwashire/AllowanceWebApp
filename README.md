

# AllowanceWebApp & Backend

## Project Overview

This project is a full-stack web application for Zimbabwean parents to send money to their children studying abroad (UK or South Africa). It features account creation, login, a dashboard with money transfer, transaction history, live FX rates, and a carousel of ads/promotions. Both backend (Django REST API) and frontend (React + Vite) are included in this repository for easy setup and deployment.

---

## Features & Requirements Mapping

### 1. Account Creation (Mock)
- Sign-up form with name, email, password.
- Credentials are stored in the backend database (Django User model).
- Multiple accounts supported for scalability.
- Justification: Using Django's built-in user system allows easy extension for real authentication and persistence.

### 2. Login (Mock)
- Login form authenticates against backend.
- JWT tokens used for session management (can be extended for real auth).

### 3. Dashboard
- **Send Money Section**: Enter USD amount, select currency (GBP/ZAR), see fee (10% for GBP, 20% for ZAR), final amount calculated using live FX rates. Amounts are rounded up for accuracy.
- **Ads Section**: Carousel displays at least two ads, fetched from backend and can be updated via admin.
- **Transaction History**: Shows at least 15 past transactions, paginated, with details and status.

### 4. FX Rates API
- Integrates with [MockAPI FX Endpoint](https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS).
- Only GBP and ZAR rates are extracted and used for calculations.
- Data is normalized in backend for easy frontend consumption.

### 5. Design Thinking & Scalability
- **Component Structure**: Modular React components (pages, slices, API integration, UI elements).
- **Data Flow**: Redux Toolkit for state, RTK Query for API, JWT for auth, Django REST for backend.
- **Scalability**: Easily add more currencies, countries, payment methods by updating backend models and frontend config. Ads and rates are dynamic.
- **Unclear Requirements**: Chose to support multiple accounts, persistent login, and real backend for future extensibility.

---

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/leeroykwashire/AllowanceWebApp.git
cd AllowanceWebApp
```

### 2. Backend Setup (Django)

```bash
cd allowanceBackend
python -m venv ../myenv
../myenv/Scripts/activate  # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver
```
- Access Django admin at [http://localhost:8000/admin](http://localhost:8000/admin) to manage ads, users, transactions.

### 3. Frontend Setup (React + Vite)

```bash
cd ../allowanceWebApp
npm install
npm run dev
```
- Access the app at [http://localhost:5173](http://localhost:5173)

### 4. Environment & API
- The frontend is configured to connect to the backend at `http://localhost:8000/api/`.
- FX rates are fetched from the provided MockAPI endpoint.

---

## Design Decisions & Extensibility

- **Authentication**: Used Django's user model and JWT for mock login, easily upgradable to real auth.
- **Transactions**: All calculations are done in backend for security and accuracy. Fees and rates are dynamic.
- **Ads**: Managed via Django admin, images are uploaded and served from backend.
- **History & Pagination**: Backend paginates transactions, frontend displays with navigation.
- **UI/UX**: Responsive, modern design using Material UI, Bootstrap, and react-icons.
- **Scalability**: New currencies, countries, payment methods, and ad types can be added with minimal code changes.

---

## How Requirements Are Met
- All challenge requirements are implemented and justified above.
- The app is ready for demo, review, and further extension.

---

## Contact & Support
- For questions, open an issue or contact the maintainer at [leeroykwashire1@gmail.com].
