from flask import Flask, render_template, request
import json
import os

app = Flask(__name__)


def read_protein(difficulty, num):
    with open(f"./data/{difficulty}/{num}.json") as f:
        data = json.load(f)

        return data


def read_scores(difficulty):
    score_path = f"./data/{difficulty}/scores.json"

    if not os.path.isfile(score_path):
        return []

    with open(score_path) as f:
        data = json.load(f)

        return data


def write_scores(scores, difficulty):
    score_path = f"./data/{difficulty}/scores.json"

    with open(score_path, "w") as f:
        f.writelines(json.dumps(scores))


def read_leaderboard(difficulty):
    scores = read_scores(difficulty)

    if len(scores) <= 1:
        return scores

    sorted_list = sorted(scores, key=lambda x: (x["minutes"], x["seconds"]))

    return sorted_list[:3] if len(sorted_list) > 3 else sorted_list


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/play/<difficulty>/<int:num>")
def play(difficulty, num):
    protein = read_protein(difficulty, num)
    return render_template("play.html", sequence=protein["sequence"], difficulty=difficulty, num=num)


@app.route("/protein/<difficulty>/<int:num>")
def protein(difficulty, num):
    protein = read_protein(difficulty, num)

    structure_id = protein["structure"]
    structure_provider = "pdb" if len(protein["structure"]) == 4 else "afdb"
    structure = f"https://molstar.org/viewer/?{structure_provider}={structure_id}&hide-controls=1&collapse-left-panel=1&pdb-provider=rcsb"

    return render_template("protein.html",
                           name=protein["name"],
                           gene=protein["gene"],
                           structure=structure,
                           function_summary=protein["function_summary"],
                           function_description=protein["function_description"],
                           function_citation=protein["function_citation"],
                           structure_citation=protein["structure_citation"])


@app.route("/score/<difficulty>", methods=["POST"])
def score(difficulty):
    name = request.json["name"]
    minutes = request.json["minutes"]
    seconds = request.json["seconds"]
    text = request.json["text"]
    scores = read_scores(difficulty)
    scores.append({"name": name, "minutes": minutes, "seconds": seconds, "text": text})
    write_scores(scores, difficulty)

    return ('', 204)


@app.route("/leaderboard")
def leaderboard():
    easy_leaderboard = read_leaderboard("easy")
    medium_leaderboard = read_leaderboard("medium")
    hard_leaderboard = read_leaderboard("hard")

    return render_template("leaderboard.html", easy=easy_leaderboard, medium=medium_leaderboard, hard=hard_leaderboard)
