"use strict";
/*jslint nomen: true*/
/*global angular, window, cordova, app, _*/

/**
 * Copyright (c) 2015 ...
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including the rights to use, copy, modify,
 * merge, publish, distribute, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @file factory.js
 * Angular Factory
 * @date 11/06/2015
 */

angular.module("minesweeper.factories", []).factory("MinesweeperGame", function () {
    function _forEachAdjacentBox(box, grid, callback) {
        var i, j, xPos, yPos;

        for (i = -1; i <= 1; i = i + 1) {
            for (j = -1; j <= 1; j = j + 1) {
                xPos = box.x + j;
                yPos = box.y + i;

                if (!(i === 0 && j === 0) && !_.isUndefined(grid[xPos]) && !_.isUndefined(grid[xPos][yPos])) {
                    callback(grid[xPos][yPos]);
                }
            }
        }
    }

    var minesweeperGame = {
        /**
         * Creates a new 8x8 grid with mines according to the selected difficulty.
         *     
         * @param  {Int} difficulty
         *
        */
        newGame : function (difficulty) {
            var minesCount, grid, box, i, j, row, pos;

            minesCount = difficulty * 10;
            grid = [];
            box = {
                isMine : false,
                state : "idle"
            };

            //First Generate the grid.
            for (i = 0; i < 8; i = i + 1) {
                row = [];

                for (j = 0; j < 8; j = j + 1) {
                    pos = {
                        x: i,
                        y: j
                    };

                    row.push(_.extend(_.clone(box), pos));
                }

                grid.push(row);
            }

            //Place the mines.
            while (minesCount > 0) {
                i = Math.floor((Math.random() * 7));
                j = Math.floor((Math.random() * 7));

                if (!grid[i][j].isMine) {
                    grid[i][j].isMine = true;
                    minesCount = minesCount - 1;
                }
            }

            return grid;
        },
        /**
         * Takes a tile and a grid as parameters and calculates the amount of mines around it,
         * if the tile has no mines around it proceeds to reveal the adjacent tiles,
         * at the end returns how many tiles have been revealed.
         *     
         * @param  {Object} box
         * @param  {Array Matrix} grid
         *
        */
        getBoxCount : function (box, grid) {
            var that = this, count, boxesPressed = 0;

            if (box.state !== "mine-pressed") {
                box.state = "mine-pressed";
                count = 0;

                _forEachAdjacentBox(box, grid, function (record) {
                    if (record.isMine) {
                        count = count + 1;
                    }
                });

                if (count === 0) {
                    _forEachAdjacentBox(box, grid, function (record) {
                        that.getBoxCount(record, grid);
                    });
                }

                box.count = (count > 0) ? count : '';
            }

            _.forEach(grid, function (row) {
                _.forEach(row, function (record) {
                    if (record.state === "mine-pressed") {
                        boxesPressed = boxesPressed + 1;
                    }
                });
            });

            return boxesPressed;
        },
        /**
         * Takes a tile and adds the mine-blow state to it.
         *     
         * @param  {Int} difficulty
         *
        */
        blowMine : function (box) {
            box.state = "mine-blow";
        },
        /**
         * Takes a tile and adds the mine-flagged state to it or removes it according to the previous state.
         *     
         * @param  {Object} box
         *
        */
        flagBox : function (box) {
            var mineCount = 0;

            if (box.state !== "mine-flagged" && box.state !== "mine-pressed") {
                box.state = "mine-flagged";
                mineCount = mineCount - 1;
            } else if (box.state !== "mine-pressed") {
                box.state = "idle";
                mineCount = mineCount + 1;
            }

            return mineCount;
        }
    };

    return minesweeperGame;
});

