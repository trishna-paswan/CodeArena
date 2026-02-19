from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/games")
def games():
    return render_template("games.html")

@app.route("/game/algorithm")
def algorithm_game():
    return render_template("algorithm.html")

@app.route("/game/frog-game")
def frog_game():
    return render_template("frog-game.html")

if __name__ == "__main__":
    app.run(debug=True, port=5001)