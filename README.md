# 🗺️ Treasure Hunt – Manav Rachna Orientation 2025

Welcome to the **Treasure Hunt** project – a dynamic and interactive digital experience built exclusively for **Manav Rachna Orientation 2025**! This application transforms the traditional orientation into an engaging adventure filled with teamwork, critical thinking, and exploration.

New students embark on a journey of discovery through a series of challenging clues and puzzles – all culminating in a fun-filled finale that fosters connection, curiosity, and collaboration.

---

## 🚀 Project Overview

Our mission is to provide a **memorable and immersive experience** that helps students:
- Connect with peers and campus
- Engage through fun and intellectual challenges
- Develop problem-solving and collaboration skills

---

## ✨ Key Features

- **👥 Flexible Team Play** – Play solo or collaborate as a team.
- **📈 Real-time Progress Tracking** *(Optional)* – Live tracking of participants.
- **⏱️ Competitive Scoring** *(Optional)* – Race against time to complete all clues.
- **🖥️ Intuitive UI/UX** – Clean and distraction-free gameplay experience.
- **🛠️ Admin Dashboard** *(Optional)* – Organizers can manage clues, track players, reset the game, etc.

---

## 🛠️ Installation & Setup

### 🔧 Prerequisites

Ensure you have the following installed:
- **Node.js** (v16+)
- **npm** or **Yarn**
- **Git**
- **Modern Web Browser** (Chrome, Firefox, Edge)

---

### 📦 Clone the Repository

```bash
git clone https://github.com/M85vik/Treasure-Hunt-ManavRachna-Orientation-2025.git
cd Treasure-Hunt-ManavRachna-Orientation-2025
```

---

### 📥 Install Dependencies

```bash
# for frontend
cd frontend
npm install 

# for backend
cd backend
npm install
```

---

### ⚙️ Configuration

- **Clue Data**: Modify the file `src/data/clues.json` or `config.js` with your custom clues and answers.
- **Environment Variables**: Create a `.env` file using `.env.example` as a reference.

```env
DB_URI=your_database_connection_string
ADMIN_PASSWORD=your_secure_admin_password
```

- **Participant Settings**: Adjust team or user registration logic if needed.

---

## 🎮 How to Play

### ▶️ Start the App

```bash
# frontend
npm run dev

#backend
npm run dev
```

---

### 👤 Player Journey

1. Register with team/individual details.
2. Open the seal, solve the riddle, and find the passcode.
3. Solve the puzzle, and score points
4. Continue solving clues until the final victory!

---

### 🛠️ Admin Panel

1. Visit: `http://localhost:3000/admin`
2. Login with your credentials
3. Manage game state:
   - Start or stop the game
   - Monitor leaderboard

---


### 🧭 Landing Page
![Landing Page Screenshot](./screenshots/home.png)

---

### 🧩 Clue Interface
![Clue Interface](./screenshots/image.png)

---

### 📊 Live Progress / Leaderboard
![Leaderboard](./screenshots/leaderboard.png)

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork** the repo
2. **Create a new branch**:

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**  
4. **Commit your code**:

```bash
git commit -m "feat: Add leaderboard UI"
```

5. **Push your changes**:

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** on GitHub

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE.md](./LICENSE.md) file for details.

---
