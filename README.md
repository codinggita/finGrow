# FinGrow  
**Turn everyday spending into smarter financial growth.**

## 📌 Description  
FinGrow is a user-focused financial management platform designed to simplify how individuals track, understand, and grow their money. It addresses the common issue of fragmented financial data and the lack of clarity in personal finance management.

The platform delivers a structured and intuitive experience that enables users to monitor expenses, interpret financial behavior, and make informed decisions with greater confidence and control.

---

## ⚠️ Problem Statement  
Managing personal finances remains a significant challenge for many individuals, particularly students and early professionals. Most users rely on scattered methods such as notes, spreadsheets, or memory to track their expenses, which often leads to inconsistency and poor financial visibility.

Even when financial data is available, it is rarely presented in a way that is easy to interpret. Users struggle to identify spending patterns, unnecessary expenses, or opportunities to save. This lack of clarity creates a disconnect between earning and managing money effectively.

Additionally, investing is often perceived as complex and risky. Without proper guidance or simplified tools, beginners hesitate to explore investment opportunities, limiting their potential for long-term financial growth.

---

## 💡 Solution  
FinGrow addresses these challenges by providing a centralized and user-friendly platform that brings clarity and structure to personal finance management.

The application consolidates financial data into a single, organized dashboard where users can seamlessly track income and expenses. Through intuitive visualizations and analytics, FinGrow transforms raw data into meaningful insights, helping users understand their financial habits and make better decisions.

To reduce the barrier to entry in investing, FinGrow introduces a simplified and guided approach. By presenting investment-related information in a clear and accessible format, the platform minimizes complexity and builds user confidence.

Overall, FinGrow is designed to reduce friction, enhance understanding, and empower users to take control of their financial future.

---

## ✨ Features  
- 📊 Expense tracking and categorization  
- 📈 Interactive dashboard with financial insights  
- 💼 Beginner-friendly investment guidance  
- 🔐 Secure authentication and session management
- 📱 Fully responsive UI/UX using Tailwind CSS and MUI
- ⚡ React Redux Toolkit for centralized state management
- 🛠️ Formik and Yup for robust form validation
- 🌑 Dark/Light mode theme system
- 🔔 Real-time notifications via React Toastify
- 📂 File upload with Drag & Drop functionality
- 🚀 Optimized performance with React Lazy Loading and Suspense
- 🔍 SEO ready with React Helmet Async

---

## 🎨 UI/UX Design  
The design of FinGrow focuses on clarity, usability, and a premium user experience. Complex financial information is presented in a simple, intuitive, and visually accessible manner.

🔗 Figma Design Link:  
https://www.figma.com/design/0DOsKlgOM9gjZfjJigScIo/Untitled?node-id=1-7&t=3O79VtEaP04qoxvV-1

---

## 🛠️ Tech Stack  

**Frontend**  
- ⚛️ React.js (Vite)
- 🎨 Tailwind CSS + Material UI (MUI)
- 📦 Redux Toolkit (State Management)
- 🛣️ React Router DOM (Routing)
- 📝 Formik & Yup (Forms)
- 📡 Axios (API Integration)
- 🔔 React Toastify (Notifications)

**Backend**  
- 🟢 Node.js  
- 🚀 Express.js  

**Database**  
- 🍃 MongoDB  

---

## 📂 Folder Structure
The application follows a highly scalable, feature-based architecture.

```text
frontend/src/
├── app/            # Redux store configuration
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
├── features/       # Redux slices grouped by feature (auth, user, ui)
├── hooks/          # Custom React hooks (useAuth, useDebounce, useAnalytics)
├── pages/          # Main application views/pages
├── services/       # Centralized API service with Axios interceptors
├── utils/          # Utility functions (localStorage/sessionStorage helpers)
├── App.jsx         # Main application component with Routing setup
└── main.jsx        # React application entry point with Providers
```

---

## 🚀 Project Setup
Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd finGrow/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the frontend root and add:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```
