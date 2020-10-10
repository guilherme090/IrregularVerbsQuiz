/*
----------------------------------------------------------------------------------
Objects and variables
----------------------------------------------------------------------------------
Store current and total scores.
*/

const aluno = {
    name: '',
    words_learned: 0,
    words_right: 0,
    words_total: 0
}

let logMessage = ''; // stores correct and incorrect values during the quiz

/* 
----------------------------------------------------------------------------------
Labels
----------------------------------------------------------------------------------
Labels that will store the student's data.
*/ 

// Student data

let studentName = document.querySelector('#student-name');
let studentLearnedWords = document.querySelector('#learned-words');

// Message board

let messageBoard = document.querySelector('#message');

// Quiz area

let wordNumber = document.querySelector('#word-no');
let correctPct = document.querySelector('#correct-pct');
let infinitiveAnswer = document.querySelector('#answer-infinitive');
let pastSimpleAnswer = document.querySelector('#answer-past-simple');
let pastParticipleAnswer = document.querySelector('#answer-past-participle');

// Update functions
function updateStudentScore(){
    if(aluno.words_total === 0){
        correctPct.innerHTML = '0.00';
    }
    else{
        correctPct.innerHTML = (aluno.words_right / aluno.words_total * 100).toFixed(2); 
    } 
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
    let promptedName = prompt("What is the student's name?","Student Name");
    let promptedWords = Number(prompt("How many verbs from the list does " + promptedName + " already know?", "1"));

    if(promptedName != "" && Number.isSafeInteger(promptedWords) && promptedWords > 0){
        aluno.name = promptedName;
        aluno.words_learned = promptedWords;
        console.log(aluno);
        studentName.innerHTML = aluno.name;
        studentLearnedWords.innerHTML = aluno.words_learned;

        // Signal to the state machine that there is a registered student
        stateMachine(states.STUDENT_REGISTERED);
    }else{
        alert('Student name is empty or the number of words given was incorrect.');
    } 
};

const listOfVerbs = []; // stores all verbs that are in the txt file loaded as verb list.

const loadListBtn = document.querySelector('#word-list');
loadListBtn.addEventListener('input', function(e){
    var fr2 = new FileReader();
    fr2.onload = function(){
        /*
        The .txt file will separate each verb with '*' and each groups of conjugations
        of the same verb with '#'. there might be new line characters in the read file.
        */

        // remove any kind of line break that may appear
        
        let verbsReadWithLineBreak = fr2.result.replace(/(\r\n|\n|\r)/gm,""); 

        let verbsRead = verbsReadWithLineBreak.split('*');

        console.log(verbsRead);

        verbsRead.forEach(verbForm => {
            let singleVerb = verbForm.split('#');
            listOfVerbs.push(new verb(singleVerb[0], singleVerb[1], singleVerb[2], false));   
        });

        console.log(listOfVerbs);
    }
    fr2.readAsText(this.files[0]);
});

let startBtn = document.querySelector('#btn-start');
startBtn.onclick = function(){
    // Only start the quiz if there is a list of verbs loaded to the system.
    if(listOfVerbs.length > 0){
        wordNumber.innerHTML = 1;
        resetVerbList(listOfVerbs);
        // Initialize score
        resetStudentScore();
        updateStudentScore();
        logMessage = studentName.innerHTML + '*' + studentLearnedWords.innerHTML + '*\n\nQUIZ LOG:\n\n';
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
    else{
        alert('Cannot start quiz because there are no verbs to be shown. Load a valid list of verbs to the application.');
    }
    
}

let correctBtn = document.querySelector('#btn-correct');
correctBtn.onclick = function(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('|' + infinitiveAnswer.innerHTML + '|' + 
        pastSimpleAnswer.innerHTML + '|' + pastParticipleAnswer.innerHTML + '|' + ' >>> (correct)' + '\n');
    // Check if all words were already taken. No new words to show.
    if(aluno.words_total >= Number(studentLearnedWords.innerHTML))
    {
        stateMachine(states.NO_MORE_WORDS);
    }
    else{
        // Student still has verbs to see. Show next verb.
        wordNumber.innerHTML = aluno.words_total + 1;
        // Signal to the state machine that new word is ready
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
};

let incorrectBtn = document.querySelector('#btn-incorrect');
incorrectBtn.onclick = function(){
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('*|' + infinitiveAnswer.innerHTML + '|' + 
    pastSimpleAnswer.innerHTML + '|' + pastParticipleAnswer.innerHTML + '|' + ' >>> (incorrect)' + '\n');
    // Check if all words were already taken. No new words to show.
    if(aluno.words_total >= Number(studentLearnedWords.innerHTML))
    {
        stateMachine(states.NO_MORE_WORDS);
    }
    else{
        // Student still has verbs to see. Show next verb.
        wordNumber.innerHTML = aluno.words_total + 1;
        // Signal to the state machine that new word is ready
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
};

let showAnsBtn = document.querySelector('#btn-show-answer');
showAnsBtn.onclick = function(){
    // Signal to the state machine that answer was shown
    stateMachine(states.QUIZ_STARTED_ANSWER_SHOWN);
};

/* 
----------------------------------------------------------------------------------
File Reading
----------------------------------------------------------------------------------
The program reads a .txt file loaded by the user containing information to be 
stored in data structures (student name and pertaining data).
*/ 

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

/* 
----------------------------------------------------------------------------------
File Writing
----------------------------------------------------------------------------------
The program writes to a .txt file the last quiz's log as well as the student name
and pertaining data.
*/ 

const saveBtn = document.querySelector('#btn-save');
saveBtn.onclick = function(){
    // Mount text file using * separators;
     
    //let data = studentName.innerHTML + '*' + studentLearnedWords.innerHTML;
    logMessage = logMessage.concat('\n' + 'Words correct: ' + aluno.words_right + '\n' + 
        'Words incorrect: ' + String(aluno.words_total - aluno.words_right) + '\n' +
        'Total number of words: ' + aluno.words_total + '\n' +
        'Score: ' + String((aluno.words_right * 100 / aluno.words_total).toFixed(2)) + '%\n' );
    let blob = new Blob([logMessage], {type: "text/plain;charset=utf-8"});
    saveAs(blob, studentName.innerHTML + ".txt"); // using function from external code downloaded from github
    // Reset state machine and student score
    stateMachine(states.STUDENT_REGISTERED);
    wordNumber.innerHTML = 0;
    infinitiveAnswer.innerHTML = '';
    pastSimpleAnswer.innerHTML = '';
    pastParticipleAnswer.innerHTML = '';
    resetStudentScore();
    updateStudentScore();
}

/* 
----------------------------------------------------------------------------------
State Machine
----------------------------------------------------------------------------------
This part of the code configures every button that must be activated or
deactivated depending on the program's state to prevent users from activating
forbidden functions (like starting a quiz without a verb list).
*/ 

const states = {
    REGISTER_STUDENT: 'register-student',
    STUDENT_REGISTERED: 'student-registered',
    QUIZ_STARTED_NO_ANSWER: 'quiz-started-no-answer', 
    QUIZ_STARTED_ANSWER_SHOWN: 'quiz-started-answer-shown',
    NO_MORE_WORDS: 'no-more-words'
};

stateMachine(states.REGISTER_STUDENT);

function stateMachine(currentState){
    if(!currentState){
        throw new Error('State is not defined');
    }
    switch(currentState){
        case states.REGISTER_STUDENT:
            messageBoard.innerHTML = 'Load a student file or create new student data with the NEW STUDENT button.';
            newStudentBtn.disabled = false;
            newStudentBtn.style.backgroundColor="#DDDD00";
            loadBtn.disabled = false;
            loadListBtn.disabled = false;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            correctBtn.disabled = true;
            correctBtn.style.backgroundColor="#005500";
            incorrectBtn.disabled = true;
            incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor="#555500";
            break;
        case states.STUDENT_REGISTERED:
            messageBoard.innerHTML = 'Student data was loaded. Load a list of verbs file and start the quiz anytime.';
            newStudentBtn.disabled = false;
            newStudentBtn.style.backgroundColor="#DDDD00";
            loadBtn.disabled = false;
            loadListBtn.disabled = false;
            startBtn.disabled = false;
            startBtn.style.backgroundColor="#DDDD00";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            correctBtn.disabled = true;
            correctBtn.style.backgroundColor="#005500";
            incorrectBtn.disabled = true;
            incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor="#555500";
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            messageBoard.innerHTML = 'What are the past simple and past participle forms of the chosen verb?';
            shuffledIndex = shuffleVerb(listOfVerbs, wordNumber);
            console.log(shuffledIndex);
            showInfinitive(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            newStudentBtn.disabled = true;
            newStudentBtn.style.backgroundColor="#555500";
            loadBtn.disabled = true;
            loadListBtn.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = false;
            showAnsBtn.style.backgroundColor="#DDDD00";
            correctBtn.disabled = true;
            correctBtn.style.backgroundColor="#005500";
            incorrectBtn.disabled = true;
            incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_SHOWN:
            messageBoard.innerHTML = 'Was the given answer correct or incorrect?';
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            newStudentBtn.disabled = true;
            newStudentBtn.style.backgroundColor="#555500";
            loadBtn.disabled = true;
            loadListBtn.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            correctBtn.disabled = false;
            correctBtn.style.backgroundColor="#00DD00";
            incorrectBtn.disabled = false;
            incorrectBtn.style.backgroundColor="#DD0000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.NO_MORE_WORDS:
            messageBoard.innerHTML = 'There are no more words to show. Press SAVE AND FINISH to create a new quiz.';
            newStudentBtn.disabled = true;
            newStudentBtn.style.backgroundColor="#555500";
            loadBtn.disabled = true;
            loadListBtn.disabled = true;
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            correctBtn.disabled = true;
            correctBtn.style.backgroundColor="#005500";
            incorrectBtn.disabled = true;
            incorrectBtn.style.backgroundColor="#550000";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
    }
}

/* 
----------------------------------------------------------------------------------
The verbs
----------------------------------------------------------------------------------
Data structure to store the irregular verbs. This part uses the same approach as
File Reading to get a .txt file with the list of verbs in the infinitive, past
simple and past participle.
*/ 

class verb {
    constructor(infinitive, past_simple, past_participle, isTaken){
        this._infinitive = infinitive;
        this._past_simple = past_simple;
        this._past_participle = past_participle;
        this._taken = isTaken;       
    }

    get infinitive(){
        return this._infinitive;
    }

    get pastSimple(){
        return this._past_simple;
    }

    get pastParticiple(){
        return this._past_participle;
    }

    get taken(){
        return this._taken;
    }

    set taken(newTaken){
        this._taken = newTaken;
    }
}

/*
----------------------------------------------------------------------------------
Initializing list of verbs
----------------------------------------------------------------------------------
Here, verbs are already inside the program's data structures. The program sets
the attribute taken to false, meaning that the student has not answered a question
about that particular verb. When it happens, the value will be set to true.
*/

function resetVerbList(theListOfVerbs){
    theListOfVerbs.forEach(
        function(theVerb){
            theVerb.taken = false;
        }
    );
}

function resetStudentScore(){
    aluno.words_right = 0;
    aluno.words_total = 0;
}



let shuffledIndex = 0; // Initialize shuffled number

function shuffleVerb(currentListOfVerbs, currentWordCount){
    // Shuffled number is a number between 0 and the end of the verb array (excluding verbs already taken)
    // the number of verbs that were already taken is the current wordCount - 1.
    let takenVerbs = Number(currentWordCount.innerHTML) - 1;
    console.log('Word count = ' + takenVerbs);
    let shuffledNumber = Math.floor(Math.random() * (Number(studentLearnedWords.innerHTML) - takenVerbs)); 
    console.log('shuffled number = ' + shuffledNumber);
    // Scan the whole list of verbs to point to a non-taken verb in sorted position
    for(let i = 0; i < shuffledNumber || currentListOfVerbs[i].taken === true ; i++){
        if(currentListOfVerbs[i].taken === true){
            shuffledNumber++;
        }
    }
    console.log('shuffled index = ' + shuffledNumber);

    // tell list of verbs that this particular verb was taken
    currentListOfVerbs[shuffledNumber].taken = true;
    return shuffledNumber;
}

function showInfinitive(theInfinitive, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    theInfinitive.innerHTML = theListOfVerbs[theIndex].infinitive;
    thePastSimple.innerHTML = '';
    thePastParticiple.innerHTML = '';
}

function showPast(theInfinitive, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    theInfinitive.innerHTML = theListOfVerbs[theIndex].infinitive;
    thePastSimple.innerHTML = theListOfVerbs[theIndex].pastSimple;
    thePastParticiple.innerHTML = theListOfVerbs[theIndex].pastParticiple;
}