var sylvester = require('sylvester'),
    Matrix = sylvester.Matrix,
    Vector = sylvester.Vector,
    lineareg= require('./node_modules/lineareg/lib/lineareg'),
    Game = require("./game"),
    Shuffle = require('./node_modules/knuth-shuffle/index.js');
    game = null;

function setupTestWeights(noserver) {
    game = new Game(true);
    var testWeights = [];
    for (var i = 0; i < game.N; i++) {
        var numEach = game.N/2;
        if (i % 2 ==0) {
            testWeights.push(1/numEach);
        }
        else {
            testWeights.push(-1/numEach);
        }
    }
    testWeights = Shuffle.knuthShuffle(testWeights);
    return testWeights;
}

function scoreforTestWeights(randomCandidate, testWeights) {
    if (testWeights == null) {
        testWeights = setupTestWeights();
    }
    return game.scoreVector(randomCandidate, testWeights);
}

var actualWeights = null;
function createSampleCandidates() {
    var candidates = [];
    var testWeights = setupTestWeights();
    actualWeights = testWeights;
    /*var sampleCand = [];
    var sampleScore = [];
    var sampleData = [];*/
    
    for (index = i = 1; i <= 20; index = ++i) {
      var candidate = {profile: null, score: null};
      candidate.profile = game.createRandomCandidateForMM();
      candidate.score = scoreforTestWeights(candidate.profile, testWeights);
      candidates.push(candidate);
    }
    return candidates;
}

function createGDCandidate(numAttr, cSoFar) {
    if (cSoFar.length == 0 || cSoFar == null) {
        console.log('did not rec');
        cSoFar = createSampleCandidates();
    }
    if (numAttr == null) {
        numAttr = game.N;
    }
    
    var finalCandidate = [];
    var totalPos = 1;
    var possibleMatches = [];
    for (var i = 0; i < numAttr; i++) { 
        var X = [];
        var y = [];

        for (var cand = 0; cand < cSoFar.length; cand++) {
            X.push(cSoFar[cand].profile[i]);
            y.push(cSoFar[cand].score);
        }

        //console.log(X);
        //console.log(y);
        var theta = [-1,-1];  //linear regression parameters
        var trainingData = lineareg.prepareTrainingData(X,y,theta);      
        var X_mat = trainingData["X_mat"];
        var y_vec = trainingData["y_vec"];
        var theta_vec = trainingData["theta_vec"];

        //Configurations for gradient descent
        var iterations = 10000;//100000;
        var alpha = 0.01;

        var J = lineareg.computeCost(X_mat, y_vec, theta_vec);
        //console.log('J');
        //console.log(J)
        //console.log("Attribute " + i);
        //console.log("old cost "+J);
        theta_vec = lineareg.gradientDescent(X_mat,y_vec,theta_vec,alpha,iterations);
        //console.log('theta_vec');
        //console.log(theta_vec);
        //console.log(X_mat);
        //console.log(y_vec);
        var J_new = lineareg.computeCost(X_mat, y_vec, theta_vec);
        //console.log("new cost "+ J_new);
        //console.log(J_new);
        if (theta_vec.e(1)+theta_vec.e(2) < 0) {
            finalCandidate[i] = 0;
        }
        else {
            /*if(numAttr-i == 1) {
               finalCandidate[i] = totalPos.toFixed(4);
            }
            else {
                finalCandidate[i] = (totalPos/(numAttr-i)).toFixed(4);
            }
            totalPos -= finalCandidate[i];*/
            var match = {pos:i,score:theta_vec.e(1)+theta_vec.e(2)};
            possibleMatches.push(match);
            finalCandidate[i] = 1;
        }
    }
    //console.log(finalCandidate);

    //console.log(game.scoreVector(randomCandidate, finalCandidate));
    /*var max = 0, min = 1.1, pos = null;
    for (var i = 0; i < finalCandidate.length; i++) {
        if (finalCandidate[i] > 0) {
            min = finalCandidate[i];
        }
    }*/
        
    /*possibleMatches.sort(function(a, b){return b.score-a.score});
    var numMatches = possibleMatches.length;
    for (var i = 0; i < numMatches; i++) {
        finalCandidate[possibleMatches[i].pos] = (1/numMatches).toFixed(4);
    }*/
    
    var numNeg = 0, numPos = 0;
    //if (actualWeights != null) {
        var fails = 0;
        for (var i = 0; i < numAttr; i++) {
            if (finalCandidate[i] == 0) {
                numNeg++;
            }
            else {
                numPos++;
            }
            if (actualWeights != null && actualWeights[i] > 0 && finalCandidate[i] == 0) {
                fails++;
            }
        }
        //console.log("FAILS: " + fails);
        //console.log(finalCandidate);
            console.log("NUM POS: " + numPos + ", NUM NEG: " + numNeg);

    //}
    
    return finalCandidate;
}

exports.createGDCandidate = createGDCandidate;
exports.setupTestWeights = setupTestWeights;
