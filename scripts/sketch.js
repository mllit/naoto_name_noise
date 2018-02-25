/* ===
ML5 SFPC Workshop

Example 03
Webcam Classification with ML5.js and p5.js
=== */

let imagenet;
let video;
let result;
let confidence;
let canvas;
let label = "";
let radio;
let pg;
let myFont;
let slider, freq, colorSlider, vert;


function preload() {
  // Initialize ImageNet with the MobileNet model.
  imagenet = new ml5.ImageNet('MobileNet');
  myFont = loadFont('HelveticaNeue-Light-05.ttf');
}

function setup() {
  canvas = createCanvas(400, 400);
  pg = createGraphics(227, 227);
  // video = createCapture(VIDEO);

  slider = createSlider(0, 100, 50);
  vert = createSlider(0, 255, 0);
  // colorSlider = createSlider(0, 255, 255);
  freq = createSlider(0, 100, 50);
  textFont(myFont);

  // Create the elements to hold the results
  result = createP('');
  confidence = createP('');

  // Set the input size and hide the video
  // video.attribute('width', 227);
  // video.attribute('height', 227);
  // video.hide();
  guess();

  radio = createRadio();
  radio.option('None');
  radio.option('Sine');
  radio.option('Perlin');
  radio.style('width', '60px');
  textAlign(CENTER);

  frameRate(30);
}

function guess() {
  // Get a prediction for that image
  imagenet.predict(pg.elt, 10, gotResult);
}

function draw() {
  background(0);

  pg.push();
  // pg.translate(227/2, 227/2);
  let s = sin(millis() * 0.001) * 100

  pg.background(0)
  // pg.background(vert.value());
  pg.fill(vert.value());
  pg.rect(0, 0, mouseX, mouseY);
  pg.fill(255);//, colorSlider.value(), colorSlider.value());
  pg.noStroke();
  pg.beginShape();
  for(let i = 0; i < 100; i++) {
    let n = 0;
    if(radio.value() === 'None') n = 0;
    else if(radio.value() === 'Sine') n = sin(i * map(freq.value(), 0, 100, 0.5, 2));//*sin(millis() * 0.001)
    else if(radio.value() === 'Perlin') n = noise(i * map(freq.value(), 0, 100, 0.25, 2)) * 1.5;
    let r = 30 + n * 20;//vert.value() / 50 * 20;
    let angle = i / 100 * TWO_PI;// * vert.value() / 50;// + millis() * 0.0001;
    let x = r * cos(angle);
    let y = r * sin(angle);
    pg.vertex(x+227/4, y+227/4);
  }
  pg.endShape();

  pg.fill(0);
  // pg.translate(0, vert.value());
  pg.beginShape();
  for(let i = 0; i < 100; i++) {
    let n = 0;
    if(radio.value() === 'None') n = 0;
    else if(radio.value() === 'Sine') n = sin(i * map(freq.value(), 0, 100, 0.5, 2));//*sin(millis() * 0.001)
    else if(radio.value() === 'Perlin') n = noise(i * map(freq.value(), 0, 100, 0.25, 2)) * 1.5;
    let r = 30 + n * 20;//vert.value() / 50 * 20;
    r *= slider.value() / 100;
    let angle = i / 100 * TWO_PI;// * vert.value() / 50;// + millis() * 0.0001;
    let x = r * cos(angle);
    let y = r * sin(angle);
    pg.vertex(x+227/4, y+227/4);
  }
  pg.endShape();
  pg.pop();

  // image(pg, 0, 0);
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text(label, width/2, 350);
  // Draw a larger video on the canvas
  image(pg, width/2-227/2, 50);
}
// When we get the results
function gotResult(results) {
  // The results are in an array ordered by probability.
  // result.html(results[0].label);
  label =  results[0].label.split(',')[0].toUpperCase() + '\n' +radio.value() + ', 2018';
  // confidence.html(results[0].probability, 0, 2);

  // Console the results
  // console.log(results);

  // Start again every 250ms
  setTimeout(guess, 1000);
}