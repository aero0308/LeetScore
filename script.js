
document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById("textBox");
    const searchButton = document.getElementById("search_button");
    const scoreContainer = document.querySelector(".score_container");
    const easyCircle = document.querySelector(".easy_progress");
    const mediumCircle = document.querySelector(".medium_progress");
    const hardCircle = document.querySelector(".hard_progress");
    const easyLabel = document.getElementById("easy_label");
    const mediumLabel = document.getElementById("medium_label");
    const hardLabel = document.getElementById("hard_label");
    const scorecardContainer = document.querySelector(".score_card_container");
    const rank = document.querySelector("#rank");
    const acceptanceRateLabel = document.querySelector("#acceptance_Rate");
    const contributionPointsLabel = document.querySelector("#contribution_Points");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{4,30}$/; // Allows up to 30 characters
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchData(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch User Details");
            }
            const parsedData = await response.json();
            displayUserData(parsedData);
        } catch (error) {
            scoreContainer.innerHTML = "Unable to fetch user data.";
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const { totalQuestions, totalHard, totalMedium, totalEasy, totalSolved, easySolved, mediumSolved, hardSolved, acceptanceRate, ranking, contributionPoints } = parsedData;

        updateProgress(easySolved, totalEasy, easyLabel, easyCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardCircle);

        rank.textContent = ranking;
        acceptanceRateLabel.textContent = `${acceptanceRate}%`;
        contributionPointsLabel.textContent = contributionPoints;
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;

        if (validateUsername(username)) {
            fetchData(username);
        }
    });
});
