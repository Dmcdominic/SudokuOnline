console.log("Time to play sudoku!");
$("#testID").html("Test ID updated");

const NUMBERS = []
for (var n = 1; n <= 9; n++)
{
    NUMBERS.push(n);
}

// ================= TEST - GENERATING ANSWER KEY =================
// Init answer key array as a 9x9 matrix of 81 null elements.
var numbersTested = 0;
// var startingTime = Date.now();
// var sudokuAnswerKey = generateNewAnswerKey();
// logGrid(sudokuAnswerKey);
// $("#testGrid").html(getGridStr(sudokuAnswerKey, "<br>"));
// var endingTime = Date.now();
// console.log("Numbers tested: " + numbersTested);
// console.log("Processing time: " + (endingTime - startingTime) + "ms");


// ================= TEST - GENERATION AND SOLUTION =================
// console.log("Testing generateSimplePartialGrid()")
// startingTime = Date.now();
// var simplePartialGrid = generateSimplePartialGrid(sudokuAnswerKey);
// endingTime = Date.now();
// logGrid(simplePartialGrid);
// console.log("Processing time: " + (endingTime - startingTime) + "ms");

// console.log("Testing tryGenerateSolution()")
// startingTime = Date.now();
// var attemptedSolutionGrid = tryGenerateSolution(simplePartialGrid);
// endingTime = Date.now();
// logGrid(attemptedSolutionGrid);
// $("#testGrid2").html(getGridStr(attemptedSolutionGrid, "<br>"));
// console.log("Processing time: " + (endingTime - startingTime) + "ms");

console.log("Searching for solvable puzzle");
startingTime = Date.now();
var solvablePuzzle = generateSolvablePuzzle();
endingTime = Date.now();
$("#testGrid3").html(getGridStr(solvablePuzzle, "<br>"));
console.log("Processing time: " + (endingTime - startingTime) + "ms");


// ================= PUZZLE GENERATION =================
function generateNewAnswerKey()
{
    var newAnswerKey = createNewEmptyGrid();
    populateRecursively(newAnswerKey, 0, 0);
    return newAnswerKey;
}

function generateSimplePartialGrid(answerKey = null)
{
    if (answerKey == null)
    {
        answerKey = generateNewAnswerKey();
    }
    const NUM_REMOVALS = 45;
    var partialGrid = copyGrid(answerKey);
    var removalsSoFar = 0;
    while (removalsSoFar < NUM_REMOVALS)
    {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        if (partialGrid[y][x] != null)
        {
            partialGrid[y][x] = null;
            removalsSoFar++;
        }
    }
    return partialGrid;
}

function generateSolvablePuzzle()
{
    const MAX_ATTEMPTS = 50;
    for (var i = 0; i < MAX_ATTEMPTS; i++)
    {
        var partialGrid = generateSimplePartialGrid();
        var singularSolution = getSingularSolution(partialGrid);
        if (singularSolution != null)
        {
            console.log("partialGrid:");
            logGrid(partialGrid);
            console.log("Singular Solution:");
            logGrid(singularSolution);
            console.log("Attempts required: " + (i + 1));
            return partialGrid;
        }
    }
    console.log("generateSolvablePuzzle() failed after " + MAX_ATTEMPTS + " attempts");
    return null;
}

function getSingularSolution(grid)
{
    var solutionGrid = tryGenerateSolution(grid);
    return (countEmptyCells(solutionGrid) == 0) ? solutionGrid : null;
}


// ================= PUZZLE AUTO-SOLVING =================
function tryGenerateSolution(partialGrid)
{
    var workingSolutionGrid = copyGrid(partialGrid);
    var madeProgress = true;
    while (madeProgress)
    {
        madeProgress = false;
        madeProgress ||= trySolverCellElimination(workingSolutionGrid);
    }
    return workingSolutionGrid;
}

function trySolverCellElimination(grid)
{
    var madeProgress = false;
    for (var y = 0; y < 9; y++)
    {
        for (var x = 0; x < 9; x++)
        {
            if (grid[y][x] == null)
            {
                var possibleNums = getPossibleNums(grid, x, y);
                // console.log(possibleNums);
                // console.log(possibleNums.length);
                if (possibleNums.length == 1)
                {
                    grid[y][x] = possibleNums[0];
                    madeProgress = true;
                }
            }
        }
    }
    return madeProgress;
}

function getPossibleNums(grid, x, y)
{
    var possibleNums = [];
    for (var num = 1; num <= 9; num++)
    {
        if (isNumValidForCell(grid, num, x, y))
        {
            possibleNums.push(num);
        }
    }
    return possibleNums;
}



// ================= HELPER FUNCTIONS =================
function countEmptyCells(grid)
{
    var count = 0;
    for (var y = 0; y < 9; y++)
    {
        for (var x = 0; x < 9; x++)
        {
            if (grid[y][x] == null)
            {
                count++;
            }
        }
    }
    return count;
}

function copyGrid(grid)
{
    var newGrid = [];
    for (var y = 0; y < 9; y++)
    {
        newGrid.push([]);
        for (var x = 0; x < 9; x++)
        {
            newGrid[y][x] = grid[y][x];
        }
    }
    return newGrid;
}

function createNewEmptyGrid()
{
    var newGrid = [];
    for (var y = 0; y < 9; y++)
    {
        newGrid.push([]);
        for (var x = 0; x < 9; x++)
        {
            newGrid[y].push(null);
        }
    }
    return newGrid;
}

function populateRecursively(grid, x, y)
{
    var numbersShuffled = get1To9Shuffled();
    for (var a = 0; a < numbersShuffled.length; a++)
    {
        var num = numbersShuffled[a];
        numbersTested++;
        if (isNumValidForCell(grid, num, x, y))
        {
            grid[y][x] = num;
            if (x == 8 && y == 8)
            {
                return true;
            }
            var y2 = y;
            var x2 = x + 1;
            if (x2 == 9)
            {
                x2 = 0;
                y2 = y + 1;
            }

            if (!populateRecursively(grid, x2, y2))
            {
                grid[y][x] = null;
            }
            else
            {
                return true;
            }
        }
    }
    return false;
}

function logGrid(grid)
{
    console.log(grid);
    console.log(getGridStr(grid));
}

function getGridStr(grid, newline = "\n")
{
    if (grid == null)
    {
        return "(Grid is null)";
    }
    var gridStr = "";
    const ASCII_HORIZONTAL_BAR = "|-----------------|" + newline;
    for (var y = 0; y < 9; y++)
    {
        if (y % 3 == 0)
        {
            gridStr += ASCII_HORIZONTAL_BAR;
        }
        for (var x = 0; x < 9; x++)
        {
            gridStr += (x % 3 == 0) ? "|" : " ";
            var num = grid[y][x];
            gridStr += (num == null) ? "?" : num;
        }
        gridStr += "|" + newline;
    }
    gridStr += ASCII_HORIZONTAL_BAR;
    return gridStr;
}

function get1To9Shuffled()
{
    var numbersShuffled = NUMBERS.slice();
    for (var a = 0; a < 9; a++)
    {
        var b = a + Math.floor(Math.random() * (9-a))
        var n = numbersShuffled[b];
        numbersShuffled[b] = numbersShuffled[a];
        numbersShuffled[a] = n;
    }
    return numbersShuffled;
}

function isNumValidForCell(grid, num, x, y)
{
    return isNumValidForRow(grid, num, x, y) && isNumValidForCol(grid, num, x, y) && isNumValidForNonet(grid, num, x, y);
}

function isNumValidForRow(grid, num, x, y)
{
    return !grid[y].some(m => m == num);
}

function isNumValidForCol(grid, num, x, y)
{
    return !grid.some(row => row[x] == num);
}

function isNumValidForNonet(grid, num, x, y)
{
    var lowestCornerY = y - (y % 3);
    var lowestCornerX = x - (x % 3);
    for (var j = lowestCornerY; j < lowestCornerY + 3; j++)
    {
        for (var i = lowestCornerX; i < lowestCornerX + 3; i++)
        {
            if (grid[j][i] == num)
            {
                return false;
            }
        }
    }
    return true;
}

