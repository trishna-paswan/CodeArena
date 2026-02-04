from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/games")
def games():
<<<<<<< HEAD
    # In the future, we can pass a list of games to the template
=======
>>>>>>> c8a7da4 (changes)
    return render_template("games.html")

@app.route("/game/algorithm")
def algorithm_game():
    return render_template("algorithm.html")

if __name__ == "__main__":
<<<<<<< HEAD
    app.run(debug=True)
=======
    app.run(debug=True, port=5001)
>>>>>>> c8a7da4 (changes)
