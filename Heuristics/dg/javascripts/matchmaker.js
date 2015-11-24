// Generated by CoffeeScript 1.10.0
(function() {
  var MatchMaker, Utils, matchmakerSocket, net, utilsL;

  net = require('net');

  Utils = require("./utils");

  utilsL = new Utils;

  matchmakerSocket = net.createServer();

  MatchMaker = (function() {
    function MatchMaker() {
      this.utils = new Utils;
      this.N = this.utils.N;
      this.HOST = this.utils.HOST;
      this.MATCHMAKER_PORT = this.utils.MATCHMAKER_PORT;
      this.time_left_in_seconds = 120;
    }

    MatchMaker.prototype.addListener = function(listener) {
      this.listener = listener;
      return console.log("MM added Listener");
    };

    MatchMaker.prototype.checkIfNumbersValid = function(numbers) {
      var i, len, number;
      if (numbers.length !== this.N) {
        return false;
      }
      for (i = 0, len = numbers.length; i < len; i++) {
        number = numbers[i];
        if (number < 0) {
          return false;
        } else if (number > 1) {
          return false;
        } else if (utilsL.numberOfDecimals(number) > 4) {
          return false;
        }
      }
      return true;
    };

    MatchMaker.prototype.makeNumsValid = function(numbers) {
      var additionalNumsNeedded, amountToRemove, i, index, j, len, num, ref;
      if (numbers.length > this.N) {
        amountToRemove = numbers.length - this.N;
        numbers = numbers.slice(this.N, amountToRemove);
      } else if (numbers.length < this.N) {
        additionalNumsNeedded = this.N - numbers.length;
        for (i = 0, ref = additionalNumsNeeded; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--) {
          numbers.push(0);
        }
      }
      for (index = j = 0, len = numbers.length; j < len; index = ++j) {
        num = numbers[index];
        if (num < 0) {
          numbers[index] = 0;
        } else if (num > 1) {
          numbers[index] = 1;
        }
      }
      return numbers;
    };

    MatchMaker.prototype.receivedMessage = function(message) {
      var time_message_received, total_turnaround_time, valid;
      this.currentNums = utilsL.convertStringToNumArray(message);
      valid = this.checkIfNumbersValid(this.currentNums);
        
        console.log("VALID");
    
      console.log(valid);
      if (valid) {
        this.lastValidNums = this.currentNums;
          console.log(message);
      } else {
        if (typeof this.lastValidNums === 'undefined') {
          this.currentNums = utilsL.convertStringToNumArray(message, 4);
          this.lastValidNums = this.makeNumsValid(this.currentNums);
        }
      }
      time_message_received = new Date().getTime();
      total_turnaround_time = (time_message_received - this.time_message_sent) / 1000;
      this.time_left_in_seconds = Math.ceil(this.time_left_in_seconds - total_turnaround_time);
      console.log("Time left for MatchMaker in seconds: " + this.time_left_in_seconds);
      return this.listener.receivedCandidateFromMM(this.lastValidNums);
    };

    MatchMaker.prototype.sendMessage = function(message) {
      this.client.write(message);
      return this.time_message_sent = new Date().getTime();
    };

    MatchMaker.prototype.startServer = function() {
      this.server = matchmakerSocket;
      this.server.on('connection', (function(_this) {
        return function(client) {
          _this.client = client;
          _this.listener.connectedToMM();
          return _this.client.on('data', function(data) {
            return _this.receivedMessage(data);
          });
        };
      })(this));
      this.server.listen(this.MATCHMAKER_PORT);
      return console.log("Matchmaker Port started on port " + this.MATCHMAKER_PORT);
    };

    MatchMaker.prototype.timed_out = function() {
      return this.time_left_in_seconds < 0;
    };

    return MatchMaker;

  })();

  module.exports = MatchMaker;

}).call(this);