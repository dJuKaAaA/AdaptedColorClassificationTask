// Danilo magistarski eksperiment

// colors class for generating the positive and negative colors
class Colors 
{
    constructor()
    {

        // getting the random value of the colors
        //-----------------------------------------------------------
        let r_pos = "";
        let g_pos = "";
        let b_pos = "";
        let r_neg = "";
        let g_neg = "";
        let b_neg = "";
        let ranNum = Math.floor(Math.random() * 3);


        // first random value is 255 (so that the color is high in contrast)
        // the other to are randomly selected from 0 to 255
        // negative color is the value of 255 - positive_value
        switch (ranNum)
        {
            case 0:
                r_pos = "255";
                r_neg = "0";
                ranNum = Math.floor(Math.random() * 255);
                g_pos = ranNum.toString();
                g_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * 255);
                b_pos = ranNum.toString();
                b_neg = (255 - ranNum).toString();
                break;
            case 1:
                g_pos = "255";
                g_neg = "0";
                ranNum = Math.floor(Math.random() * 255);
                r_pos = ranNum.toString();
                r_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * 255);
                b_pos = ranNum.toString();
                b_neg = (255 - ranNum).toString();
                break;
            case 2:
                b_pos = "255";
                b_neg = "0";
                ranNum = Math.floor(Math.random() * 255);
                g_pos = ranNum.toString();
                g_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * 255);
                r_pos = ranNum.toString();
                r_neg = (255 - ranNum).toString();
                break;
        }
        //-----------------------------------------------------------

        this.positive = "rgb(" + r_pos + ", " + g_pos + ", " + b_pos + ")";
        this.negative = "rgb(" + r_neg + ", " + g_neg + ", " + b_neg + ")";

    }
}

// global variables:
//----------------------------------------------------------------------------

// number of experiments per all proportions
let expNum = 1;

// odds is a map with the percentage of the positive color 
// and the value of the amount of stimuli left to create
let odds = new Map();
odds.set("54", expNum);
odds.set("52", expNum);
odds.set("50", expNum);
odds.set("48", expNum);
odds.set("46", expNum);

// oddsLeft is used to get a random stimuli 
// when the number of stimuli with a certain percentage reaches 30, 
// the percentage is removed from the array
// the odds stored are the odds of the positive color
let oddsLeft = [54, 52, 50, 48, 46];

// percentage of the positive color of the current stimulus
let currentPercentage;

// contains the positive color and the negative color
let colors = new Colors();

// amount of points scored
let points = 0;

// used for determining when to use certain key presses 
let eventAvailable = {
    intro: true,
    answer: false,
    continue: false
}

// determines if the key has already been pressed down
let isKeyDown = false;

// used for determining how long it took the user to answer
let startTime;
let endTime;

// variable used for stopping the setTimeout function from executing when the user answer in time
let timeoutId;

// stores the answer to the stimulus
let currentAnswer = "";

// experiment information based on user's answers
let expInfo = []

// experiment table headers
let expHeaders = ["Answer", "Positive color percentage", "Negative color percentage", "Is fullscreen", "Reaction time", "Answer time", "Points"]


//----------------------------------------------------------------------------


function main()
{
    initKeyEvents();
    startExperiment();
}

function initKeyEvents()
{
    // initializes all keydown event listeners 
    // uses avaliableEvent as indicator for calling appropriate methods

    document.addEventListener("keyup", (event) =>
    {
        isKeyDown = false;
    });

    document.addEventListener("keydown", (event) =>
    {
        if (isKeyDown)
            return;

        if (event.keyCode == 32)
        {
            let mainDiv = document.getElementById("main-container");
            if (eventAvailable.intro)
            {
                document.documentElement.requestFullscreen();
                mainDiv.removeChild(document.getElementById("intro"));
                createCanvas();
                nextStimulus();
            }
            if (eventAvailable.continue)
            {
                mainDiv.removeChild(document.getElementById("feedback"));
                if (oddsLeft.length > 0)
                {
                    if (window.innerHeight != screen.height)
                        document.documentElement.requestFullscreen();
                    nextStimulus();
                }
                else 
                {
                    finishExperiment();
                }
            }
        }
        if (eventAvailable.answer)
        {
            switch (event.key)
            {
                case "a":
                    currentAnswer = "A";
                    if (currentPercentage > 50)
                    {
                        points += 10;
                        continuePanel(0);
                    }
                    else if (currentPercentage < 50)
                    {
                        points -= 10;
                        continuePanel(1);
                    }
                    else
                    {
                        continuePanel(2);
                    }
                    break;
                case "k":
                    currentAnswer = "K";
                    continuePanel(2);
                    break;
            }
        }
    });
}

function startExperiment()
{
    // starts the experiment
    // also places the introduction to the experiment on the screen
    // !!! not the final solution !!!

    let mainDiv = document.getElementById("main-container");
    let intro = document.createElement("h1");
    intro.id = "intro";
    intro.innerText = "Dobro dosli na eksperiment. Ova poruka je postavljena radi testiranja i nece predstavljati finalni proizvod. <SPACE> za nastavak";
    mainDiv.appendChild(intro);

}

function finishExperiment()
{
    // shows the ending message and uploads the data collected to the server

    let mainDiv = document.getElementById("main-container");
    let canvas = document.getElementById("main-canvas");
    mainDiv.removeChild(canvas);
    
    let endingMessage = document.createElement("h1");
    endingMessage.innerText = "Eksperiment je zavrsen. Osvojili ste $" + points;
    mainDiv.appendChild(endingMessage);
    
    createDataTable();
    addDataToTable();

    document.exitFullscreen();

}

function createDataTable() {
    // creates a table that will hold the data from the experiment and it will be shown to the user at the end of the experiment

    let expTable = document.createElement("table");
    expTable.id = "exp-table";
    expTable.style.marginLeft = "25%";
    expTable.style.width = "800px";
    expTable.style.backgroundColor = "white";

    let headerRow = document.createElement("row");
    for (let header of expHeaders) {
        let h = document.createElement("th");
        h.innerText = header;
        headerRow.appendChild(h);
    }
    expTable.appendChild(headerRow);

    document.getElementById("main-container").appendChild(expTable);

}

function removeAllEventListeners()
{
    let mainDiv = document.getElementById("main-container");
    mainDiv.replaceWith(mainDiv.cloneNode(true));
}

function createCanvas() 
{
    // the system creates the canvas tag and places it inside the body of the html file
    
    let mainDiv = document.getElementById("main-container");

    let canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.backgroundColor = "rgb(255, 255, 255)";
    canvas.id = "main-canvas";
    eventAvailable.intro = false;

    mainDiv.appendChild(canvas);
}

function clearCanvas()
{
    // clears the canvas for redrawing

    let canvas = document.getElementById("main-canvas");
    let context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function createStimulus()
{
    // creates a stimulus and collects information from stimulus
    
    let stimulusSize = 250;
    let pixelSize = 2;
    let positivePixelsLeft = currentPercentage / 100 * pixelSize * stimulusSize;
    let negativePixelsLeft = (1 - currentPercentage / 100) * pixelSize * stimulusSize; 
    let stimulus = [];

    for (let i = 0; i < stimulusSize; ++i)
    {
        let row = [];
        let x = i * pixelSize + 150;
        for (let j = 0; j < stimulusSize; ++j)
        {
            let y = j * pixelSize + 25;
            let ranNum = Math.random();
            if (ranNum > 0.5)
            {
                if (positivePixelsLeft > 0)
                {
                    row.push({x: x, y: y, size: pixelSize, color: colors.positive});
                    --positivePixelsLeft;
                }
                else 
                {
                    row.push({x: x, y: y, size: pixelSize, color: colors.negative});
                    --negativePixelsLeft;
                }
            }
            else
            {
                if (negativePixelsLeft > 0)
                {
                    row.push({x: x, y: y, size: pixelSize, color: colors.negative});
                    --negativePixelsLeft;
                }
                else 
                {
                    row.push({x: x, y: y, size: pixelSize, color: colors.positive});
                    --positivePixelsLeft;
                }
            }
        }
        stimulus.push(row);
    }

    drawStimulus(stimulus)

}

function drawStimulus(stimulus)
{
    // uses the parameter "stimulus" which is a 2D array which contains objects with
    // necessary information for drawing the stimulus on the canvas 
    // it contains js objects with attributes: x (for x position), y (for y position),
    // size (represents pixel size) and color (positive or negative color)

    clearCanvas();

    let canvas = document.getElementById("main-canvas");
    let context = canvas.getContext("2d");
    for (let row of stimulus)
    {
        for (let rectInfo of row)
        {
            context.fillStyle = rectInfo.color;
            context.fillRect(rectInfo.x, rectInfo.y, rectInfo.size, rectInfo.size);
        }
    }

}

function nextStimulus()
{
    // generates the next stimulus and checks the users anwser

    let ranIndex = Math.floor(Math.random() * oddsLeft.length);
    currentPercentage = oddsLeft[ranIndex];

    let left = odds.get(currentPercentage.toString());
    odds.set(currentPercentage.toString(), --left);

    if (odds.get(currentPercentage.toString()) == 0)
    {
        oddsLeft.splice(ranIndex, 1);
    }

    eventAvailable.continue = false;
    eventAvailable.answer = true;

    createStimulus();
    timeoutId = setTimeout(continuePanel, 3000, 2);
    startTime = Date.now();

}

function continuePanel(answeredCorrectly)
{
    // displays the panel that contains information about how the user did the previous
    // stimulus and waits for the user's input to proceed with the experiment
    // parameter answeredCorrectly expects a number between 0 and 2
    // 0 -> correct, 1 -> incorrect, 2 -> nothing

    endTime = Date.now();
    let timeTook = endTime - startTime;

    // if the user answered on time
    if (timeTook < 3000)
        clearTimeout(timeoutId);

    // safety measures
    if (answeredCorrectly < 0)
        answeredCorrectly = 0;
    else if (answeredCorrectly > 2)
        answeredCorrectly = 2; 

    let mainDiv = document.getElementById("main-container");
    clearCanvas();
    drawCross();

    let feedback = document.createElement("h3");
    feedback.id = "feedback";
    switch (answeredCorrectly)
    {
        case 0:
            feedback.innerText = "Dobili ste $10";
            break;
        case 1:
            feedback.innerText = "Izgubili ste $10";
            break;
        case 2:
            feedback.innerText = "Bez dobitka i gubitka";
            break;
        default:
            feedback.innerText = "...";
            break;
    }

    mainDiv.appendChild(feedback);
    eventAvailable.answer = false;
    eventAvailable.continue = true;

    collectInfoFromStim();

}

function drawCross()
{
    // draws a cross on the canvas 

    let canvas = document.getElementById("main-canvas");
    let context = canvas.getContext("2d")

    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(340, 240, 120, 120);
    context.clearRect(340, 240, 40, 40);
    context.clearRect(420, 240, 40, 40);
    context.clearRect(340, 320, 40, 40);
    context.clearRect(420, 320, 40, 40);

}

function collectInfoFromStim()
{
    // collects information generated by the user answers on the stimulus
    // headers: ["Answer", "Positive color percentage", "Negative color percentage", "Is fullscreen", "Reaction time", "Answer time", "Points"]

    let isInFullscreen = window.innerHeight == screen.height;
    let timeTook = endTime - startTime;
    let stimAnswerInfo = [
        currentAnswer, currentPercentage, 100 - currentPercentage, isInFullscreen, timeTook + "ms", Date(), points
    ];

    expInfo.push(stimAnswerInfo);

}

function addDataToTable()
{
    // stores the information in the local file 

    let dataTable = document.getElementById("exp-table");
    for (let row of expInfo)
    {
        let expRow = document.createElement("row");
        for (let el of row)
        {
            let tableEl = document.createElement("td");
            tableEl.innerText = el;
            expRow.appendChild(tableEl);
        }

        dataTable.appendChild(expRow);
    }

}

function sendToServer() 
{

}

main();