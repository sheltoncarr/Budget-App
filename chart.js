// Select Chart Element
const chart = document.querySelector(".chart");

// Create Canvas Element
const canvas = document.createElement("canvas");
canvas.width = 50;
canvas.height = 50;

// Append Canvas to Chart Element
chart.appendChild(canvas);

// Get context of canvas to draw on canvas
const ctx = canvas.getContext("2d");

// Line Width
ctx.lineWidth = 10;

// Circle Radius
const R = 20;

function drawCircle(color, ratio, anticlockwise){
    // Draws circle
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

function updateChart( income, outcome){
    // Update circle chart based on income and outcome ratio
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income+outcome);

    drawCircle("#00ff00", - ratio, true);
    drawCircle("#ff0000", 1 - ratio, false);
}
