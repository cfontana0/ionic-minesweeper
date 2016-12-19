"use strict";
/*global angular, window, cordova, app*/

/**
 * Copyright (c) 2015 ....
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
 * @file controllers.js
 * Angular Controllers
 * @date 11/06/2015
 */

var minesweeper = angular.module("minesweeper");

minesweeper.controller("StartCtrl", ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
    /**
     * This function initiate a new game.
     *
     * @param  {Int} difficulty
     *
    */
    function initiateGame(difficulty) {
        $rootScope.selectedDifficulty = difficulty;
        $state.go('game');
    }

    $scope.initiateGame = initiateGame;
}]);

minesweeper.controller("GameCtrl", ["$scope", "$rootScope", "$ionicPopup", "$ionicHistory", "$state", "$timeout", "MinesweeperGame",
    function ($scope, $rootScope, $ionicPopup, $ionicHistory, $state, $timeout, MinesweeperGame) {
        var grid, boxCount = 8 * 8;

        /**
         * This function initiate a new game.
         *
         * @param  {Int} difficulty
         *
        */
        function initGame() {
            var difficulty = $rootScope.selectedDifficulty;
            grid = MinesweeperGame.newGame(difficulty);
            $scope.minesGrid = grid;
            $scope.minesCount = difficulty * 10;
            $scope.gameover = false;
        }

        /**
         * This cancels the try again popup when returning using header button
         *
        */
        $rootScope.$ionicGoBack = function (backCount) {
            $timeout.cancel($scope.popupTimeout);
            $ionicHistory.goBack(backCount);
        };

        /**
         * This function handles the tap over a tile.
         *
         * @param  {Object} box
         *
        */
        function onTap(box) {
            var popup;

            if ($scope.gameover || box.state === "mine-flagged") {
                return;
            }

            if (box.isMine) {
                MinesweeperGame.blowMine(box);
                $scope.gamePage = 'disable';
                $scope.gameover = true;

                $scope.popupTimeout = $timeout(function () {
                    popup = $ionicPopup.confirm({
                        title: 'Game Over',
                        template: 'Do you want to play again?'
                    });

                    popup.then(function (res) {
                        if (res) {
                            initGame();
                        } else {
                            $state.go('start');
                        }
                    });
                }, 1000);

            } else {
                if (boxCount - $rootScope.selectedDifficulty * 10 === MinesweeperGame.getBoxCount(box, grid)) {
                    $scope.popupTimeout = $timeout(function () {
                        popup = $ionicPopup.confirm({
                            title: 'You Win!',
                            template: 'Do you want to play again?'
                        });

                        popup.then(function (res) {
                            if (res) {
                                initGame();
                            } else {
                                $state.go('start');
                            }
                        });
                    }, 1000);
                }
            }
        }

        /**
         * This function handles the hold event over a tile.
         *
         * @param  {Object} box
         *
        */
        function onHold(box) {
            $scope.minesCount = $scope.minesCount + MinesweeperGame.flagBox(box);
        }

        $scope.onTap = onTap;
        $scope.onHold = onHold;

        initGame();
    }]);