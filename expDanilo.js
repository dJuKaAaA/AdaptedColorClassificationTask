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

// odds is a map with the percentage of the positive color 
// and the value of the amount of stimuli left to create
let odds = new Map();
odds.set("54", 30);
odds.set("52", 30);
odds.set("50", 30);
odds.set("48", 30);
odds.set("46", 30);

// oddsLeft is used to get a random stimuli 
// when the number of stimuli with a certain percentage reaches 30, 
//the percentage is removed from the array
let oddsLeft = [54, 52, 50, 48, 46];

// contains the positive color and the negative color
let colors = new Colors();

// amount of points scored
let points = 0;

//----------------------------------------------------------------------------


function main()
{
    introduction();
    runExperiment();
}

function introduction()
{
    // places the introduction to the experiment on the screen
    // !!! not the final solution !!!

    let mainDiv = document.getElementById("main-container");
    let intro = document.createElement("h1");
    intro.innerText = "Dobro dosli na eksperiment. Ova poruka je postavljena radi testiranja i nece predstavljati finalni proizvod. <space> za nastavak";
    mainDiv.appendChild(intro);

    document.addEventListener("keydown", (event) =>
    {
        if (event.keyCode == 32)
        {
            document.documentElement.requestFullscreen();
            mainDiv.removeChild(intro)
            createCanvas()
        }
    });

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

    mainDiv.appendChild(canvas);
}

function clearCanvas()
{
    // clears the canvas for redrawing

    let canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function createStimulus(colors, percentage)
{
    // creates a stimulus and collects information from stimulus
    
    let canvas = document.getElementById("main-canvas");
    let stimulusSize = 200;
    let pixelSize = 2;
    let positivePixelsLeft = percentage / 100 * pixelSize * stimulusSize;
    let negativePixelsLeft = (1 - percentage / 100) * pixelSize * stimulusSize; 
    let stimulus = [];

    for (let i = 0; i < stimulusSize; ++i)
    {
        let row = [];
        let x = i * pixelSize + 200;
        for (let j = 0; j < stimulusSize; ++j)
        {
            let y = j * pixelSize + 20;
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
        for (let obj of row)
        {
            context.fillStyle = obj.color;
            context.fillRect(obj.x, obj.y, obj.size, obj.size);
        }
    }

}

function runExperiment()
{
    // runs the experiment

    document.addEventListener("keydown", (event) =>
    {
        if (event.keyCode == 32)
        {
            if (oddsLeft.length > 0)
                nextStimulus();
            else
                console.log("Finished experiment");
        }
    });

    nextStimulus();
}

function nextStimulus()
{
    // generates the next stimulus

    let ranIndex = Math.floor(Math.random() * oddsLeft.length);
    let percentage = oddsLeft[ranIndex];

    let left = odds.get(percentage.toString());
    odds.set(percentage.toString(), --left);

    if (odds.get(percentage.toString()) == 0)
    {
        oddsLeft.splice(ranIndex, 1);
    }

    createStimulus(colors, percentage);

}


main();