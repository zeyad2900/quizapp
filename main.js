let questionCCount = document.querySelector(".count span");
let spanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getRequest() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            let jsObject = JSON.parse(myRequest.response);
            let questionNum = jsObject.length;
            questionCCount.innerHTML = questionNum;
            countdown(3, questionNum);
            for (let i = 1; i <= questionNum; i++) {
                let span = document.createElement("span");
                if (i == 1) {
                    span.className = "on";
                }
                spanContainer.appendChild(span);
            }
            addDataToQuiz(jsObject[currentIndex], questionNum);
            submit.onclick = function () {
                let theRightAnswer = jsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer, questionNum);
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                addDataToQuiz(jsObject[currentIndex], questionNum);
                handelSpanClass();
                showResults(questionNum);
                clearInterval(countdownInterval);
                countdown(3, questionNum);
            };
        }
    };
    myRequest.open("GET", "/html_questions.json");
    myRequest.send();
}
getRequest();

function addDataToQuiz(obj, num) {
    if (currentIndex < num) {
        let h2 = document.createElement("h2");
        let h2Content = document.createTextNode(obj.title);
        h2.appendChild(h2Content);
        quizArea.appendChild(h2);
        for (let i = 1; i <= 4; i++) {
            let div = document.createElement("div");
            div.className = "answer";
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "question";
            input.id = `answer_${i}`;
            input.dataset.answer = obj[`answer_${i}`];
            if (i == 1) {
                input.checked = true;
            }
            div.appendChild(input);
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            let labelContent = document.createTextNode(obj[`answer_${i}`]);
            label.appendChild(labelContent);
            div.appendChild(label);
            answerArea.appendChild(div);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            if (rAnswer === answers[i].dataset.answer) {
                rightAnswers++;
            }
        }
    }
}

function handelSpanClass() {
    let bullets = document.querySelectorAll(".bullets .spans span");
    let arrayOfBullets = Array.from(bullets);
    arrayOfBullets.forEach((ele, index) => {
        if (currentIndex == index) {
            ele.className = "on";
        }
    });
}

function showResults(count) {
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submit.remove();
        bullets.remove();
        let theResults;
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        results.innerHTML = theResults;
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submit.click();
            }
        }, 1000);
    }
}
