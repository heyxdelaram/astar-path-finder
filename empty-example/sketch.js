//fringe.remove(current)
function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // //calculating the straight distance
  // const d = dist(a.i, a.j, b.i, b.j);

  //manhattan distance
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

const COLS = 50;
const ROWS = 50;
const names = "";

let fringe = []; //fringe = openSet
let explored = []; //explored = closedSet
let start;
let end;
let w;
let h;
let current;
let path = [];
let noSolution = false;

let grid = new Array(COLS);

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  //isObstacle? by default it isn't
  this.wall = false;

  if (random(1) < 0.35) {
    this.wall = true;
  }
  this.show = function (col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  //adding neighbours
  this.addNeighbours = function (grid) {
    let i = this.i;
    let j = this.j;

    if (i < COLS - 1) this.neighbours.push(grid[i + 1][j]);
    if (i > 0) this.neighbours.push(grid[i - 1][j]);

    if (j < ROWS - 1) this.neighbours.push(grid[i][j + 1]);
    if (j > 0) this.neighbours.push(grid[i][j - 1]);
  };
}

function setup() {
  createCanvas(400, 400);
  console.log("A*");

  //scaling
  w = width / COLS;
  h = height / ROWS;

  //making 2D array
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }
  // console.log(grid);

  //start node
  start = grid[0][0];
  //goal node
  end = grid[COLS - 1][ROWS - 1];

  //making sure the start and end are not walls
  start.wall = false;
  end.wall = false;

  //at the beginning the fringe contains start
  //explored is empty
  fringe.push(start);
}

// a loop by default
function draw() {
  if (fringe.length > 0) {
    let bestIndex = 0;

    //which node in fringe has lowest F
    for (let i = 0; i < fringe.length; i++) {
      if (fringe[i].f < fringe[bestIndex]) {
        bestIndex = i;
      }
    }

    current = fringe[bestIndex];

    // check if the best one is the end
    if (current == end) {
      noLoop();
      console.log("DONE!");
      document.querySelector("h3").innerHTML = "Solved! 🎉";
      document.querySelector("p").innerHTML = "Reload to search again 🔄️";
    }

    removeFromArray(fringe, current); //fringe.remove(current);
    explored.push(current);

    const neighbours = current.neighbours;
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      if (!explored.includes(neighbour) && !neighbour.wall) {
        //checking if there has been a lower g in the Fringe
        let tempG = current.g + 1;

        let newPath = false;
        if (fringe.includes(neighbour)) {
          if (tempG < neighbour.g) {
            neighbour.g = tempG;
            newPath = true;
          }
        } else {
          neighbour.g = tempG;
          newPath = true;
          fringe.push(neighbour);
        }

        //guessing how long it will take to reach the end from the node
        if (newPath) {
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbours.g + neighbour.h;
          neighbour.previous = current;
        }
      }
    }
  } else {
    //no solution
    console.log("NO SOLUTION");
    noSolution = true;
    document.querySelector("h3").innerHTML = "No Solution Found ☹️";
    document.querySelector("p").innerHTML = "Reload to search again 🔄️";
    noLoop();
  }

  background(255);

  //for debugging
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < fringe.length; i++) {
    fringe[i].show(color(93, 206, 54));
    // console.log(fringe.length);
  }
  for (let i = 0; i < explored.length; i++) {
    explored[i].show(color(238, 43, 49));
  }

  //find the path
  if (!noSolution) {
    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(16, 129, 197));
  }
}
