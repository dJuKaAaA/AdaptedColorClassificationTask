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

// identificator of the user
let name = "ID";
name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
var results = regex.exec(location.search);
let uniqueID = results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

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
    "ID", "Answer", "Positive color percentage", "Negative color percentage", "Is fullscreen", "Reaction time in secs", "Answer date and time", "Total points at the time", "Browser"
];

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
                        document.documentElement.requestFullscreen();
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
            switch (event.key.toLowerCase())
            {
                case "a":
                    currentAnswer = "A";
                    if (currentPercentage > 50)
                    {
                        continuePanel(0);
                    }
                    else if (currentPercentage < 50)
                    {
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

    let instructionImg = document.createElement("img");
    instructionImg.id = "instruction-img";
    instructionImg.src = "./kontrol-uputstvo.png";
    instructionImg.style.width = "42%";
    instructionImg.style.height = "42%";
    instructionImg.alt = "Slika sa intstrukcijama";
    mainDiv.appendChild(instructionImg);

    createColorInstructions(mainDiv);
    
    let proceedToExperimentText = document.createElement("h2");
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
    positiveDiv.style.fontSize = "25px";
    negativeDiv.style.fontSize = "25px";
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
    
    // let endingMessage = document.createElement("h1");
    // endingMessage.innerText = "Eksperiment je zavrsen -> Osvojili ste " + points + " poena";
    // mainDiv.appendChild(endingMessage);
    
    // createDataTable();
    // addDataToTable();

    // let formsButton = document.createElement("button");
    // formsButton.innerText = "Anketa o eksperimentu";
    // formsButton.onclick = () => { window.location.href = "https://docs.google.com/forms/d/1zvKkXhxkU9Bsf7nxOzf8XJIABKPyUw5uc2fZ11i1Pr4/edit?usp=sharing_eil_se_dm&ts=626e777b"; }
    // formsButton.style.width = "30%";
    // formsButton.style.fontSize = "125%";
    // formsButton.style.marginTop = "2%";
    // mainDiv.appendChild(formsButton);

    sendDataToServer();

    document.exitFullscreen();

    let endingMessage = document.createElement("h1");
    endingMessage.innerText = "Eksperiment je završen -> Pristupanje formi...";
    mainDiv.appendChild(endingMessage);

    setTimeout(() => { 
        window.location.href = "https://docs.google.com/forms/d/1zvKkXhxkU9Bsf7nxOzf8XJIABKPyUw5uc2fZ11i1Pr4/edit?usp=sharing_eil_se_dm&ts=626e777b";
    }, 1500);

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
    canvas.width = 800;
    canvas.height = 600;
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
    
    let trialSize = 250;
    let pixelSize = 2;
    let positivePixelsLeft = currentPercentage / 100 * pixelSize * trialSize;
    let negativePixelsLeft = (1 - currentPercentage / 100) * pixelSize * trialSize; 
    let trial = [];

    for (let i = 0; i < trialSize; ++i)
    {
        let row = [];
        let x = i * pixelSize + 150;
        for (let j = 0; j < trialSize; ++j)
        {
            let y = j * pixelSize + 50;
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
        trial.push(row);
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
    for (let row of trial)
    {
        for (let rectInfo of row)
        {
            context.fillStyle = rectInfo.color;
            context.fillRect(rectInfo.x, rectInfo.y, rectInfo.size, rectInfo.size);
        }
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
        currentAnswer = "N/A";

    // safety measures
    if (answeredCorrectly < 0)
        answeredCorrectly = 0;
    else if (answeredCorrectly > 2)
        answeredCorrectly = 2; 

    let mainDiv = document.getElementById("main-container");
    clearCanvas();
    drawCross();

    let feedback = document.createElement("div");
    feedback.id = "feedback";

    let pointsAddedLost = document.createElement("h1");
    let balance = document.createElement("h2");
    let proceedMessage = document.createElement("h2");
    feedback.appendChild(pointsAddedLost);
    feedback.appendChild(balance);
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
            pointsAddedLost.innerText = "...";
            break;
    }
    balance.innerText = "Balans: " + points + " poena";
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

    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(385, 285, 30, 30);
    context.clearRect(385, 285, 10, 10);
    context.clearRect(405, 285, 10, 10);
    context.clearRect(385, 305, 10, 10);
    context.clearRect(405, 305, 10, 10);

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
        uniqueID, currentAnswer, currentPercentage, 100 - currentPercentage, isInFullscreen, timeTook, Date(), points, browserName
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

function sendDataToServer() 
{
    let csvString = "";

    // creating XMLhttpRequest object
    let xhr;
    if (window.XMLHttpRequest) 
    { 
        // Mozilla, Safari, ...
        xhr = new XMLHttpRequest();
    } 
    else if (window.ActiveXObject) 
    {
        // IE 8 and older
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    for (let row of expInfo)
    {
        csvString += row.join(",") + "\n";
    }
  
    // Build the URL to connect to
    let url = "save-userinfo.php";
    // let url = "http://localhost/save-userinfo.php";
  
    // Open a connection to the server
    xhr.open("POST", url, true);
  
    // declaring that the data being sent is in XML format
    xhr.setRequestHeader("Content-Type", "text/plain");
  
    // Send the request
    xhr.send(csvString);
}

main();