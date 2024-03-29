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

        let colorRange = 50;

        // first random value is 255 (so that the color is high in contrast)
        // the other to are randomly selected from 0 to colorRange
        // negative color is the value of 255 - positive_value
        switch (ranNum)
        {
            case 0:
                r_pos = "255";
                r_neg = "0";
                ranNum = Math.floor(Math.random() * colorRange);
                g_pos = ranNum.toString();
                g_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * colorRange);
                b_pos = ranNum.toString();
                b_neg = (255 - ranNum).toString();
                break;
            case 1:
                g_pos = "255";
                g_neg = "0";
                ranNum = Math.floor(Math.random() * colorRange);
                r_pos = ranNum.toString();
                r_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * colorRange);
                b_pos = ranNum.toString();
                b_neg = (255 - ranNum).toString();
                break;
            case 2:
                b_pos = "255";
                b_neg = "0";
                ranNum = Math.floor(Math.random() * colorRange);
                g_pos = ranNum.toString();
                g_neg = (255 - ranNum).toString();
                ranNum = Math.floor(Math.random() * colorRange);
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
let expNum = 60;

// odds is a map with the percentage of the positive color 
// and the value of the amount of stimuli left to create
let odds = new Map();
odds.set("54", expNum);
odds.set("52", expNum);
odds.set("50", expNum);
odds.set("48", expNum);
odds.set("46", expNum);

// oddsLeft is used to get a random trial 
// when the number of trials with a certain percentage reaches 30, 
// the percentage is removed from the array
// the odds stored are the odds of the positive color
let oddsLeft = [54, 52, 50, 48, 46];

// percentage of the positive color of the current trial
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

// variable used for stopping the setTimeout function from executing when the user answers on time
let answerTimeId;

// stores the answer to the stimulus
let currentAnswer = "";

// experiment information based on user's answers
let expInfo = [];

// experiment table headers
let expHeaders = [
    "Answer", "Positive color percentage", 
    "Negative color percentage", "Is fullscreen", 
    "Reaction time in secs", "Answer date and time", 
    "Total points at the time", "Browser",
    "Answer correctness",
    "Number of correct answers until this point"
];

// indicates whether the experiment has started
let experimentStarted = true;

// current answer correctness
let currentAnswerCorrectness = undefined;

// sum of correct answers
let correctAnswers = 0;

// current number of pixels of positive and negative colors
let pixelCount = {
    "positive": 0,
    "negative": 0
}

//----------------------------------------------------------------------------

function main()
{
    initKeyEvents();
    startExperiment();
}

function openFullscreen() 
{
    // opens fullscreen depending on the browser used
    let elem = document.documentElement;

    if (elem.requestFullscreen) 
    {
        elem.requestFullscreen();
    } 
    else if (elem.mozRequestFullScreen)
    {
        elem.mozRequestFullScreen();
    } 
    else if (elem.webkitRequestFullscreen) 
    {
        elem.webkitRequestFullscreen();
    }
    else if (elem.msRequestFullscreen)
    {
        elem.msRequestFullscreen();
    }
}

function initKeyEvents()
{
    // initializes all keydown event listeners 
    // uses availableEvent as indicator for calling appropriate methods

    document.addEventListener("keyup", (event) =>
    {
        isKeyDown = false;
    });

    document.addEventListener("keydown", (event) =>
    {
        if (isKeyDown)
            return;
        
        if (event.code == "Space")
        {
            let mainDiv = document.getElementById("main-container");
            if (eventAvailable.intro)
            {
                openFullscreen();
                mainDiv.removeChild(document.getElementById("instruction-img"));
                mainDiv.removeChild(document.getElementById("color-instructions"));
                mainDiv.removeChild(document.getElementById("proceed-experiment"));
                createCanvas();
                nextTrial();
            }
            if (eventAvailable.continue)
            {
                mainDiv.removeChild(document.getElementById("feedback"));
                if (oddsLeft.length > 0)
                {
                    if (window.innerHeight != screen.height)
                        openFullscreen();
                    pixelCount = {
                        "positive": 0,
                        "negative": 0
                    }
                    nextTrial();
                }
                else 
                {
                    finishExperiment();
                }
            }
        }
        if (eventAvailable.answer)
        {
            handleAnswer(event.key.toLowerCase());
        }
    });
}

function handleAnswer(answer) {
    switch (answer) {
        case "a":
            currentAnswer = "A";
            if (currentPercentage > 50) {
                ++correctAnswers;
                currentAnswerCorrectness = true;
            }
            else if (currentPercentage < 50) {
                currentAnswerCorrectness = false;
            }
            else {
                currentAnswerCorrectness = Math.random() > 0.5;
            }
            continuePanel(3);
            break;
        case "k":
            currentAnswer = "K";
            if (currentPercentage > 50) {
                currentAnswerCorrectness = false;
            }
            else if (currentPercentage < 50) {
                ++correctAnswers;
                currentAnswerCorrectness = true;
            }
            else {
                currentAnswerCorrectness = Math.random() > 0.5;
            }
            continuePanel(3);
            break;
    }
}

function startExperiment()
{
    // starts the experiment
    // also places the introduction to the experiment on the screen
    // !!! not the final solution !!!

    let mainDiv = document.getElementById("main-container");

    let instructionImg = document.createElement("img");
    instructionImg.id = "instruction-img";
    instructionImg.src = "./kontrol-uputstvo.png";
    instructionImg.style.width = "42%";
    instructionImg.style.height = "42%";
    instructionImg.alt = "Slika sa intstrukcijama";
    mainDiv.appendChild(instructionImg);

    createColorInstructions(mainDiv);
    
    let proceedToExperimentText = document.createElement("h3");
    proceedToExperimentText.id = "proceed-experiment";
    proceedToExperimentText.innerText = "Pritisnite <SPACE> da biste počeli eksperiment";
    mainDiv.appendChild(proceedToExperimentText);

}

function createColorInstructions(mainDiv) {
    // positive and negative color explanation

    let colorInstructionDiv = document.createElement("div");
    colorInstructionDiv.id = "color-instructions";
    let positiveDiv = document.createElement("div");
    let negativeDiv = document.createElement("div");
    positiveDiv.style.display = "inline-block";
    negativeDiv.style.display = "inline-block";
    positiveDiv.style.fontSize = "125%";
    negativeDiv.style.fontSize = "125%";
    positiveDiv.style.fontWeight = "bold";
    negativeDiv.style.fontWeight = "bold";
    positiveDiv.innerText = "\"Pozitivna\" boja <A>";
    negativeDiv.innerText = "\"Negativna\" boja <K>";
    positiveDiv.style.padding = "15px 20px";
    negativeDiv.style.padding = "15px 20px";
    positiveDiv.style.backgroundColor = colors.positive;
    negativeDiv.style.backgroundColor = colors.negative;
    positiveDiv.style.color = "black";
    negativeDiv.style.color = "black";

    colorInstructionDiv.appendChild(positiveDiv);
    colorInstructionDiv.appendChild(negativeDiv);

    mainDiv.appendChild(colorInstructionDiv);
}

function finishExperiment()
{
    // shows the ending message and uploads the data collected to the server

    let mainDiv = document.getElementById("main-container");
    let canvas = document.getElementById("main-canvas");
    mainDiv.removeChild(canvas);
        
    createDataTable();
    addDataToTable();

    createExpDataParagraph();

    document.exitFullscreen();
}

function createDataTable() {
    // creates a table that will hold the data from the experiment and it will be shown to the user at the end of the experiment

    let expTable = document.createElement("table");
    expTable.id = "exp-table";
    expTable.style.width = "100%";
    expTable.style.border = "1px solid black";
    expTable.style.backgroundColor = "white";
    expTable.style.textAlign = "left";

    let headerRow = document.createElement("tr");
    for (let header of expHeaders) {
        let h = document.createElement("th");
        h.innerText = header;
        h.style.border = "1px solid black";
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
    canvas.width = window.screen.width / 2;
    canvas.height = window.screen.height / 1.5 + 10;
    canvas.style.marginTop = "5%";
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

function createTrial()
{
    // creates a trial and collects information from it
    
    let trialSize = window.screen.height / 3.0;
    let pixelSize = 2;
    let xOffset = (window.screen.width / 2 - window.screen.height / 1.5) / 2;
    let yOffset = 5;
    
    let trial = [];

    for (let i = 0; i < trialSize; ++i)
    {
        let x = i * pixelSize + xOffset;
        for (let j = 0; j < trialSize; ++j)
        {
            let y = j * pixelSize + yOffset;
            let ranNum = Math.random();
            if (ranNum < (currentPercentage / 100))
            {
                trial.push({x: x, y: y, size: pixelSize, color: colors.positive});
                ++pixelCount["positive"];
            }
            else
            {
                trial.push({x: x, y: y, size: pixelSize, color: colors.negative});
                ++pixelCount["negative"];
            }
        }
    }

    drawTrial(trial)
}

function drawTrial(trial)
{
    // uses the parameter "trial" which is a 2D array which contains objects with
    // necessary information for drawing the trial on the canvas 
    // it contains js objects with attributes: x (for x position), y (for y position),
    // size (represents pixel size) and color (positive or negative color)

    clearCanvas();

    let canvas = document.getElementById("main-canvas");
    let context = canvas.getContext("2d");
    for (let pixel of trial)
    {
        context.fillStyle = pixel.color;
        context.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    }

}

function nextTrial()
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

    createTrial();
    answerTimeId = setTimeout(continuePanel, 3000, 2);
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
        clearTimeout(answerTimeId);
    else
    {
        currentAnswer = "N/A";
        currentAnswerCorrectness = "undefined";
    }

    let mainDiv = document.getElementById("main-container");
    clearCanvas();
    drawCross();

    let feedback = document.createElement("div");
    feedback.id = "feedback";

    let pointsAddedLost = document.createElement("h1");
    let proceedMessage = document.createElement("h2");
    feedback.appendChild(pointsAddedLost);
    feedback.appendChild(proceedMessage);

    switch (answeredCorrectly)
    {
        case 0:
            pointsAddedLost.innerText = "+10 poena";
            points += 10;
            break;
        case 1:
            pointsAddedLost.innerText = "-10 poena";
            points -= 10;
            break;
        case 2:
            pointsAddedLost.innerText = "+0 poena";
            break;
        default:
            pointsAddedLost.innerText = "Proporcija " + currentPercentage + ":" + (100 - currentPercentage) + " " + pixelCount["positive"] + ":" + pixelCount["negative"];
            break;
    }
    proceedMessage.innerText = "Pritisnite <SPACE> za nastavak";

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

    // making a cross by removing the 4 edges of the larger rectangle 
    let startingRecSize = 30;
    let crossSize = startingRecSize / 3;
    let x = (canvas.width - startingRecSize) / 2;
    let y = (canvas.height - startingRecSize) / 2;

    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(x, y, crossSize * 3, crossSize * 3);
    context.clearRect(x, y, crossSize, crossSize);
    context.clearRect(x + crossSize * 2, y, crossSize, crossSize);
    context.clearRect(x, y + crossSize * 2, crossSize, crossSize);
    context.clearRect(x + crossSize * 2, y + crossSize * 2, crossSize, crossSize);

}

function collectInfoFromStim()
{
    // collects information generated by the user answers on the trial
    // headers: ["Answer", "Positive color percentage", "Negative color percentage", "Is fullscreen", "Reaction time", "Answer time", "Points"]
    
    // getting the name of the browser the user is using for the experiment
    //-----------------------------------------------------------------------
    let browserName = ((agent) => 
    {
        switch (true) 
        {
            case agent.indexOf("edge") > -1: return "MS Edge";
            case agent.indexOf("edg/") > -1: return "Edge (chromium based)";
            case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
            case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
            case agent.indexOf("trident") > -1: return "MS IE";
            case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
            case agent.indexOf("safari") > -1: return "Safari";
            default: return "other";
        }
    })(window.navigator.userAgent.toLowerCase());
    //-----------------------------------------------------------------------
    
    let isInFullscreen = window.innerHeight == screen.height;
    let timeTook = endTime - startTime;
    let trialAnswerInfo = [
        currentAnswer, currentPercentage, 
        100 - currentPercentage, isInFullscreen, 
        timeTook, Date(), points, browserName,
        currentAnswerCorrectness, correctAnswers
    ];

    expInfo.push(trialAnswerInfo);
}

function addDataToTable()
{
    // stores the information in the local file 

    let dataTable = document.getElementById("exp-table");
    for (let row of expInfo)
    {
        let expRow = document.createElement("tr");
        for (let el of row)
        {
            let tableEl = document.createElement("td");
            tableEl.innerText = el;
            tableEl.style.border = "1px solid black";
            expRow.appendChild(tableEl);
        }

        dataTable.appendChild(expRow);
    }
}

function createExpDataParagraph()
{
    let csvString = "";
    for (let row of expInfo)
    {
        csvString += row.join(",") + "\n";
    }
    let expDataParagraph = document.createElement("p");
    expDataParagraph.innerText = csvString;
    document.getElementById("main-container").appendChild(expDataParagraph);

}

main();
