// Generated by CoffeeScript 1.10.0
(function() {
  var MatchMaker, Player, Utils, i, len, number, player, testNumbers, testNumbers2, testString, testString2, utilsL, valid;

  Player = require("./player");

  MatchMaker = require("./matchmaker");

  Utils = require("./utils");

  utilsL = new Utils;

  player = new Player(this);

  testString = "0.25 0.04 0.01 0.14 0.56 -0.2 -0.06 -0.14 -0.29 -0.31";

  testString2 = "-0.58 0.52 0.51 -0.52 0.51 0.51 -0.57 0.55 -0.59 0.55 -0.5 0.53 -0.56 0.53 0.53 -0.57 -0.55 -0.55 -0.56 -0.59 -0.5 -0.56 -0.58 0.54 0.52 0.51 0.55 -0.53 -0.52 0.51 0.53 0.55 0.54 0.55 0.55 -0.6 0.53 0.52 0.54 0.55 0.54 -0.53 0.54 0.53 0.51 0.53 -0.53 0.55 0.55 0.53";

  testNumbers = utilsL.convertStringToNumArray(testString);

  testNumbers2 = utilsL.convertStringToNumArray(testString2);

  console.log("Test numbers length is " + testNumbers2.length);

  console.log("Numbers are: ");

  for (i = 0, len = testNumbers2.length; i < len; i++) {
    number = testNumbers2[i];
    console.log(number);
  }

  valid = player.checkIfInitialNumbersAreValid(testNumbers2);

  console.log("Valid = " + valid);

}).call(this);
