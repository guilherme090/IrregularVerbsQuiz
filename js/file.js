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
    console.log("Botão clicado. Novo estudante será adicionado.");
    aluno.name = 'Nome Legal';
    aluno.words_learned = 20;
    console.log(aluno);
    studentName.innerHTML = aluno.name;
    studentLearnedWords.innerHTML = aluno.words_learned;
};

let startBtn = document.querySelector('#btn-start');
startBtn.onclick = function(){
    wordNumber.innerHTML = 1;
}

let correctBtn = document.querySelector('#btn-correct');
correctBtn.onclick = function(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    wordNumber.innerHTML++;
    updateStudentScore();
};

let incorrectBtn = document.querySelector('#btn-incorrect');
incorrectBtn.onclick = function(){
    aluno.words_total ++;
    console.log(aluno);
    wordNumber.innerHTML++;
    updateStudentScore();
};