// Pointer finger to draw or pick color; flat "stop" hand to move pointer.  If it's having trouble tracking your finger, either change your background or try including your middle finger with your pointer finger.
//Handpose code by the ml5.js team.  Visit https://ml5js.org/
// Adapted from Drawing code by Steve's Makerspac, Video: https://youtu.be/96sWFP9CCkQ

let handpose;
let video;
let predictions = [];
let canvas2;
let prevtop = null;
let prevleft = null;
let leftArr = [];
let topArr = [];
let leftAvg, topAvg;
let pointerX, pointerY, knuckle, ring;
let stepSize = 5;
let myPixels = [];
let colorPicker;
let mspaint;

function preload(){
  mspaint = loadImage('mspaint.png');
}
function setup() {
  createCanvas(900, 700);
  canvas2 = createGraphics(640, 480);
  makesquares();
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
colorPicker = createColorPicker('#ed225d');
  colorPicker.position(10, 750); 
  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", (results) => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
  
  rectMode(CENTER);
  for (let y = 0; y < height; y += stepSize) {
    for (let x = 0; x < width; x += stepSize) {
      myPixels.push(new Pixel(x, y));
    }
  }
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(mspaint, 0, 0, 900, 700);
  translate(width, 0);
  scale(-1, 1);
  
  image(video, 150, 90, 640, 480);
  image(canvas2, 150, 90);
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    canvas2.strokeWeight(10);
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      //ellipse(keypoint[0], keypoint[1], 10, 10);
      if (j == 8) {
        pointerX = keypoint[0];
        pointerY = keypoint[1];
        //print(keypoint);
      } else
      if (j == 14) {
        knuckle = keypoint[1];
      } else
      if (j == 16) {
        ring = keypoint[1];
      }
    }
    //If the ring finger is not extended then draw a line or pick a color
    if (knuckle < ring) {
      fill(0);
      //ellipse(pointerX+150, pointerY+90, 10, 10);
      if (pointerX < width - 70) {
        getaverages();

        canvas2.noStroke();
        //canvas2.stroke(colr, colg, colb);
        if (leftArr.length > 2 && prevleft>0) {
          // canvas2.line(prevleft, prevtop, leftAvg, topAvg);
          //canvas2.rect(prevleft, prevtop, 5,5);
          if (prevleft > 0) {
          prevleft = leftAvg;
          prevtop = topAvg;}
          else{
            prevleft = pointerX;
            prevtop = pointerY;
          }
        }
      } else {
        if (pointerY < 70) {
          colr = 0;
          colg = 255;
          colb = 255;
        }
        
        if (pointerY > 70 && pointerY < 140) {
          colr = 255;
          colg = 0;
          colb = 255;
        }
        if (pointerY > 140 && pointerY < 210) {
          colr = 255;
          colg = 255;
          colb = 0;
        }
        if (pointerY > 210 && pointerY < 280) {
          makesquares();
        }
      }
    } else {
      //If the hand is extended, then just mark where it is and clear the arrays
      fill(255);
      ellipse(pointerX+150, pointerY+90, 10, 10);
      leftArr.length = 0;
      topArr.length = 0;
      leftAvg = 0;
      topAvg = 0;
      prevleft = pointerX;
      prevtop = pointerY;
      for (let i = 0; i < myPixels.length; i++) {
        
        if (dist(myPixels[i].pos.x, myPixels[i].pos.y, pointerX, pointerY) < stepSize / 2) {
          
          myPixels[i].draw();
        }
  }
    }
  }
  
  
}

function getaverages() {
  if (leftArr.length > 5) {
    leftArr.splice(0, 1);
    topArr.splice(0, 1);
  }
  if (pointerX > 0 ) {
  leftArr.push(pointerX);
  topArr.push(pointerY);
  }
  let leftSum = 0;
  let topSum = 0;
  for (i = 0; i < leftArr.length; i++) {
    leftSum = leftSum + leftArr[i];
    topSum = topSum + topArr[i];
  }
  leftAvg = leftSum / leftArr.length;
  topAvg = topSum / topArr.length;
  
}

function makesquares() {
  canvas2.background(255);
  canvas2.clear();
//   //background(255);
//   //clear();
//   // canvas2.fill(0, 255, 255);
//   // canvas2.rect(width, 0, -70, 70);
//   // canvas2.fill(255, 0, 255 );
//   // canvas2.rect(width, 70, -70, 70);
//   // canvas2.fill(255, 255, 0);
//   // canvas2.rect(width, 140, -70, 70);
//   // canvas2.fill(0, 0, 0);
//   // canvas2.rect(width, 210, -70, 70);
//   // canvas2.stroke(255, 0, 0);
//   // canvas2.strokeWeight(10);
//   // canvas2.line(width - 5, 215, width - 65, 275);
}


class Pixel {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.color = color(0,255,0);
  }

  draw() {
    //noFill();
    canvas2.noStroke();
    canvas2.fill(colorPicker.color());
    canvas2.rect(this.pos.x, this.pos.y, stepSize, stepSize);
  }
}
