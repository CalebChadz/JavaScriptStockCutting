let table;
const rectangleArray = [];
let solution_width = 0;
let solution_height = 0;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable('assets/M1a.csv', 'csv', 'header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv","csv", "header");
}

class Rectangle {
  constructor(id, width, height, xposition, yposition){
    this.id = id;
    this.x = xposition;
    this.y = yposition;
    this.height = height;
    this.width = width;
    this.rotated = false;
  }

  //print off the rectangle x,y,width,height.
  print() {
    console.log("ID: " + str(this.id) + "\nDimensions: (" + str(this.width) + ", " + str(this.height) + ")" + "\nCoordinates: (" + str(this.x) + ", " + str(this.y) + ")\n");
  }

  setX(xValue) {
    this.x = xValue;
  }

  setY(yValue){
    this.y = yValue;
  }

  // Rotate the rectangle by switching width and height
  Rotate(){
    tempWidth = this.width;
    this.width = this.height;
    this.height = tempWidth;
    this.rotated = !this.rotated;
  }
}

class Solution {
  constructor(rectangle_list, given_width){
    this.given_width = given_width;
    this.rectangle_list = rectangle_list;
    //value, draw height, solution matrix from calculation.
    this.value, this.length, this.solution_matrix = calculateRectanglePositions(this.rectangle_list, given_width);
  }

    drawSolution(scale){
      solution_width = (this.given_width * scale) + 1;
      console.log("Width: " + solution_width)
      solution_height = (this.length * scale) + 1;
      console.log("Height: " + solution_height)
      background(0);
      for (let r = 0; r < this.rectangle_list.length; r++){
        const rObject = this.rectangle_list[r];
        let rHeight = (rObject.height * scale);
        let rWidth = (rObject.width * scale);
        let rX = (rObject.x * scale);
        let rY = (rObject.y * scale);
        console.log("rectWidth: " + rWidth + "\nrHeight: " + rHeight + "\nrX: " + rX + "\nrY: " + rY)
        // check to see if this rectabgle has been flipped from original orientation to change color before drawing.
        if (rObject.rotated){
          //Blue
          fill(0,0,255);
        } else {
          //Green
          fill(0,255,0);
        }
        // can draw rect now rect(x, y, width, height)
        rect(rX, rY, rWidth, rHeight);
      }
    }
  }


function ParseRectangles() {
  console.log(table.getRowCount());
  for(let r = 0; r < table.getRowCount(); r++){
    //Pull the next row of rectangle data and create a new rectangle object that gets added to out Rectangle Object Array.
    row = table.getRow(r);
    let rect = new Rectangle(row.get('id'), row.get('width'), row.get('height'),0,0)
    rect.print();
    rectangleArray.push(rect);
  }
}

function getSolutionValue(solution_matrix, given_width){
  mHeight = solution_matrix.length;
  mValue = 0;
  mRows = 0;

  for (let y = 0; y < mHeight; y++){
    for (let x = 0; x < given_width; x++){
      if (solution_matrix[y][x] == 0){
        mValue ++;
      }
    }
  }
  if (mValue == given_width){
    mValue == 0;
    for (let i = 0; i < given_width; i++){
      if (!(solution_matrix[mHeight - 1][i] == 0)){
        mValue ++;
      }
    }
    return mValue;
  }
  else {
    mRows = (mValue / given_width)
    mValue = 0;
    for (let r = 0; r <= mRows; r++){
      for (let c = 0; c <= given_width; c++){
        if (!(solution_matrix[mHeight - r - 1][c] == 0)){
          mValue ++;
        }
      }
    }
  }
}

function checkRectangleCoordinates(Rectangle, given_width, solution_matrix){
  xPrime = 0;
  yPrime = 0;
  rectXPos = 0;
  rectYPos = 0;
  yPos = 0;

  while (yPos < Rectangle.height){
    if (solution_matrix.length <= yPrime + yPos){
      solution_matrix.push(new Array(given_width).fill(0));
    }
    xPos = 0;
    while (xPos < Rectangle.width){
      if(solution_matrix[yPrime + yPos][xPrime + xPos] != 0){
        xPrime += 1;
        xPos = 0;
        yPos = 0;
      }
      else {
        xPos += 1;
      }
      if (xPrime + Rectangle.width > given_width) {
        xPrime = 0;
        yPrime += 1;
        xPos = 0;
        yPos = 0;
        if(solution_matrix.length <= yPrime + yPos){
          solution_matrix.push(new Array(given_width).fill(0));
        }
      }
    }
    yPos += 1;
  }
  // now we have a free space to draw the rect
  Rectangle.setX(xPrime);
  Rectangle.setY(yPrime);
  // fill in this area of our matrix
for (let x = 0; x < Rectangle.width; x++){
  for (let y = 0; y < Rectangle.height; y++){
    solution_matrix[Rectangle.y][Rectangle.x] = Rectangle.id;
  }
}

return solution_matrix
}

// funciton that decodes the list representation of boxes to a matrix representation and gives
// the rectangles coordinates on a plane.
function calculateRectanglePositions(rectangle_array, given_width){
  solution_matrix = new Array(given_width).fill(0);
  xPrime = 0;
  yPrime = 0;
  for (let rectangle in rectangle_array){
    solution_matrix = checkRectangleCoordinates(rectangle_array[rectangle], given_width, solution_matrix);
  }
  // value is the number of 0's in the matrix so we can diffrenciate between solutions of the same height
  value = getSolutionValue(solution_matrix, given_width);
  return value, solution_matrix.length, solution_matrix, rectangle_array;
}

function setup() {
  // parse the rectangle csv
  ParseRectangles();
  // generate the default solution
  let solution = new Solution(rectangleArray, 40);
  createCanvas(400, 400);
  background(0);
  fill(255);
  console.log("Rect Array Length: " + rectangleArray.length)
  for (let r = 0; r < rectangleArray.length; r++){
    rectangleArray[r].print()
  }
  solution.drawSolution(10);
}

function draw() {

}