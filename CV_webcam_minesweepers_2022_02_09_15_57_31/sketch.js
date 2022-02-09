let capture;
const w = 660;
const h = 360;
//image
let img = [];
const iw = 10;
const ih = 10;

function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  //image
  img[0] = loadImage('notpushed@2x.png');
  img[1] = loadImage('blank@2x.png');
  img[2] = loadImage('no1@2x.png');
  img[3] = loadImage('no2@2x.png');
  img[4] = loadImage('no3@2x.png');
  img[5] = loadImage('redflag@2x.png');
  img[6] = loadImage('mine@2x.png');
  
  imageMode(CORNER);
}


function draw() {
  background(180);
  const stepSize = 10;
  capture.loadPixels();
  
    push()
    translate(width, 0);
    scale(-1, 1);{
  for(let y = 0; y < capture.height; y+=stepSize){
    for(let x = 0; x < capture.width; x+=stepSize){
      
      const i = (x + y * width) * 4;
      
      const r = capture.pixels[i]; // red channel
      const g = capture.pixels[i+1]; // green channel
      const b = capture.pixels[i+2]; // blue channel
      // capture.pixels[i+3] = 1; // alpha channel
      
      const brightness = (r + g + b)/3
      const mappedBrightness = map(brightness, 255, 0, 5, stepSize*4);
      const rotation = map (brightness,0,255,0, PI);

      fill(r, g, b);
      //rect(x, y, mappedBrightness, mappedBrightness);
      
      if(brightness < 40){
    image(img[6],x, y,iw,ih);
  }else if (brightness > 40 && brightness<80) {
    image(img[5],x, y,iw,ih);
  }else if (brightness > 80 && brightness<110) {
    image(img[4],x, y,iw,ih);
  }else if (brightness > 110 && brightness<140) {
    image(img[3],x, y,iw,ih);
  }else if (brightness > 140 && brightness<170) {
    image(img[2],x, y,iw,ih);
  }else if (brightness > 170 && brightness<200) {
    image(img[0],x, y,iw,ih);
  }else if (brightness>200) {
    image(img[1],x, y,iw,ih);
  
  }
      
      
      push();
        translate(x, y); 
        scale(-1, 1);
        textSize(brightness);
        rect(x, y, stepSize, stepSize);
      pop();
    }
  }
  pop();    
  }
  
  capture.updatePixels();
  }