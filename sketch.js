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
  constructor(id, width, height, pointer_xition, pointer_yition){
    this.id = id;
    this.x = pointer_xition;
    this.y = pointer_yition;
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
      solution_height = (this.rectangle_list.length * scale) + 1;
      console.log("Height: " + solution_height)
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
  // create a reference for the start coordinates for the current rectangle (start_*) and for the current position being compared (pointer_*)
  let start_x = 0;
  let start_y = 0;
  let pointer_x = 0;
  let pointer_y = 0;

  //while the current height pointer is less that total rectangle height
  while (pointer_y < Rectangle.height){
    //making sure that the current height of 2d matrix has enough height for the current rectangle being added.
    if (solution_matrix.length <= start_y + pointer_y){
      solution_matrix.push(new Array(given_width).fill('0'));
    }
    pointer_x = 0;
    while (pointer_x < Rectangle.width){
      // if the current pointers x,y are already populated in matrix, increment x value's start.
      if(!(solution_matrix[start_y + pointer_y][start_x + pointer_x] === '0')){
        start_x += 1;
        pointer_x = 0;
        pointer_y = 0;
        //if the new start plus current rectabgle width exceeds max width, increment start y.
        if (start_x + Rectangle.width > given_width) {
          start_x = 0;
          start_y += 1;
          pointer_x = 0;
          pointer_y = 0;
        }
      }
      else {
        pointer_x += 1;
      }
    }
    pointer_y += 1;
  }
  // now we have a free space to draw the rect
  Rectangle.setX(start_x);
  Rectangle.setY(start_y);
  // fill in this area of our matrix, make sure to calculate correct (spent days realising this loop was big issue.)
  for (let y = start_y; y < Rectangle.height + start_y; y++){
    for (let x = start_x; x < Rectangle.width + start_x; x++){
      solution_matrix[y][x] = Rectangle.id;
    }
  }
  //console.log(solution_matrix);
return solution_matrix
}

// funciton that decodes the list representation of boxes to a matrix representation and gives
// the rectangles coordinates on a plane.
function calculateRectanglePositions(rectangle_array, given_width){
  let solution_matrix = []; 
  solution_matrix.push(new Array(given_width).fill('0'));

  for (let rectangle in rectangle_array){
    solution_matrix = checkRectangleCoordinates(rectangle_array[rectangle], given_width, solution_matrix);
    console.log(solution_matrix);
  }
  // value is the number of 0's in the matrix so we can diffrenciate between solutions of the same height
  value = getSolutionValue(solution_matrix, given_width);
  return value, solution_matrix.length, solution_matrix;
}

function setup() {
  // parse the rectangle csv
  ParseRectangles();
  rectMode(CORNER);
  // generate the default solution
  let solution = new Solution(rectangleArray, 40);
  createCanvas(400, 1000);
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