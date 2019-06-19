// player game score module
var gamescore = (function(){
  var answers = [];
  var score = 0;

  function addRoundAnswer(answerInfo){
    answers.push(answerInfo.answer);
  }

  function calculateScore(){
    var trueAnswersInARow = 0;

    for (var i = 0; i < answers.length; i++) {
      if ( answers[i] ) {
        // true answer
        trueAnswersInARow++;
       // score += 100 * (i+1) * trueAnswersInARow;
          score += 1;
      }
      else {
        // false answer
        trueAnswersInARow = 0;
        //score -= 100;
          score -= 1;
      }
    };
  }

  function getFinalScore(){
    calculateScore();
    return score;
  }

  function resetScore(){
    score = 0;
    answers = [];
  }

  return {
    addRoundAnswer: addRoundAnswer,
    getFinalScore: getFinalScore,
    resetScore: resetScore
  };
})();