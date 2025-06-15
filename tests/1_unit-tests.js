const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    const solver = new Solver();
    const invalidCharsPuzzle = '#$()^%$!%&(99'
    const invalidLengthPuzzle = '...21876'
    // #1
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.isTrue(solver.validateLength(puzzlesAndSolutions[0][0]));
    });
    // #2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {

        assert.isFalse(solver.validateContent(invalidCharsPuzzle))
    })
    // #3
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.isFalse(solver.validateLength(invalidLengthPuzzle))
    })
    // #4
    test('Logic handles a valid row placement', () => {
        solver.convert(puzzlesAndSolutions[1][0])
        assert.isTrue(solver.checkRowPlacement(solver.sudoku, 0,1,6))
    })
    // #5
    test('Logic handles an invalid row placement', () => {
        solver.convert(puzzlesAndSolutions[1][0])
        assert.isFalse(solver.checkRowPlacement(solver.sudoku,0,1,5))
    })
    // #6
    test('Logic handles a valid column placement', () => {
        solver.convert(puzzlesAndSolutions[2][0])
        assert.isTrue(solver.checkColPlacement(solver.sudoku,0,7,1))
    })
    // #7
    test('Logic handles an invalid column placement', () => {
        solver.convert(puzzlesAndSolutions[2][0])
        assert.isFalse(solver.checkColPlacement(solver.sudoku,0,7,9))
    })
    // #8
    test('Logic handles a valid region (3x3 grid) placement', () => {
        solver.convert(puzzlesAndSolutions[3][0])
        assert.isTrue(solver.checkRegionPlacement(solver.sudoku,6,2,5))
    })
    // #9
    test('Logic handles an invalid region (3x3 grid) placement', () => {
        solver.convert(puzzlesAndSolutions[3][0])
        assert.isFalse(solver.checkRegionPlacement(solver.sudoku,6,2,9))
    })
    // #10
    test('Valid puzzle strings pass the solver', () => {
        let result = solver.solve(puzzlesAndSolutions[2][0])
        assert.isTrue(result)
    })
    // #11
    test('Invalid puzzle strings fail the solver', () => {
        let resultone = solver.solve(invalidCharsPuzzle)
        let resulttwo = solver.solve(invalidLengthPuzzle)
        assert.isFalse(resultone)
        assert.isFalse(resulttwo)
    })
    // #12
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const [puzzle, solution] = puzzlesAndSolutions[0]; // use any index
        solver.solve(puzzle);
        const result = solver.sudoku.flat().join('');
        assert.equal(result, solution);
    });
});
