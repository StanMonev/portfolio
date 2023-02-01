module.exports = [
  //Attack
  [0,0,0,0,0,0,0,0,0,    1,0,0,0,0,0,0,0,0], //Random
  [1,1,0,0,0,0,0,0,0,    1,1,1,0,0,0,0,0,0], //First row
  [1,0,0,1,0,0,0,0,0,    1,0,0,1,0,0,1,0,0], //First column
  [1,0,0,0,1,0,0,0,0,    1,0,0,0,1,0,0,0,1], //Diagonal
  [0,0,0,1,1,0,0,0,0,    0,0,0,1,1,1,0,0,0], //Second row
  [0,1,0,0,1,0,0,0,0,    0,1,0,0,1,0,0,1,0], //Second column
  [0,0,1,0,1,0,0,0,0,    0,0,1,0,1,0,1,0,0], //Diagonal
  [0,0,0,0,0,0,1,1,0,    0,0,0,0,0,0,1,1,1], //Third row
  [0,0,1,0,0,1,0,0,0,    0,0,1,0,0,1,0,0,1], //Third column

  //Defence
  [0,0,0,0,0,0,0,0,0,      0,0,0,0,1,0,0,0,0], //Random
  [-1,-1,0,0,0,0,0,0,0,    0,0,1,0,0,0,0,0,0], //First row
  [-1,0,0,-1,0,0,0,0,0,    0,0,0,0,0,0,1,0,0], //First column
  [-1,0,0,0,-1,0,0,0,0,    0,0,0,0,0,0,0,0,1], //Diagonal
  [0,0,0,-1,-1,0,0,0,0,    0,0,0,0,0,1,0,0,0], //Second row
  [0,-1,0,0,-1,0,0,0,0,    0,0,0,0,0,0,0,1,0], //Second column
  [0,0,-1,0,-1,0,0,0,0,    0,0,0,0,0,0,1,0,0], //Diagonal
  [0,0,0,0,0,0,-1,-1,0,    0,0,0,0,0,0,0,0,1], //Third row
  [0,0,-1,0,0,-1,0,0,0,    0,0,0,0,0,0,0,0,1], //Third column

  [0, -1, -1, 1, 0, 0, 0, 0, 0,    1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, -1, -1, 1, 0, -1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 1, 0, 0],
  [-1, 0, -1, 1, 0, 0, 0, 0, -1,    0, 1, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, -1, 1, 0, 0, 0, 0, -1,    0, 0, 0, 0, 0, 1, 0, 0, 0],
  
  
]