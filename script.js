let cursor = document.querySelector('.cursor');
let mouse = document.querySelector('#mouse');
let nickContainer = document.querySelector('.nick-container');
let pointsContainer = document.querySelector('.points-container');
let zombieContainer = document.querySelector('.zombie-container')
let retryBtn = document.querySelector('.btn');
let summary = document.querySelector('.summary');
let result = document.querySelector('.result')
let highScoreTable = document.querySelector('.highScore')
let nickInput = document.getElementById('name');

let nick = "new";
let points = 0;
let stringPoints;

const url = 'https://api.npoint.io/575a7e48c3e22b209381';

retryBtn.addEventListener('click', newGame);
summary.style.display = 'flex';
mouse.style.display = 'block';
cursor.style.display = 'none';
window.addEventListener('mousemove', newCursor2);
window.removeEventListener('mousemove', newCursor);
getHighScores(nick);


// cursor type
function newCursor(e) {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
}

function newCursor2(e) {
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min
}

function minusPoints() {
    let stringPoints = Math.abs(points).toString()
    pointsContainer.innerHTML = '-' + stringPoints.padStart(5, '0');
}

function plusPoints() {
    let stringPoints = points.toString()
    pointsContainer.innerHTML = stringPoints.padStart(5, '0');
}

function minus6Points() {
    points -= 6;
    if (points < 0) { minusPoints() }
    else { plusPoints() }
}

function plus6points() {
    points += 12;
    if (points < 0) { minusPoints() }
    else { plusPoints() }
}

function plus12points() {
    points += 18;
    if (points < 0) { minusPoints() }
    else { plusPoints() }
}

// nick can't be empty
function correctNick(nick) {
    if (nick.length >= 1) {
        return true;
    }
    return false
}

function newGame() {
    document.removeEventListener('click', minus6Points)
    summary.style.display = 'flex';
    mouse.style.display = 'block';
    cursor.style.display = 'none';
    window.addEventListener('mousemove', newCursor2);
    window.removeEventListener('mousemove', newCursor);
    nick = "";
    nick = nickInput.value;

    if (correctNick(nick)) {
        nickContainer.innerHTML = `Nick: ${nick}`
        summary.style.display = 'none';
        move();
    }
}

function move() {
    window.addEventListener('mousemove', newCursor);
    window.removeEventListener('mousemove', newCursor2);

    mouse.style.display = 'none';
    cursor.style.display = 'block';
    let zombieWin = 0;

    points = 0;
    stringPoints = points.toString()
    pointsContainer.innerHTML = stringPoints.padStart(5, '0')

    function startGame() {
        let left = window.innerWidth;
        let randomSpped = randomNumber(15, 60)
        let randomHeight = randomNumber(200, 350);
        let randomPlace = randomNumber(30, 70);

        let zombieIdx = 9;
        let zombie = new Image(100, randomHeight)
        let clicked = false;

        zombie.src = "images/zombie" + zombieIdx + ".png";
        zombie.classList.add("zombie1");
        zombie.style.marginTop = randomPlace + 'vh';
        zombieContainer.appendChild(zombie)
        zombie.draggable = false;

        retryBtn.addEventListener('click', plus6points);
        document.addEventListener('click', minus6Points)

        zombie.addEventListener('click', function () {
            plus12points();
            clicked = true;
            zombie.remove();
        })

        function moveZombies() {
            if (zombieWin == 3) {
                clearInterval(zombieWalk)
            }

            if (left > -40 && !clicked) {
                left -= 10;
                zombie.style.display = 'block'
                zombie.style.left = left + 'px';
                zombie.src = "images/zombie" + zombieIdx + ".png";
                zombieIdx--;

                if (zombieIdx == 0) {
                    zombieIdx = 9;
                }
            }
            else if (left <= -40 && !clicked) {
                zombieWin++;
                zombie.remove();
                clearInterval(zombieWalk)
            }
        }

        let zombieWalk = setInterval(moveZombies, randomSpped);

        if (zombieWin == 3) {
            clearInterval(zombieGame);
            zombieContainer.innerHTML = '';
            document.removeEventListener('click', minus6Points)
            retryBtn.removeEventListener('click', plus6points)
            mouse.style.display = 'block';
            cursor.style.display = 'none';
            result.innerHTML = `You have: ${points} points`;
            getHighScores(nick);
            nick = "";
            nickInput.value = "";
            newGame()
        }

    }

    let randomAdd = randomNumber(400, 1000);
    let zombieGame = setInterval(startGame, randomAdd);

}

// generate highscore based on 3 best scores
function getData() {
    fetch(url)
        .then(response => { return response.json() })
        .then(data => console.log(data))
}

function getHighScores(nick1) {
    fetch(url)
        .then(response => { return response.json() })
        .then(data => {
            displayTable(data, nick1)
        })
}

function putData(array) {
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(array)
    }).then(response => response.json())
}

function sortByPoints(arr) {
    arr.sort((a, b) => (a.points > b.points) ? 1 : -1);
    arr.reverse()
}

function displayTable(arr, nick1) {
    newObject = {
        'nick': nick1,
        'points': points
    }

    arr.push(newObject);
    sortByPoints(arr);
    highScoreTable.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        let newTr = document.createElement("tr");
        newTr.classList.add('tableRow')
        newTr.innerHTML = `
                <tr>${i + 1}.  </tr>
                <tr>${arr[i].nick}  </tr>
                <tr>${arr[i].points} points</tr>`
        highScoreTable.appendChild(newTr);
    }

    putData(arr.slice(0, 3));
    getData()
}








