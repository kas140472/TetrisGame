
    //const grid = document.getElementsByClassName("grid");
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector("#start-button");
    const width = 10; // 10 boxes horizontally in the grid (10*20 pixels = 200px = width of grid)
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
      'yellow',
      'lightblue',
      'green',
      'orange',
      'red'
    ]

    //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4; // arbitrary value
  let currentRotation = 0;

  //let current = theTetrominoes[0][0]; // current shape = lTetraminoe's first rotation

  // randomly select a tetramino
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the first rotation of a randomly selected tetraminoe
  function draw()
  {
    current.forEach(square => {
        squares[currentPosition + square].classList.add('tetromino');
        squares[currentPosition + square].style.backgroundColor = colors[random];
    })
  }

  function unDraw()
  {
    current.forEach(square => {
        squares[currentPosition + square].classList.remove('tetromino');
        squares[currentPosition + square].style.backgroundColor = '';
    })
  }

  // make the tetramino move down every second (1000 milliseconds)
  // timerId = setInterval(moveDown,400);

  // assign functions to keyCodes
  function control(eventE)
  {
    if(eventE.keyCode === 37)
    {
        moveLeft();
    }
    else if(eventE.keyCode === 38)
    {
        rotate();
    }
    else if(eventE.keyCode === 39)
    {
        moveRight();
    }
    else if(eventE.keyCode === 40)
    {
        moveDown();
    }
  }

  document.addEventListener('keydown', control);

  function moveDown()
  {
    unDraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function moveLeft()
  {
    unDraw();
    const isAtLeftEdge = current.some(squareNumber => (currentPosition+squareNumber) % width === 0);
    if(!isAtLeftEdge)
    {
        currentPosition = currentPosition - 1;
    }
    if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
    {
        currentPosition = currentPosition + 1;
    }
    draw();
  }

  function moveRight()
  {
    unDraw();
    const isAtRightEdge = current.some(squareNumber => (currentPosition+squareNumber+1) % width === 0);
    if(!isAtRightEdge)
    {
        currentPosition = currentPosition + 1;
    }
    if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
    {
        currentPosition = currentPosition - 1;
    }
    draw();
  }

  function rotate()
  {
    //const isAtLeftEdge = current.some(squareNumber => (currentPosition+squareNumber) % width === 0);
    //if(isAtLeftEdge)
    //{
    //    return;
    //}
    unDraw();
    currentRotation++;
    if(currentRotation === current.length)
    {
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // to stop moving tetramino at the bottom of grid
  function freeze()
  {
    if(current.some(squareNumber => squares[currentPosition+squareNumber+width].classList.contains('taken')))
    {
        current.forEach(squareNumber => {
            squares[currentPosition + squareNumber].classList.add('taken');
        })
    //start a new tetromino falling
    nextRandom = Math.floor(Math.random()*theTetrominoes.length);
    random = nextRandom;
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    
    draw();
    displayMiniNext();
    addScore();
    gameOver();
    }
  }

  // show next tetramino in mini-grid
  const smallGridNextSquares = Array.from(document.querySelectorAll('.miniGrid div'));
  const smallGridWidth = 4;
  const miniCurrentPosition = 0;

  // only first rotation arrays needed
  const upNextTetrominoes = [
    [1, smallGridWidth+1, smallGridWidth*2+1, 2], // lTetromino
    [0,smallGridWidth,smallGridWidth+1,smallGridWidth*2+1], //z
    [1,smallGridWidth,smallGridWidth+1,smallGridWidth+2], //T
    [0,1,smallGridWidth,smallGridWidth+1], //O
    [1,smallGridWidth+1,smallGridWidth*2+1,smallGridWidth*3+1] //I
  ]

  // display shape in mini grid display
  function displayMiniNext()
  {
    smallGridNextSquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })

    upNextTetrominoes[nextRandom].forEach(square => {
        smallGridNextSquares[miniCurrentPosition + square].classList.add('tetromino');
        smallGridNextSquares[miniCurrentPosition + square].style.backgroundColor = colors[nextRandom];
    })
  }


// add functionality to button
startBtn.addEventListener('click', () => {
    if(timerId != null)
    {
        clearInterval(timerId);
        timerId = null;
    }
    else
    {
        draw();
        timerId = setInterval(moveDown,400);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayMiniNext();
    }
})

//itemArray.splice(startIndex, deleteCount)

function addScore()
{
    for(let i=0; i<199; i = i+width)
    {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if(row.every(index => squares[index].classList.contains('taken')))
        {
            score = score+10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

function gameOver()
{
    if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
    {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
    }
}