console.log("Time to play sudoku!");
$("#testID").html("Test ID updated");

const NUMBERS = []
for (var n = 1; n <= 9; n++)
{
    NUMBERS.push(n);
}

// ================= GENERATING ANSWER KEY =================
// Init answer key array as a 9x9 matrix of 81 null elements.
var sudokuAnswerKey = [];
for (var y = 0; y < 9; y++)
{
    sudokuAnswerKey.push([]);
    for (var x = 0; x < 9; x++)
    {
        sudokuAnswerKey[y].push(null);
    }
}
var numbersTested = 0;
var startingTime = Date.now();
logGrid(sudokuAnswerKey);
// Populate matrix with 81 valid numbers
populateRecursively(sudokuAnswerKey, 0, 0);
console.log(sudokuAnswerKey);
logGrid(sudokuAnswerKey);
$("#testGrid").html(getGridStr(sudokuAnswerKey, "<br>"));
var endingTime = Date.now();
console.log("Numbers tested: " + numbersTested);
console.log("Processing time: " + (endingTime - startingTime) + "ms");


// TODO - CLEANUP - OLD (see notes over populateRecursivelyWithNumSolutions())
// console.log("Testing populateRecursivelyWithNumSolutions()")
// var sudokuAnswerKey2 = [];
// for (var y = 0; y < 9; y++)
// {
//     sudokuAnswerKey2.push([]);
//     for (var x = 0; x < 9; x++)
//     {
//         sudokuAnswerKey2[y].push(null);
//     }
// }
// numbersTested = 0;
// startingTime = Date.now();
// var solved, numSolutions;
// [solved, numSolutions] = populateRecursivelyWithNumSolutions(sudokuAnswerKey2, 0, 0);
// console.log("solved: " + solved);
// console.log("numSolutions: " + numSolutions);
// console.log(sudokuAnswerKey2);
// logGrid(sudokuAnswerKey2);
// endingTime = Date.now();
// console.log("Numbers tested: " + numbersTested);
// console.log("Processing time: " + (endingTime - startingTime) + "ms");



// ================= FINDING MINIMAL STARTING GRID WITH SINGULAR SOLUTION =================
// TODO
// var startingGrid = 

function hasSingularSolution(grid)
{
    // TODO
    return false;
}

// ================= HELPER FUNCTIONS =================
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

// TODO - CLEANUP - OLD: This is a horribly inefficient way to do this because it proceeds linearly and is basically brute-force,
//   so it's gonna take a lot of backtracking to ever reach a grid that COULD have a (different) solution.
//   My conclusion is that this exercise (at least with this approach) was never really viable, and a smart solver is the right path from the start.
function populateRecursivelyWithNumSolutions(grid, x, y, priorSolutions = 0)
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
                return [true, priorSolutions + 1];
            }
            var y2 = y;
            var x2 = x + 1;
            if (x2 == 9)
            {
                x2 = 0;
                y2 = y + 1;
            }

            var solved, numSolutions;
            [solved, numSolutions] = populateRecursivelyWithNumSolutions(grid, x2, y2, priorSolutions);
            if (solved && numSolutions >= 2)
            // if (solved && numSolutions >= 1) // Temporarily ending after only 1 solution is found
            {
                return [true, numSolutions];
            }
            else if (solved && numSolutions == 1)
            {
                priorSolutions++;
            }
            else if (solved)
            {
                console.error("populateRecursivelyWithNumSolutions() was solved but counts 0 solutions. Logic must be wrong...");
            }
            grid[y][x] = null;
        }
    }
    return [false, priorSolutions];
}

function logGrid(grid)
{
    console.log(getGridStr(grid));
}

function getGridStr(grid, newline = "\n")
{
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

