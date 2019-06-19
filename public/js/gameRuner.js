var gameRuner = (function () {

    var taskRound = 0;

    var visualTaskRightCount = 0;
    var mathTaskRightCount = 0;

    var visualTaskWrongCount = 0;
    var mathTaskWrongCount = 0;

    var visualTaskMissedCount = 0;
    var mathTaskMissedCount = 0;

    var taskTotalRoundNumber = 0;

    var isMathCurrentTask = 0;
    var isVisualCurrentTask = 0;

    var gameRoundTime = 0;


    //cache DOM
    var $gameProgressBar = $('.topProgress');
    var $scorePlaceholder = $('.gamescoreDataWrapp > p');

    var gameProgressBarWidth = $gameProgressBar.width();
    var gameType = 0;

    var type3LastType = '';

    // bind events
    events.on('taskAnswered', onTaskAnswered);


    /**
     * @typeOfGame 表示我们设计的三种实验treatment
     * 1 代表AAAAAAABBBBBBB模式，串行显示
     * 2 代表ABABABABABABAB模式，串行显示
     * 3 代表AB AB AB AB...模式，双列并行显示
     * */
    function startNewGame(typeOfGame) {
        gameType = typeOfGame;
        resetData(gameType);

        document.getElementsByClassName("taskContainerWrappMath")[0].style.display = 'none';
        document.getElementsByClassName("taskContainerWrappVisual")[0].style.display = 'none';

        showNewScreen();
    }

    function resetData(typeOfGame) {
        taskRound = 0;

        visualTaskRightCount = 0;
        visualTaskWrongCount = 0;
        visualTaskMissedCount = 0;
        mathTaskRightCount = 0;
        mathTaskWrongCount = 0;
        mathTaskMissedCount = 0;

        if (typeOfGame === 1) {
            taskTotalRoundNumber = 20;
            gameRoundTime = 2000;
        } else if (typeOfGame === 2) {
            taskTotalRoundNumber = 20;
            gameRoundTime = 2000;
        } else if (typeOfGame === 3) {
            taskTotalRoundNumber = 10;
            gameRoundTime = 4000;
        }
    }

    // ui回调之规定时间内答了
    function onTaskAnswered(anwserInfo) {
        // stat
        if (gameType === 1 || gameType === 2) {

            if (anwserInfo.source === 'math') {
                if (anwserInfo.answer === true) {
                    visualTaskRightCount++;
                } else {
                    visualTaskWrongCount++;
                }
            } else if (anwserInfo.source === 'visual') {
                if (anwserInfo.answer === true) {
                    mathTaskRightCount++;
                } else {
                    mathTaskWrongCount++;
                }
            }
            checkIfShowNextScreen();
        } else if (gameType === 3) {
            if (type3LastType === '') {
                type3LastType = anwserInfo.source;
                if (anwserInfo.answer === true) {
                    mathTaskRightCount++;
                } else {
                    mathTaskWrongCount++;
                }
            } else if(type3LastType !== anwserInfo.source){
                type3LastType = '';
                if (anwserInfo.answer === true) {
                    mathTaskRightCount++;
                } else {
                    mathTaskWrongCount++;
                }
                checkIfShowNextScreen();
            }
        }
    }

    // ui回调之规定时间内没有做答
    function onTaskMissed() {
        if (isMathCurrentTask) {
            mathTaskMissedCount++;
        }
        if (isVisualCurrentTask) {
            visualTaskMissedCount++;
        }

        checkIfShowNextScreen();
    }

    // 限时进度条结束和回答完成
    function checkIfShowNextScreen() {
        if (shouldGameFinish()) {
            showNewScreen();
        } else {
            // 结束了
            gameFinished();
        }
    }

    // 记录第几轮
    function showNewScreen() {
        isVisualCurrentTask = 0;
        isMathCurrentTask = 0;

        if (gameType === 1) {
            if (taskRound < 10) {
                keepMathTaskStop();
                launchVisualTask(2);
            } else if (taskRound < 20) {
                keepVisualTaskStop();
                launchMathTask(2);
            }
        } else if (gameType === 2) {
            if (taskRound % 2 === 0 && taskRound < 20) {
                keepMathTaskStop();
                launchVisualTask(2);
            } else if (taskRound % 2 === 1 && taskRound < 20) {
                keepVisualTaskStop();
                launchMathTask(2);
            }
        } else if (gameType === 3) {
            if (taskRound < 10) {
                launchVisualTask(1);
                launchMathTask(1);
            }
        }
        taskRound++;


        startGameProgressbar(gameRoundTime, function () {
            onTaskMissed();
        });
    }


    function shouldGameFinish() {
        return taskRound < taskTotalRoundNumber;
    }

    function startGameProgressbar(gameTime, callback) {
        $gameProgressBar.stop().css({right: gameProgressBarWidth});
        $gameProgressBar.animate({
            right: 0
        }, gameTime, "linear", function () {
            if (callback && typeof (callback) === "function") {
                callback();
            }
        });
    }

    // mode == 1, together
    // mode == 2, center
    function launchVisualTask(mode) {
        isVisualCurrentTask = 1;
        events.emit("launchVisualTask", mode);
    }

    function keepVisualTaskStop() {
        events.emit("stopVisualTask");
    }

    function keepMathTaskStop() {
        events.emit("stopMathTask");
    }

    // mode == 1, together
    // mode == 2, center
    function launchMathTask(mode) {
        isMathCurrentTask = 1;
        events.emit("launchMathTask", mode);
    }

    function gameFinished() {
        events.emit('gameFinished');
        $scorePlaceholder.html(getFinalScore());
        console.log("Game finished");
    }

    function getFinalScore() {
        var rightSum = mathTaskRightCount + visualTaskRightCount;
        console.log("rightSum is: " + rightSum);
        return rightSum;
    }

    return {
        getFinalScore: getFinalScore,
        startNewGame: startNewGame
    };
})();