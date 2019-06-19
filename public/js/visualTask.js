// visual task module
(function () {
    var gameRunning = false;

    // cache dom
    var $taskContainerWrappVisual = document.getElementsByClassName("taskContainerWrappVisual")[0];
    var $visualTaskItem = $('.visualTaskItem');
    var $activeVisualItem = $('#activeVisualItem');
    var $tasksImages = $('#visualTasksImages').children();
    var $visualTaskContainer = $("#visualTaskContainer");

    // bind events
    events.on('launchVisualTask', launchVisualTask);
    events.on('stopVisualTask', stopVisualTask);
    events.on('gameFinished', stop);

    $visualTaskItem.on('click', function () {
        checkAnswer($(this))
    });

    function launchVisualTask(mode) {
        if (!gameRunning) {
            gameRunning = true;
            $taskContainerWrappVisual.style.display = 'block';
        }
        setTask();
    }

    function stopVisualTask() {
        if (gameRunning) {
            gameRunning = false;
            $taskContainerWrappVisual.style.display = 'none';
        }
    }

    // set visual task for user to solve
    function setTask() {
        var roundImages = chouseRoundImages();
        var activeImage = roundImages[Math.floor(Math.random() * 4)];
        appendSelectedImages(roundImages, activeImage);
    }

    // chouse images (imgs IDs) for task
    // and return shuffled array of choused IDs
    function chouseRoundImages() {
        var startTaskImage = Math.floor(Math.random() * 10) * 4 + 1; // 1 to 37 ((x mod 4 ) = 1)
        var images = [];

        for (var i = 0; i < 4; i++) {
            images[i] = startTaskImage + i;
        }

        return shuffleImages(images);
    }

    // shuffle images in passed array and return that array
    function shuffleImages(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
        return o;
    }

    // append selected images to DOM
    function appendSelectedImages(roundImages, activeImage) {
        $visualTaskItem.each(function () {
            $(this).children().remove();
            var index = $visualTaskItem.index($(this));
            $(this).append('<img>').children(0).attr('src', "/images/appImages/" + roundImages[index] + ".jpg");
        });

        $activeVisualItem.children().remove();
        $activeVisualItem.append('<img>').children(0).attr('src', "/images/appImages/" + activeImage + ".jpg");
    }

    // check if clicked image right answer
    function checkAnswer($clickedImage) {
        if (gameRunning) { // discard clicks before first round
            var answer = false;
            var clickedImgSrc = $clickedImage.children().first().attr('src');
            var activeImgSrc = $activeVisualItem.children().first().attr('src');
            if (clickedImgSrc === activeImgSrc) {
                answer = true;
            }
            finishRound(answer);
        }
    }

    // emit that round timer is expired
    // or that the user has provided an answer
    function finishRound(answer) {
        if (gameRunning) {
            flashAnswerFeedback(answer);
            setTimeout(function () {
                events.emit('taskAnswered', {answer: answer, source: "visual"});
            }, 110);
        }
    }

    function flashAnswerFeedback(answer) {
        var taskClass = 'redTaskContainer';
        if (answer) {
            taskClass = 'greenTaskContainer';
        }
        $visualTaskContainer.addClass(taskClass);
        setTimeout(function () {
            $visualTaskContainer.removeClass(taskClass);
        }, 100);
    }

    function stop() {
        gameRunning = false;
    }

})();