"use strict";
/*global angular, window, cordova, app, StatusBar*/

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
 * @file app.js
 * Ionic App
 * @date 11/06/2015
 */
var minesweeper = angular.module("minesweeper", ["ionic", "minesweeper.factories"]);

minesweeper.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('start', {
        url: '/start',
        templateUrl: 'views/start.html',
        data: {
            requireLogin: false
        }
    }).state('game', {
        url: '/game',
        templateUrl: 'views/game.html',
        data: {
            requireLogin: false
        }
    });

    $urlRouterProvider.otherwise('/start');
});

minesweeper.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
