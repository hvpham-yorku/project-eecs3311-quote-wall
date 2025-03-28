# 📜 Inspirational Quote Website

Welcome to the **Quote Wall Website**, a dynamic platform where users can **customize their experience, select topics of interest, and receive motivational quotes** based on their preferences.


## 🚀 Motivation
In today's fast-paced world, **motivation** and **positivity** can make a significant impact. This project was created to:  
✔ Deliver **inspirational quotes** to users based on their **favorite categories** (sports, film, gaming, etc.).  
✔ Allow users to **customize** their experience with light/dark mode, background changes, and more.  
✔ Provide a **seamless UI** with modern, responsive design.  
✔ Implement an easy-to-use **API-driven** system for fetching quotes dynamically.  

## 🛠️ Installation  

### **🔹 Prerequisites**  
- A modern web browser (Chrome, Firefox, Edge)  
- An API key from **[API Ninjas Quotes API](https://www.api-ninjas.com/api/quotes)**  
- [Node.js](https://nodejs.org/en) and [npm](https://www.npmjs.com/)  
- Python 3 and pip  

---

### **🔹 Setup Steps**  

#### **1️⃣ Clone the repository**  
```bash
git clone https://github.com/hvpham-yorku/project-eecs3311-quote-wall.git
cd project-eecs3311-quote-wall
```

#### **2️⃣Navigate to the backend folder and enter the command below to download all required dependencies**
```bash
pip install -r requirements.txt
```

#### **3️⃣Check Node.js and npm installation**
```bash
node -v   # Check Node.js version  
npm -v    # Check npm version  
```

If you don't have Node.js installed, download it from https://nodejs.org/en.
To install dependencies, run:
```bash
npm install
```

#### **4️⃣ Start the backend server**
```bash
flask --app app run
```

#### **5️⃣ Navigate to the frontend folder and start the development server**
```bash
npm run dev
```
## 📂 Project Structure
```bash
project-eecs3311-quote-wall/
│── doc/
│   ├── sprint0/                     # Sprint 0 documentation
│   ├── sprint1/                     # Sprint 1 documentation
│
│── sprint1/
│   ├── sprint1Backend/               # Backend files
│   │   ├── __pycache__/              # Compiled Python cache
│   │   ├── venv/                     # Virtual environment
│   │   ├── .env                      # Environment variables
│   │   ├── app.py                    # Flask backend
│   │   ├── requirements.txt          # Python dependencies
│   │
│   ├── sprint1Frontend/              # Frontend files
│       ├── .next/                    # Next.js build folder
│       ├── app/                      # Main app files
│       ├── components/               # Reusable UI components
│       ├── lib/                      # Utility functions
│       ├── models/                   # Data models
│       ├── node_modules/             # Installed Node.js dependencies
│       ├── public/                   # Static assets (images, icons, etc.)
│       ├── .env.local                # Local environment config
│       ├── components.json           # UI component structure
│       ├── eslint.config.mjs         # ESLint configuration
│       ├── next-env.d.ts             # Next.js environment settings
│       ├── next.config.js            # Next.js configuration
│       ├── package-lock.json         # npm package lock
│       ├── package.json              # npm package metadata
│       ├── postcss.config.js         # PostCSS configuration
│       ├── tailwind.config.js        # Tailwind CSS configuration
│       ├── tsconfig.json             # TypeScript configuration
│
│── .gitignore                         # Git ignored files
│── README.md                          # Documentation
│── sprint1.md                         # Sprint 1 plan
│── RPM.md                              # Additional documentation

```

## 📝 How to Contribute

1. **Fork the repository** and create your own branch.
2. **Implement your changes** and commit with clear messages.
3. **Push to your fork** and submit a **Pull Request (PR)** to the `main` branch.
4. Ensure your code follows **best practices** and is **well-documented**.
5. Wait for **review and approval** before merging.
   

## 📌 Issue Tracking

We use **GitHub Issues** to track:
- 🐞 **Bugs** – Report unexpected behavior.
- 💡 **Feature Requests** – Suggest new functionalities.
- 🔧 **Improvements** – Recommend optimizations.

If you find a bug or have an idea, please **open an issue** with a clear description.
