var leaderboardWindow;

function onLoad() {
    var buttons = document.querySelectorAll(".flex-row button");

    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            var difficulty = button.textContent.toLowerCase();
            var num = Math.floor(Math.random() * 2 + 1);
            window.location.href = `http://localhost:5000/play/${difficulty}/${num}`
        });
    });

    leaderboardWindow = window.open('http://localhost:5000/leaderboard', 'LeaderboardWindow', 'width=600,height=400');
}

window.addEventListener("load", onLoad);

function reloadLeaderboard() {
    if (leaderboardWindow && !leaderboardWindow.closed) {
        leaderboardWindow.location.reload();
    }
}

