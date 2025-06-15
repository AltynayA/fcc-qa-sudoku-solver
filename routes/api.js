'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
    let solver = new SudokuSolver();
    app.route('/api/check')
        .post((req, res) => {
            const { puzzle, coordinate, value } = req.body;

            if (!puzzle || !coordinate || !value) {
                return res.json({ error: 'Required field(s) missing' });
            }
            if (!solver.validateContent(puzzle)) {
                return res.json({error: 'Invalid characters in puzzle'});
            }

            if (!solver.validateLength(puzzle)) {
                return res.json({error: 'Expected puzzle to be 81 characters long'});
            }

            if (!solver.validateRowColumn(coordinate)) {
                return res.json({ error: 'Invalid coordinate' });
            }

            // if (!solver.validateValue(value)) {
            //     return res.json({ error: 'Invalid value' });
            // }
            const numValue = Number(value);
            if (!solver.validateValue(numValue)) {
                return res.json({ error: 'Invalid value' });
            }

            solver.convert(puzzle);
            const {row, column} = solver.parseRowColumn(coordinate);

            if (solver.sudoku[row][column] === numValue) {
                return res.json({valid: true});
            }
            const board = solver.sudoku;

            let conflicts = [];
            if (!solver.checkRowPlacement(board, row, column, numValue)) conflicts.push("row");
            if (!solver.checkColPlacement(board, row, column, numValue)) conflicts.push("column");
            if (!solver.checkRegionPlacement(board, row, column, numValue)) conflicts.push("region");

            if (conflicts.length > 0) {
                return res.json({valid: false, conflict: conflicts});
            }

            return res.json({valid: true});
        });

    app.route('/api/solve')
        .post((req, res) => {
            const puzzle = req.body.puzzle;

            if (!puzzle) {
                return res.json({error: 'Required field missing'});
            }

            if (!solver.validateContent(puzzle)) {
                return res.json({error: 'Invalid characters in puzzle'});
            }

            if (!solver.validateLength(puzzle)) {
                return res.json({error: 'Expected puzzle to be 81 characters long'});
            }

            const solved = solver.solve(puzzle);
            if (!solved) {
                return res.json({error: 'Puzzle cannot be solved'});
            }

            const solution = solver.sudoku.flat().join('');
            return res.json({ solution });

        });
};
