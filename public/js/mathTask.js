// math task module
(function () {

    var gameRunning = false;

    //cache dom

    var $taskContainerWrappMath = document.getElementsByClassName("taskContainerWrappMath")[0];
    var $mathTaskItem = $(".mathTaskItem");
    var $equation = $("#activeNumber");
    var $activePlaceholder = $('.activePlaceholder');
    var $mathTaskContainer = $('#mathTaskContainer');

    // bind events
    events.on('launchMathTask', launchMathTask);
    events.on('stopMathTask', stopMathTask);
    events.on('gameFinished', stop);

    $mathTaskItem.on('click', function () {
        checkAnswer($(this));
    });

    function launchMathTask(mode) {
        if (!gameRunning) {
            gameRunning = true;
            $activePlaceholder.hide(); // remove red square from math task
        }
        $taskContainerWrappMath.style.display = 'block';
        setTask();
    }

    function stopMathTask() {
        if (gameRunning) {
            gameRunning = false;
            $taskContainerWrappMath.style.display = 'none';
        }
    }

    function setTask() {
        var firstVal = Math.floor(Math.random() * 9) + 1; // 1 to 9
        var secondVal = Math.floor(Math.random() * 9) + 1; // 1 to 9
        var results = generateResults(firstVal + secondVal);
        appendResults(results, firstVal, secondVal);
    }

    // generate array of 4 values which contain real result
    // than shuffle and return shuffled array
    function generateResults(result) {
        var results = [];
        results.push(result);
        for (var i = 0; i < 3; i++) {
            if (i < 2) {
                results.push(result + (Math.floor(Math.random() * 5) + 1));
            } else {
                results.push(result - (Math.floor(Math.random() * 5) + 1));
            }
        }

        return shuffleResults(results);
    }

    // add generated results and equation to DOM
    function appendResults(results, firstVal, secondVal) {
        $mathTaskItem.each(function () {
            $(this).html('');
            var index = $mathTaskItem.index($(this));
            $(this).html(results[index]);
        });

        $equation.html(firstVal + '+' + secondVal);
    }

    function shuffleResults(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }

    // check if clicked result is the right answer
    function checkAnswer($clickedVal) {
        if (gameRunning) {

            var answer = false;
            var clickedVal = parseInt($clickedVal.html());
            var resultVal = eval($equation.html());

            if (clickedVal === resultVal) {
                answer = true;
            }

            finishRound(answer);
        }
    }

    function finishRound(answer) {
        if (gameRunning) {
            flashAnswerFeedback(answer);
            setTimeout(function () {
                events.emit('taskAnswered', {answer: answer, source: "math"});
            }, 110);

        }
    }

    function flashAnswerFeedback(answer) {
        var taskClass = 'redTaskContainer';
        if (answer) {
            taskClass = 'greenTaskContainer';
        }

        $mathTaskContainer.addClass(taskClass);
        setTimeout(function () {
            $mathTaskContainer.removeClass(taskClass);
        }, 100);
    }

    function stop() {
        gameRunning = false;
        // stop / reset slider
        // $progressBar.stop().css({top: 0});
    }

})();