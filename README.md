# 🏟️ CodeArena

**Unleash your coding potential through interactive games and challenges!**

CodeArena is a comprehensive learning platform designed to make programming concepts intuitive and engaging. From algorithmic thinking with "Tea Making" to real-time coding challenges in the "Combat Arena," this project bridges the gap between theory and practice.

---

## 🚀 Features

- **🎮 Educational Games**: Learn algorithms, patterns, and logic through custom-built mini-games.
- **⚔️ Combat Arena**: Tackle real coding challenges in C++ with instant feedback.
- **📊 Progress Dashboard**: Track your activity and visualize your learning journey.
- **🛡️ Secure Identity**: Personalized `Game ID` system to save your difficulty levels and progress.
- **📈 Multi-Grade Support**: Specialized curriculum paths for different grade levels (e.g., Grade 6 specialized dashboard).

---

## 🛠️ Tech Stack

- **Backend**: Python (Flask)
- **Database**: Supabase (PostgreSQL) with local SQLite fallback
- **Frontend**: HTML5, CSS3, Vanilla JS, and Next.js (Static Exports)
- **Styling**: Modern, responsive UI with a premium dark-mode aesthetic
- **Deployment**: Render

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/trishna-paswan/codearena-app.git
cd codearena-app
```

### 2. Set Up Virtual Environment (Recommended)
```bash
python -m venv .venv
source .venv/bin/activate  # Mac/Linux
# OR
.venv\Scripts\activate     # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Locally
```bash
python main.py
```
*The app will be available at `http://localhost:5001`*

---

## 🔗 Database & Environment Variables

The application uses **Supabase** for persistent production data and **SQLite** for local development.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase PostgreSQL Connection String | (None - falls back to SQLite) |
| `SECRET_KEY` | Flask Secret Key | `codearena_secret_key` |

### To use Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Copy your **PostgreSQL Connection String**.
3. Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL=your_connection_string_here
   ```

---

## 📁 Project Structure

- `/CodeArena_app`: Main application assets.
  - `/templates`: HTML views for login, dashboard, and games.
  - `/static`: CSS, JS, and image assets.
- `/grades_dashboard`: Next.js application for specialized grade-level content.
- `main.py`: The heart of the application handling routing and database logic.
- `requirements.txt`: Python package dependencies.

---

## 🌐 Deployment to Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect this GitHub repository.
3. Use the following settings:
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app`
4. Go to **Environment** and add:
   - `DATABASE_URL`: Your Supabase URI.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

**Developed with ❤️ for the next generation of coders.**
