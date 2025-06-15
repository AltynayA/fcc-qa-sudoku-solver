// 'use strict';
//
// const SudokuSolver = require('../controllers/sudoku-solver.js');
//
// module.exports = function (app) {
//
//     let solver = new SudokuSolver();
//
//     app.route('/api/check')
//         .post((req, res) => {
//             let puzzleString = req.body.puzzle
//             if (!puzzleString) {
//                 return res.json({error: 'Required field missing'})
//             }
//             if (!solver.validateLength(puzzleString)) {
//                 return res.json({error: 'Expected puzzle to be 81 characters long'})
//             }
//             if (!solver.validateContent(puzzleString)) {
//                 return res.json({error: 'Invalid characters in puzzle'})
//             }
//             let value = req.body.value
//             if (!solver.validateValue(value)) {
//                 return res.json({error: 'Invalid value'})
//             }
//             let coordinate = req.body.coordinate
//             if (!solver.validateRowColumn(coordinate)) {
//                 return res.json({error: 'Invalid coordinate'})
//             }
//             coordinate = solver.parseRowColumn(coordinate)
//             solver.convert(puzzleString)
//             // if (!solver.checkRowPlacement(coordiante, value)
//             //     && !solver.checkColPlacement(coordiante, value)
//             //     && !solver.checkRegionPlacement(coordiante, value)) {
//             //     return res.json({valid: false, conflict: ["row", "column", "region"]})
//             // }
//             let errors = []
//             if (!solver.checkRowPlacement(coordinate.row, coordinate.column, value)) {
//                 errors.push("row")
//             }
//             if (!solver.checkColPlacement(coordinate.row, coordinate.column, value)) {
//                 errors.push("column")
//             }
//             if (!solver.checkRegionPlacement(coordinate.row, coordinate.column, value)) {
//                 errors.push("region")
//             }
//             if (errors.length > 0) {
//                 return res.json({valid: false, conflict: errors})
//             }
//         });
//
//     app.route('/api/solve')
//         .post((req, res) => {
//             let puzzleString = req.body.puzzle
//             if (!puzzleString) {
//                 return res.json({error: 'Required field missing'})
//             }
//             if (!solver.validateLength(puzzleString)) {
//                 return res.json({error: 'Expected puzzle to be 81 characters long'})
//             }
//             if (!solver.validateContent(puzzleString)) {
//                 return res.json({error: 'Invalid characters in puzzle'})
//             }
//             let solution = solver.solve(puzzleString)
//             if (!solution) {
//                 return json({error: 'Puzzle cannot be solved'})
//             }
//         });
// };

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
    let solver = new SudokuSolver();
    // const { puzzle, coordinate, value } = req.body;
    app.route('/api/check')
        .post((req, res) => {
            let { puzzle, coordinate, value } = req.body;

            if (!puzzle || !coordinate || !value) {
                return res.json({ error: 'Required field missing' });
            }
            if (!solver.validateContent(puzzle)) {
                return res.json({ error: 'Invalid characters in puzzle' });
            }

            if (!solver.validateLength(puzzle)) {
                return res.json({ error: 'Expected puzzle to be 81 characters long' });
            }

            if (!solver.validateRowColumn(coordinate)) {
                return res.json({ error: 'Invalid coordinate' });
            }

            if (!solver.validateValue(value)) {
                return res.json({ error: 'Invalid value' });
            }

            solver.convert(puzzle);
            const { row, column } = solver.parseRowColumn(coordinate);

            if (solver.sudoku[row][column] == Number(value)) {
                return res.json({ valid: true });
            }
            const board = solver.sudoku;

            let errors = [];
            if (!solver.checkRowPlacement(board, row, column, value)) errors.push("row");
            if (!solver.checkColPlacement(board, row, column, value)) errors.push("column");
            if (!solver.checkRegionPlacement(board, row, column, value)) errors.push("region");

            if (errors.length > 0) {
                return res.json({ valid: false, conflict: errors });
            }

            return res.json({ valid: true });
        });

    app.route('/api/solve')
        .post((req, res) => {
            let puzzleString = req.body.puzzle;

            if (!puzzleString) {
                return res.json({ error: 'Required field missing' });
            }

            if (!solver.validateLength(puzzleString)) {
                return res.json({ error: 'Expected puzzle to be 81 characters long' });
            }

            if (!solver.validateContent(puzzleString)) {
                return res.json({ error: 'Invalid characters in puzzle' });
            }

            const solved = solver.solve(puzzleString);
            if (!solved) {
                return res.json({ error: 'Puzzle cannot be solved' });
            }
            let solution = solver.sudoku.map(row => row.join('')).join('');
            return res.json({ solution})

        });
};
