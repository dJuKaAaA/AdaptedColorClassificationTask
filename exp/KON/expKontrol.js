// Danilo magistarski eksperiment

// colors class for generating the positive and negative colors
class Colors 
{
    constructor()
    {
        // getting the colors
        //-------------------------------------------------------------
        const HSBToRGB = (h, s, b) => {
            s /= 100;
            b /= 100;
            const k = (n) => (n + h / 60) % 6;
            const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
            return [255 * f(5), 255 * f(3), 255 * f(1)];
        };
        let pos = Math.round(Math.random() * 360);
        let neg = (pos + 180) % 360;

        let [r_pos, g_pos, b_pos] = HSBToRGB(pos, 100, 100);
        let [r_neg, g_neg, b_neg] = HSBToRGB(neg, 100, 100);
 
        this.positive = `RGB(${r_pos}, ${g_pos}, ${b_pos})`
        this.negative = `RGB(${r_neg}, ${g_neg}, ${b_neg})`
        //-------------------------------------------------------------
    }
}

// global variables:
//----------------------------------------------------------------------------

// identificator of the user
let studentIndex = "";

// number of experiments per all proportions
let expNum = 30;

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
let expInfo = [[`${colors.positive}`, `${colors.negative}`]];

// experiment table headers
let expHeaders = [
    "ID", "Answer", "Positive color percentage", "Negative color percentage", "Is fullscreen", "Reaction time in secs", "Answer date and time", "Total points at the time", "Browser"
];

// indicates whether the experiment has started
let experimentStarted = true;

// tutorial trials count
let tutorialTrialsCompleted = 0;
const tutorialTrialsCount = 3;

// is debug mode enabled
let debugMode = false;

// when it's 50:50 it needs to alternate between positive and negative answers
let positive50Answer = true;

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
    // uses avaliableEvent as indicator for calling appropriate methods

    if (!experimentStarted)
    {
        return;
    }

    document.addEventListener("keyup", (event) =>
    {
        isKeyDown = false;
    });

    document.addEventListener("keydown", (event) =>
    {
        if (isKeyDown)
            return;

        if (!experimentStarted)
            return;
        
        if (event.code == "Space")
        {
            let mainDiv = document.getElementById("main-container");
            if (eventAvailable.intro)
            {
                openFullscreen();
                mainDiv.removeChild(document.getElementById("instruction-img"));
                mainDiv.removeChild(document.getElementById("color-instructions"));
                studentIndex = document.getElementById("student-index").value;
                mainDiv.removeChild(document.getElementById("student-index"));
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
                        continuePanel(3);
                    }
                    break;
                case "k":
                    currentAnswer = "K";
                    continuePanel(2);
                    break;
            }
        }
        if (event.key.toLowerCase())
        {
            debugMode = !debugMode;
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

    let studentNameTextField = document.createElement("input");
    studentNameTextField.type = "text";
    studentNameTextField.id = "student-index";
    studentNameTextField.style.margin = "20px";
    mainDiv.appendChild(studentNameTextField)
    
    let proceedToExperimentText = document.createElement("h3");
    proceedToExperimentText.id = "proceed-experiment";
    proceedToExperimentText.innerText = "Pritisnite <SPACE> da biste počeli probu";
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
    positiveDiv.style.textShadow = "0px 0px 10px white"
    negativeDiv.style.textShadow = "0px 0px 10px white"

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

    // comment out when not using a server
    // sendDataToServer();

    // comment out when using a server
    saveCSVFile();

    document.exitFullscreen();

    let endingMessage = document.createElement("h1");
    endingMessage.innerText = "Eksperiment je završen";
    mainDiv.appendChild(endingMessage);

    // setTimeout(() => { 
    //     window.location.href = "https://docs.google.com/forms/d/1zvKkXhxkU9Bsf7nxOzf8XJIABKPyUw5uc2fZ11i1Pr4/edit?usp=sharing_eil_se_dm&ts=626e777b";
    // }, 1500);

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
            }
            else
            {
                trial.push({x: x, y: y, size: pixelSize, color: colors.negative});
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
    if (tutorialTrialsCompleted >= tutorialTrialsCount)
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
    
    if (debugMode)
    {
        console.log(`Current proportions: ${currentPercentage}:${100 - currentPercentage}`)
    }
}

function continuePanel(answeredCorrectly)
{
    // displays the panel that contains information about how the user did the previous
    // stimulus and waits for the user's input to proceed with the experiment

    tutorialTrialsCompleted = (tutorialTrialsCompleted <= tutorialTrialsCount) ? (tutorialTrialsCompleted + 1) : (tutorialTrialsCount + 1);

    endTime = Date.now();
    let timeTook = endTime - startTime;

    // if the user answered on time
    if (timeTook < 3000)
        clearTimeout(answerTimeId);
    else
        currentAnswer = "N/A";

    if (answeredCorrectly == 3)
    {
        answeredCorrectly = (positive50Answer) ? (1) : (0);
        positive50Answer = !positive50Answer;
    }

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
    proceedMessage.innerText = (tutorialTrialsCompleted != tutorialTrialsCount) ? ((tutorialTrialsCompleted < tutorialTrialsCount) ? ("Pritisnite <SPACE> za nastavak (proba)") : ("Pritisnite <SPACE> za nastavak")) : ("Pritisnite <SPACE> da biste poceli eksperiment");

    mainDiv.appendChild(feedback);
    eventAvailable.answer = false;
    eventAvailable.continue = true;

    if (tutorialTrialsCompleted > tutorialTrialsCount)
        collectInfoFromStim();
    else if (tutorialTrialsCompleted == tutorialTrialsCount)
        points = 0;

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
        studentIndex, currentAnswer, currentPercentage, 100 - currentPercentage, isInFullscreen, timeTook, Date(), points, browserName
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

function saveCSVFile() 
{
    // used for saving .csv file when the experiment is not being done from a server
    let csvString = "";
    for (let row of expInfo)
    {
        csvString += row.join(",") + "\n";
    }
    let blob = new Blob([csvString], { type: "text/plain; charset=utf-8;"});
    saveAs(blob, `kon_${studentIndex}.csv`);
}

main();
