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
    console.log(aluno);
};

let correctBtn = document.querySelector('#btn-correct');
correctBtn.onclick = function(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
};

let incorrectBtn = document.querySelector('#btn-incorrect');
incorrectBtn.onclick = function(){
    aluno.words_total ++;
    console.log(aluno);
};