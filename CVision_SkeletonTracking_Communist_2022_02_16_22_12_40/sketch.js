let w = 640;
let h = 480;
let capture;
let model;
let skeletons;

function preload(){
  hammer = loadImage("hammer.png")
  sickle = loadImage("sickle.png")
}

function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  loadSkeletonModel();
}

function draw() {
  background(200);

  if(capture.loadedmetadata) {
    // draw the capture first
    push();
      translate(w, 0);
      scale(-1, 1);
      image(capture, 0, 0);
    pop();
  }

  // if we see skeletons
  if(skeletons !== undefined) {
    //console.log(skeletons);

    // loop through all the skeletons
    for(let skel of skeletons) {
    console.log(skel)
      
      // loop through and draw all the keypoints of the current skeleton
      for(let pt of skel.pose.keypoints) {
        fill(0, 255, 0);
        noStroke();
        ellipse(w-pt.position.x, pt.position.y, 10, 10);
      }
      
      let size = 200
      let leftWrist = skel.pose.leftWrist;
      image(hammer,w-leftWrist.x-size/2, leftWrist.y-size/2, size, size);
      
      let rightWrist = skel.pose.rightWrist;
      image(sickle,w-rightWrist.x-size/2, rightWrist.y-size/2, size, size);
      
      //noLoop();
    }
  }
}

function loadSkeletonModel() {
  // load the PoseNet model
  model = ml5.poseNet(capture, { maxPoseDetections: 1 } );
  
  // when it has a new pose (skeleton), this 
  // function will be run!
  // (basically we just grab the first prediction,
  // since we only want one skeleton)
  model.on('pose', function(predictions) {
    skeletons = predictions;
  });
}









