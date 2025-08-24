📂 Document Management System - Admin Panel
Hey there! 👋 Welcome to my Document Management System Admin Panel.

This project was part of my Allsoft Front-End Developer Assignment, where I was asked to create a modern and responsive web app for managing documents, users, and system operations.

Think of it as a control center where admins can upload, search, and organize files — while also keeping users and permissions under control.
🎯 What This App Does
•	Upload & Manage Documents – with categories, subcategories, and tags
•	Search Files – real-time search with debouncing for smooth results
•	Manage Users – accounts, permissions, and roles
•	Organize Content – neat folder structures to keep things tidy
•	Generate Reports – get insights into system usage
•	Secure Login – OTP-based authentication
✨ Key Features I’m Proud Of
•	Modern UI/UX – Clean layout, smooth animations, intuitive navigation
•	Responsive by Default – Works on desktop, tablet, and mobile
•	Smart Tagging System – Create and search tags dynamically
•	Dynamic Dropdowns – API-driven categories/subcategories
•	Beautiful Feedback – Success messages and confirmation modals
🛠️ Tech Stack
•	React 19 (with hooks & functional components)
•	Vite (fast build + dev server 🚀)
•	Tailwind CSS (utility-first styling)
•	Ant Design (for forms and UI elements)
•	ESLint + Git + VS Code (for quality & workflow)
⚡ Getting Started
### Prerequisites
Before running this project, make sure you have:
- Node.js (v16+)
- npm (comes with Node.js)
- Git (to clone the repo)
####### Run the App
1. Clone the repository
   git clone <your-repository-url>
   cd my-project
2. Install dependencies
   npm install
3. Start the dev server
   npm run dev
   👉 App runs at http://localhost:5173
4. Build for production (optional)
   npm run build
📁 Project Structure (Simplified)
src/
 ├── components/    # Reusable UI components
 ├── pages/         # Main app pages (Dashboard, Upload, Search, etc.)
 ├── coreApi/       # API integration (auth, upload, etc.)
 ├── config/        # API endpoints & settings
 ├── utils/         # Helper functions
 └── assets/        # Images, logos
🐛 Troubleshooting
Dependencies not installing?
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
Dev server won’t start?
   npx kill-port 5173
   npm run dev
Build errors?
   rm -rf dist
   npm run build
📚 What I Learned
•	Using the latest React features & hooks
•	Handling frontend-backend integration cleanly
•	Building responsive layouts that just work
•	Designing with user experience in mind
•	Writing cleaner, maintainable code
✅ Assignment Checklist
•	Modern React App (React 19 + Hooks)
•	Responsive Design (Desktop, Tablet, Mobile)
•	Professional UI/UX (Clean & Intuitive)
•	Secure OTP Login System
•	Document Upload, Search & Management
•	API Integration (auth, file upload, tags)
📄 License
This project was built as part of the Allsoft Front-End Developer Assignment.
✨ Thanks for checking out my work! If you want to dive deeper, feel free to reach out — I’d be happy to walk you through the code. 🚀
