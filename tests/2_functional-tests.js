const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings.js');
const validPuzzle = puzzlesAndSolutions[0][0]
const noSolvePuzzle = '9'.repeat(81);
const invalidCharPuzzle = validPuzzle.slice(0, 80) + 'A';
const invalidCharsandLength = '#$()^%jj0$!%&(99'
const invalidLengthPuzzle = validPuzzle.slice(0, 10)
chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle: validPuzzle})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    // assert.lengthOf(res.body.solution, 81);
                    done();
                });
        });
        // #2
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });
        // #3
        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle: invalidCharPuzzle})
                .end((err, res) => {
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        // #4
        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle: invalidLengthPuzzle})
                .end((err, res) => {
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
        // #5

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle: noSolvePuzzle})
                .end((err, res) => {
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    })
    suite('POST /api/check', () => {
        // #6
        test('Check a puzzle placement with all fields', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A2',
                    value: '3'
                })
                .end((err, res) => {
                    // assert.property(res.body, 'valid');
                    assert.isBoolean(res.body.valid);
                    done();
                });
        });
        // #7

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: 8
            }).end((err, res) => {
                assert.include(res.body.conflict, 'row');
                assert.lengthOf(res.body.conflict, 1);
                done();
            })
        })

        //     #8
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: 5
            }).end((err, res) => {
                assert.sameMembers(res.body.conflict, ['row', 'region']);
                // assert.include(res.body.conflict, 'row');
                assert.lengthOf(res.body.conflict, 2);
                done();
            })
        })

        //     #9
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: 'A2',
                value: 2
            }).end((err, res) => {
                assert.sameMembers(res.body.conflict, ['row', 'column', 'region']);
                // assert.include(res.body.conflict, 'row');
                assert.lengthOf(res.body.conflict, 3);
                done();
            })
        })

        //     #10
        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: '',
                value: 2
            }).end((err, res) => {
                assert.equal(res.body.error, 'Required field(s) missing')
                done();
            })
        })

        //     #11
        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: invalidCharPuzzle,
                coordinate: 'A4',
                value: 2
            }).end((err, res) => {
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done();
            })
        })

        //     #12
        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: invalidLengthPuzzle,
                coordinate: 'A4',
                value: 2
            }).end((err, res) => {
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done();
            })
        })

        //     #13
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: 'S4',
                value: 2
            }).end((err, res) => {
                assert.equal(res.body.error, 'Invalid coordinate')
                done();
            })
        })

        //     #14
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai.request(server).post('/api/check').send({
                puzzle: validPuzzle,
                coordinate: 'B4',
                value: 100
            }).end((err, res) => {
                assert.equal(res.body.error, 'Invalid value')
                done();
            })
        })
    })



})

