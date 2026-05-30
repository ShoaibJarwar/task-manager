# Task Manager Web App

A simple and efficient Task Manager web application built with React. This application allows users to manage daily tasks, track task progress, and stay organized with a clean and responsive user interface.

## 🚀 Live Demo

🔗 **GitHub Pages Deployment:**  
https://shoaibjarwar.github.io/task-manager/


---

## 📌 Features

- ✅ Add new tasks
- ✅ View all tasks in a task list
- ✅ Mark tasks as completed
- ✅ Delete tasks
- ✅ Task timer functionality using custom React hooks
- ✅ Browser notifications for task reminders
- ✅ Responsive user interface
- ✅ Component-based architecture
- ✅ User authentication form (if implemented)

---

## 🛠️ Built With

- React.js
- JavaScript (ES6+)
- CSS3
- HTML5
- React Hooks
- Git & GitHub
- GitHub Pages

---

## 📂 Project Structure

```text
TASK-MANAGER/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AuthForm.js
│   │   ├── Header.js
│   │   ├── TaskInput.js
│   │   └── TaskList.js
│   │
│   ├── hooks/
│   │   └── useTaskTimer.js
│   │
│   ├── utils/
│   │   └── notifications.js
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/ShoaibJarwar/TASK-MANGER
```

### Navigate to Project Directory

```bash
cd TASK-MANAGER
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🚀 Deployment on GitHub Pages

### Install gh-pages

```bash
npm install gh-pages --save-dev
```

### Add These Lines to package.json

```json
{
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/TASK-MANAGER",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Deploy

```bash
npm run deploy
```

---

## 🧩 Key Components

### Header

Displays the application title and navigation elements.

### AuthForm

Handles user authentication inputs and validation.

### TaskInput

Allows users to create and add new tasks.

### TaskList

Displays all tasks and task management actions.

### useTaskTimer

Custom React Hook used for task timing functionality.

### notifications.js

Utility file responsible for browser notification management.

---

## 🎯 Future Enhancements

- User authentication with Firebase
- Task categories and labels
- Dark mode support
- Drag-and-drop task management
- Task due dates and reminders
- Data persistence with backend/database
- Task search and filtering

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shoaib Akhter**

GitHub: https://github.com/ShoaibJarwar

---

⭐ If you found this project useful, consider giving it a star on GitHub!