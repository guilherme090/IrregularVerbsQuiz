/*
----------------------------------------------------------------------------------
Objects
----------------------------------------------------------------------------------
Store current and total scores.
*/

const aluno = {
    name: '',
    words_learned: 0,
    words_right: 0,
    words_total: 0
}

/* 
----------------------------------------------------------------------------------
Labels
----------------------------------------------------------------------------------
Labels that will store the student's data.
*/ 

// Student data

let studentName = document.querySelector('#student-name');
let studentLearnedWords = document.querySelector('#learned-words');

// Quiz area

let wordNumber = document.querySelector('#word-no');
let correctPct = document.querySelector('#correct-pct');

// Update functions
function updateStudentScore(){
    correctPct.innerHTML = (aluno.words_right / aluno.words_total * 100).toFixed(2); 
}

/* 
----------------------------------------------------------------------------------
Buttons
----------------------------------------------------------------------------------
All the buttons of the interface
*/ 

let newStudentBtn = document.querySelector('#new-student');
newStudentBtn.onclick = function(){
    // Erase reference to current student, if any.
    loadBtn.value = null;

    //console.log("Botão clicado. Novo estudante será adicionado.");
    aluno.name = 'Nome Legal';
    aluno.words_learned = 20;
    console.log(aluno);
    studentName.innerHTML = aluno.name;
    studentLearnedWords.innerHTML = aluno.words_learned;

    // Signal to the state machine that there is a registered student
    stateMachine(states.STUDENT_REGISTERED);
};

let startBtn = document.querySelector('#btn-start');
startBtn.onclick = function(){
    wordNumber.innerHTML = 1;
    stateMachine(states.QUIZ_STARTED_NO_ANSWER);
}

let correctBtn = document.querySelector('#btn-correct');
correctBtn.onclick = function(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    wordNumber.innerHTML++;
    updateStudentScore();
    // Signal to the state machine that new word is ready
    stateMachine(states.QUIZ_STARTED_NO_ANSWER);
};

let incorrectBtn = document.querySelector('#btn-incorrect');
incorrectBtn.onclick = function(){
    aluno.words_total ++;
    console.log(aluno);
    wordNumber.innerHTML++;
    updateStudentScore();
    // Signal to the state machine that new word is ready
    stateMachine(states.QUIZ_STARTED_NO_ANSWER);
};

let showAnsBtn = document.querySelector('#btn-show-answer');
showAnsBtn.onclick = function(){
    // Signal to the state machine that answer was shown
    stateMachine(states.QUIZ_STARTED_ANSWER_SHOWN);
};

// File Reading

var txtRead = [];

const loadBtn = document.querySelector('#input-file');
loadBtn.addEventListener('input', function(e){
    var fr = new FileReader();
    fr.onload = function(){
        //console.log(fr.result);
        txtRead = (fr.result.split('*'));
        //console.log(txtRead);
        studentName.innerHTML = txtRead[0];
        studentLearnedWords.innerHTML = txtRead[1];
    }
    fr.readAsText(this.files[0]);
    //console.log(txtRead);

    // Signal to the state machine that there is a registered student
    stateMachine(states.STUDENT_REGISTERED);
});

// File Writing

const saveBtn = document.querySelector('#btn-save');
saveBtn.onclick = function(){
    // Mount text file using * separators;
     
    let data = studentName.innerHTML + '*' + studentLearnedWords.innerHTML;
    let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, studentName.innerHTML + ".txt"); // using function from external code downloaded from github
    // Reset state machine
    stateMachine(states.STUDENT_REGISTERED);
    wordNumber.innerHTML = 0;
}

// State machine

const states = {
    REGISTER_STUDENT: 'register-student',
    STUDENT_REGISTERED: 'student-registered',
    QUIZ_STARTED_NO_ANSWER: 'quiz-started-no-answer', 
    QUIZ_STARTED_ANSWER_SHOWN: 'quiz-started-answer-shown',
    NO_MORE_WORDS: 'no-more-words'
};

//let currentState = states.REGISTER_STUDENT;
stateMachine(states.REGISTER_STUDENT);

function stateMachine(currentState){
    if(!currentState){
        throw new Error('State is not defined');
    }
    switch(currentState){
        case states.REGISTER_STUDENT:
            newStudentBtn.disabled = false;
            loadBtn.disabled = false;
            startBtn.disabled = true;
            showAnsBtn.disabled = true;
            correctBtn.disabled = true;
            incorrectBtn.disabled = true;
            saveBtn.disabled = true;
            break;
        case states.STUDENT_REGISTERED:
            newStudentBtn.disabled = false;
            loadBtn.disabled = false;
            startBtn.disabled = false;
            showAnsBtn.disabled = true;
            correctBtn.disabled = true;
            incorrectBtn.disabled = true;
            saveBtn.disabled = true;
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            newStudentBtn.disabled = true;
            loadBtn.disabled = true;
            startBtn.disabled = true;
            showAnsBtn.disabled = false;
            correctBtn.disabled = true;
            incorrectBtn.disabled = true;
            saveBtn.disabled = false;
            break;
        case states.QUIZ_STARTED_ANSWER_SHOWN:
            newStudentBtn.disabled = true;
            loadBtn.disabled = true;
            startBtn.disabled = true;
            showAnsBtn.disabled = true;
            correctBtn.disabled = false;
            incorrectBtn.disabled = false;
            saveBtn.disabled = false;
            break;
        case states.NO_MORE_WORDS:
            newStudentBtn.disabled = true;
            loadBtn.disabled = true;
            startBtn.disabled = true;
            showAnsBtn.disabled = true;
            correctBtn.disabled = true;
            incorrectBtn.disabled = true;
            saveBtn.disabled = false;
            break;
    }
}