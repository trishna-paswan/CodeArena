from flask import Flask, render_template, request, redirect, url_for, session, send_from_directory, abort
import sqlite3
from datetime import datetime
import os

app = Flask(__name__, 
            template_folder='CodeArena_app/templates', 
            static_folder='CodeArena_app/static')
app.secret_key = 'codearena_secret_key'

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'CodeArena_app', 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    # Ensure the 'difficulty' column exists if the table exists
    try:
        columns = [row['name'] for row in conn.execute("PRAGMA table_info(users)").fetchall()]
        if columns and 'difficulty' not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN difficulty TEXT DEFAULT 'Beginner'")
    except sqlite3.OperationalError:
        pass # Table might not exist yet
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            game_id TEXT NOT NULL UNIQUE,
            difficulty TEXT NOT NULL DEFAULT 'Beginner',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            activity_date DATE DEFAULT (DATE('now', 'localtime')),
            count INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, activity_date)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template("index.html")

@app.route("/gate")
def gate():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template("gate.html")

@app.route("/setup", methods=['GET', 'POST'])
def setup():
    if 'user_id' in session and request.method == 'GET':
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        name = request.form.get('name')
        game_id = request.form.get('game_id')
        difficulty = request.form.get('difficulty', 'Beginner')
        
        conn = get_db_connection()
        try:
            cur = conn.execute('INSERT INTO users (name, game_id, difficulty) VALUES (?, ?, ?)', 
                               (name, game_id, difficulty))
            user_id = cur.lastrowid
            conn.commit()
            session['user_id'] = user_id
            session['name'] = name
            session['difficulty'] = difficulty
            
            # Log initial activity
            today = datetime.now().strftime('%Y-%m-%d')
            conn.execute('INSERT OR IGNORE INTO activity (user_id, activity_date, count) VALUES (?, ?, 1)', (user_id, today))
            conn.commit()
            
            return redirect(url_for('dashboard'))
        except sqlite3.IntegrityError:
            return render_template("user_details.html", error="Game ID already exists. Please choose another one or log in.")
        finally:
            conn.close()
            
    return render_template("user_details.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if 'user_id' in session and request.method == 'GET':
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        game_id = request.form.get('game_id')
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE game_id = ?', (game_id,)).fetchone()
        
        if user:
            session['user_id'] = user['id']
            session['name'] = user['name']
            session['difficulty'] = user['difficulty']
            
            # Log activity for login
            today = datetime.now().strftime('%Y-%m-%d')
            conn.execute('''
                INSERT INTO activity (user_id, activity_date, count) 
                VALUES (?, ?, 1)
                ON CONFLICT(user_id, activity_date) DO UPDATE SET count = count + 1
            ''', (user['id'], today))
            conn.commit()
            conn.close()
            return redirect(url_for('dashboard'))
        else:
            conn.close()
            return render_template("login.html", error="Identity not found. Please verify your Game ID.")
            
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('setup'))
    
    user_id = session['user_id']
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if not user:
        conn.close()
        session.clear()
        return redirect(url_for('setup'))

    activities = conn.execute('SELECT activity_date, count FROM activity WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    
    # Convert activities to a dictionary for easier access in JS
    activity_data = {row['activity_date']: row['count'] for row in activities}
    
    return render_template("dashboard.html", user=user, activity_data=activity_data)

@app.route("/games")
def games():
    if 'user_id' not in session:
        return redirect(url_for('setup'))
    
    # Log activity when visiting games
    user_id = session['user_id']
    today = datetime.now().strftime('%Y-%m-%d')
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO activity (user_id, activity_date, count) 
        VALUES (?, ?, 1)
        ON CONFLICT(user_id, activity_date) DO UPDATE SET count = count + 1
    ''', (user_id, today))
    conn.commit()
    conn.close()
    
    return redirect(url_for('dashboard', _anchor='combat-arenas'))

@app.route("/game/algorithm")
def algorithm_game():
    return render_template("algorithm.html")

@app.route("/game/frog-game")
def frog_game():
    return render_template("frog-game.html")

@app.route("/game/directions")
def directions_game():
    return render_template("directions.html")

@app.route("/game/patterns")
def patterns_game():
    return render_template("patterns.html")

@app.route("/game/variables-lab")
def variables_lab_game():
    return render_template("variables-lab.html")

@app.route("/game/grades-dashboard")
def grades_dashboard_game():
    if 'user_id' not in session:
        return redirect(url_for('setup'))
    return redirect("/grades/")

@app.route('/grades')
def grades_redirect():
    return redirect(url_for('serve_grades'))

@app.route('/grades/')
@app.route('/grades/<path:path>')
def serve_grades(path='index.html'):
    static_grades_dir = os.path.abspath(os.path.join(app.static_folder, 'grades'))

    path = (path or 'index.html').lstrip('/')
    path = os.path.normpath(path).replace('\\', '/')

    # Prevent path traversal
    if path.startswith('..'):
        abort(404)

    target_file = os.path.abspath(os.path.join(static_grades_dir, path))
    if not target_file.startswith(static_grades_dir + os.sep) and target_file != static_grades_dir:
        abort(404)

    # If the path is a directory, serve its index.html first
    if os.path.isdir(target_file):
        candidate = os.path.join(target_file, 'index.html')
        if os.path.isfile(candidate):
            path = os.path.join(path, 'index.html')
            target_file = candidate

    # Fall back to an HTML page if no extension was provided
    if not os.path.isfile(target_file) and '.' not in os.path.basename(path):
        candidate = os.path.abspath(os.path.join(static_grades_dir, path + '.html'))
        if candidate.startswith(static_grades_dir + os.sep) and os.path.isfile(candidate):
            path += '.html'
            target_file = candidate

    if not os.path.isfile(target_file):
        abort(404)

    return send_from_directory(static_grades_dir, path)

@app.route("/game/coding-arena")
def coding_arena():
    if 'user_id' not in session:
        return redirect(url_for('setup'))
    
    # Example beginner challenges in C++
    challenges = [
        {
            "id": 1,
            "title": "The Greeting Bot (C++)",
            "description": "Write a function that returns the string 'Hello, World!'.",
            "starter_code": "#include <string>\nusing namespace std;\n\nstring sayHello() {\n    // Write your code here\n    \n}",
            "solution_keywords": ["return", "\"Hello, World!\"", ";"],
            "expected_output": "Hello, World!",
            "hints": ["Use the 'return' keyword.", "Make sure to include the semicolon ';'.", "Strings in C++ use double quotes."]
        },
        {
            "id": 2,
            "title": "Double the Power (C++)",
            "description": "Complete the function to return the double of the integer 'n'. (Assume n=5 for the test case)",
            "starter_code": "int doubleIt(int n) {\n    // Write your code here\n    \n}",
            "solution_keywords": ["return", "n", "*", "2", ";"],
            "expected_output": "10",
            "hints": ["You need to multiply 'n' by 2.", "Use the '*' operator for multiplication.", "Don't forget the 'return' keyword!"]
        }
    ]
    return render_template("coding_arena.html", challenges=challenges)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(debug=True, port=5001)