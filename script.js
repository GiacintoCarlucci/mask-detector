let video;
let classifier;
let faceApi;
let label = 'Loading...';
let color = "black";
let start = false;
let height = 480;
let width = 640;
let box = {
    topLeftX: width / 2,
    topLeftY: height / 2,
    bottomLeftX: width / 2,
    bottomLeftY: height / 2,
    width: 0,
    height: 0
};

const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
};

function preload() {
    faceApi = ml5.faceApi(detectionOptions, modelLoaded);
    classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/ldvAg_gEJ/model.json');
}

function modelLoaded() {
    console.log("Face Api ready!");
    start = true;
}

function setup() {
    video = createCapture(VIDEO);
    createCanvas(width, height);
    video.hide();
    faceDetection();
    classifyVideo();
}

function faceDetection() {
    faceApi.detect(video, gotFace);
}

function gotFace(error, results) {
    if (error) {console.error(error); return;}
    // console.log(results);
    if (results[0]) {
        box.bottomLeftX = results[0].alignedRect.box.bottomLeft._x;
        box.bottomLeftY = results[0].alignedRect.box.bottomLeft._y;

        box.topLeftX = results[0].alignedRect.box.topLeft._x;
        box.topLeftY = results[0].alignedRect.box.topLeft._y;

        box.width = results[0].alignedRect.box._width;
        box.height = results[0].alignedRect.box._height;
    }
}

function classifyVideo() {
    classifier.classify(video, gotResults);
}

function gotResults(error, results) {
    if (error) {console.error(error); return;}
    else if (results) {
        label = results[0].label
        if (label === "yes_mask") {color = "#8BC34A"}
        else if (label === "no_mask") { color = "#F44336"}
        else { color = "#FFFFFF"}
    }
    classifyVideo()
}

//p5.js function used to display video and boxes with labels
function draw() {
    faceDetection();
    background('#EEEEEE');
    if (start) {
        image(video, (width - video.width) / 2, 0);
        fill(color);
        noStroke();
        textSize(32);
        textAlign(LEFT);
        text(label, box.bottomLeftX, box.bottomLeftY + 32);
        noFill();
        stroke(color);
        strokeWeight(5);
        rect(box.topLeftX, box.topLeftY, box.width, box.height);
    } else {
        fill("black");
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Loading...", width / 2, height / 2);
    }
}
