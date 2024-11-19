let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let bulletsContainer = document.querySelector(".quiz-app .bullets .spans")
let countdown = document.querySelector(".quiz-app .bullets .countdown")
let bulletsArea = document.querySelector(".quiz-app .bullets");
let questionCountTitle = document.querySelector(".quiz-app .quiz-info .count");
let submitBtn = document.querySelector(".quiz-app .submit-button");
let result = document.querySelector(".quiz-app .result");

let currentQuestionIndex = 0;
let numberOfRightAnswers = 0;

function getQuiz() {
    let myReq = new XMLHttpRequest();

    myReq.open("GET", "../questions.json");
    myReq.send();

    myReq.onreadystatechange = function () {
        if (myReq.readyState === 4 && myReq.status === 200) {

            let allTheQuizQuestions = JSON.parse(myReq.responseText);
            let numberOfQuestions = allTheQuizQuestions.length;

            questionCountTitle.textContent = `Questions Count: ${numberOfQuestions}`;

            let answersArr = writeTheQuestionData(allTheQuizQuestions[currentQuestionIndex], numberOfQuestions);

            let bullets = createBulltes(numberOfQuestions);

            let time = [0,1,0]
            let timer = setTimer(time[0], time[1], time[2]);

            submitBtn.onclick = function () {

                clearInterval(timer);
                timer = setTimer(time[0], time[1], time[2]);

                checkIfTheAnswerIsTrue(answersArr, allTheQuizQuestions[currentQuestionIndex]["right_answer"]);

                currentQuestionIndex++;

                answersArr = writeTheQuestionData(allTheQuizQuestions[currentQuestionIndex], numberOfQuestions);

                setCurrentQuestionBulletOn(bullets, numberOfQuestions);

                if (currentQuestionIndex === numberOfQuestions) {
                    quizArea.remove();
                    answersArea.remove();
                    bulletsArea.remove();
                    submitBtn.remove();

                    showTheFinalResult(numberOfQuestions);
                    clearInterval(timer);
                }
            }

        }
    }

}

getQuiz();

function writeTheQuestionData(question, numberOfQuestions) {
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";

    if (currentQuestionIndex < numberOfQuestions) {

        let title = document.createElement("h2");
        title.textContent = question.title;
        quizArea.appendChild(title);

        let answerArr = [];
        let answersTextArr = getAllAnswersFromQuestionObject(question);

        for (let i = 1; i <= answersTextArr.length; i++) {

            let answerContainer = document.createElement("div");
            answerContainer.className = "answer";

            let input = document.createElement("input");
            input.type = "radio";
            input.id = `answer_${i}`;
            input.name = `QA_${currentQuestionIndex + 1}`;

            // if (i === 1) input.setAttribute("checked", "");

            let label = document.createElement("label");
            label.htmlFor = input.id;
            label.textContent = answersTextArr[i - 1];

            answerContainer.append(input, label);

            answerArr.push(answerContainer);

            answersArea.appendChild(answerContainer);
        }

        return answerArr;

    }

}

function getAllAnswersFromQuestionObject(question) {
    let answersArr = [];
    for (let key in question) {
        if (key.includes("answer_")) {
            answersArr.push(question[key]);
        }
    }

    return answersArr;
}

function createBulltes(numberOfQuestions) {
    let bulltesArr = [];

    for (let i = 0; i < numberOfQuestions; i++) {

        let bullet = document.createElement("span");

        if (i === currentQuestionIndex) {
            bullet.className = "on";
        }

        bulltesArr.push(bullet);

        bulletsContainer.appendChild(bullet);

    }

    return bulltesArr;
}

function setCurrentQuestionBulletOn(bullets, numberOfQuestions) {
    if (currentQuestionIndex < numberOfQuestions) {
        bullets[currentQuestionIndex].className = "on";
    }
}

function checkIfTheAnswerIsTrue(answerArr, rightAnswer) {
    answerArr.forEach((answer) => {
        if (answer.children[0].checked) {
            if (answer.children[1].textContent === rightAnswer) {
                ++numberOfRightAnswers;
            }
        }
    })
}

function showTheFinalResult(numberOfQuestions) {

    let result = document.createElement("div");
    result.className = "result";

    if (numberOfRightAnswers >= 5 && numberOfRightAnswers < 9) {
        result.innerHTML = `<span class='good'>Good</span>`;
    } else if (numberOfRightAnswers === 9) {
        result.innerHTML = `<span class='perfect'>Perfect</span>`;
    } else {
        result.innerHTML = `<span class='bad'>Bad</span>`;
    }

    result.innerHTML += `, Your Grade is ${numberOfRightAnswers}/${numberOfQuestions}`;

    document.querySelector(".quiz-app").appendChild(result);
}

function setTimer(h, m, s) {

    let time = new Date();
    time.setHours(h, m, s);

    appendTheTimerOnTheQuiz(time);

    let interVal = setInterval(() => {
        
        time.setSeconds(time.getSeconds() - 1);

        appendTheTimerOnTheQuiz(time);

        if (time.getHours() === 0 && time.getMinutes() === 0 && time.getSeconds() === 0) {
            clearInterval(interVal);
            submitBtn.click();
        }

    }, 1000);

    return interVal;
}

function appendTheTimerOnTheQuiz(time) {
    countdown.textContent = `${time.getHours() <= 9 ? `0${time.getHours()}` : time.getHours()}:${time.getMinutes() <= 9 ? `0${time.getMinutes()}` : time.getMinutes()}:${time.getSeconds() <= 9 ? `0${time.getSeconds()}` : time.getSeconds()}`;
}

