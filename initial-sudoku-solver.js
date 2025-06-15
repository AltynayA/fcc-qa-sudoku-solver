class InitialSudokuSolver {
    // rows = 9;
    // cols = 9;
    // sudoku = Array.from({length: rows}, () => Array(cols).fill(0));
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.sudoku = Array.from({length: this.rows}, () =>
            Array(this.cols).fill(0)
        );

        this.segments = [
            [0, 0],
            [0, 3],
            [0, 6],
            [3, 0], [3, 3], [3, 6],
            [6, 0], [6, 3], [6, 6]
        ]
    }

    convert(puzzleString)
    {
        let i = 0
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let val = puzzleString[i] == '.' ? 0 : Number(puzzleString[i]);
                this.sudoku[row][col] = val;
                i++;
            }
        }
    }

    validateLength(puzzleString)
    {
        if (puzzleString.length != 81) {
            return false
        }
        return true
    }

    validateContent(puzzleString) {
        for (let c of puzzleString) {
            if (!(c >= '1' && c <= '9') && c !== '.') {
                return false;
            }
        }
        return true;
    }

    parseRowColumn(rowcolumn)
    {
        let row = rowcolumn[0] - 65
        let column = rowcolumn[1] - 49
        return {row, column}
    }

    validateRowColumn(rowcolumn)
    {
        if (rowcolumn.length != 2) {
            return false
        }
        let code = rowcolumn.charCodeAt(0);
        if (code < 65 || code > 73) {
            return false
        }
        code = rowcolumn.charCodeAt(1);
        if (code < 49 || code > 57) {
            return false
        }
        return true
    }

    checkRowPlacement(row, column, value)
    {
        if (this.sudoku[row][column] != 0) {
            return false
        }
        for (let c = 0; c < 9; c++) {
            if (this.sudoku[row][c] == value) {
                return false
            }
        }
        return true
    }

    validateValue(value)
    {
        if (value < 1 || value > 9) {
            return false
        }
        return true
    }

    checkColPlacement(puzzleString, row, column, value)
    {
        if (this.sudoku[row][column] != 0) {
            return false
        }
        for (let r = 0; r < 9; r++) {
            if (this.sudoku[r][column] == value) {
                return false
            }
        }
        return true
    }

    findRegion(row, column)
    {
        let segments = this.segments
        for (let si = 8; si >= 0; si--) {
            if (row < segments[si][0]) {
                continue
            }
            if (column < this.segments[si][1]) {
                continue
            }
            return this.segments[si]
        }
    }


    checkRegionPlacement(puzzleString, row, column, value)
    {
        let region = this.findRegion(row,column)
        let startr = region[0]
        let startc = region[1]
        for (let r = startr; r < startr + 3; r++) {
            for (let c = startc; c < startc + 3; c++) {
                if (puzzleString[r][c] == value) {
                    return false
                }
            }
        }
        return true
    }

    solveSudoku()
    {
        let segments = this.segments
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.sudoku[row][col] === 0) {
                    for (let val = 1; val <= 9; val++) {
                        if (
                            this.validateValue(val) &&
                            this.checkRowPlacement(row, col, val) !== false &&
                            this.checkColPlacement(this.sudoku, row, col, val) !== false &&
                            this.checkRegionPlacement(this.sudoku, row, col, val)
                        ) {
                            this.sudoku[row][col] = val;
                            if (this.solveSudoku()) return true;
                            this.sudoku[row][col] = 0; // backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(puzzleString)
    {
        if (!this.validateLength(puzzleString)) return false;
        this.convert(puzzleString);
        return this.solveSudoku();
    }
}

module.exports = SudokuSolver;

