// Danilo magistarski eksperiment

function main()
{
    createCanvas();
    // runExperiment();
    
    let colors = new Colors();
    createStimulus(colors, 54);

}

function createCanvas() 
{
    // the system creates the canvas tag and places it inside the body of the html file
    
    let canvasContainer = document.getElementById("canvas-container");
    canvasContainer.style.textAlign = "center";

    let canvas = document.createElement("canvas");
    let canvasSizeOffset = 1.25;
    canvas.width = window.screen.width / canvasSizeOffset;
    canvas.height = window.screen.height / canvasSizeOffset;
    canvas.style.backgroundColor = "rgb(255, 255, 255)";
    canvas.id = "main-canvas";

    canvasContainer.appendChild(canvas);
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
    let stimulusSize = 200;
    let pixelSize = 2;
    let positivePixelsLeft = percentage / 100 * pixelSize * stimulusSize;
    let negativePixelsLeft = (1 - percentage / 100) * pixelSize * stimulusSize; 
    let stimulus = [];

    for (let i = 0; i < stimulusSize; ++i)
    {
        let row = [];
        let x = i * pixelSize;
        for (let j = 0; j < stimulusSize; ++j)
        {
            let y = j * pixelSize;
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
    oddsLeft = [54, 52, 50, 48, 46];

    let colors = new Colors();
    while (oddsLeft.length > 0)
    {

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

}

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

main();