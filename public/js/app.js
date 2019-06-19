$(window).load(function () {
    var $highscoresWrapper = $('.highscoresWrapper');

    showHighscoresList();

    function showHighscoresList() {
        $highscoresWrapper.animate({
            top: 0
        }, 500, "linear");
    }

});

$(document).ready(function () {
    var gameType = 0;

    // sections
    var $loadingWrapper = $('.loadingWrapper');
    var $highscoresWrapper = $('.highscoresWrapper');
    var $gameWrapper = $('.gameWrapper');
    var $gamescoreWrapper = $('.gamescoreWrapper');

    // buttons
    var $startGame1 = $(".startGameType1");
    var $startGame2 = $(".startGameType2");
    var $startGame3 = $(".startGameType3");
    var $newGameGamescoreButton1 = $(".newGameGamescoreButton1");
    var $newGameGamescoreButton2 = $(".newGameGamescoreButton2");
    var $newGameGamescoreButton3 = $(".newGameGamescoreButton3");
    var $saveScoreButton = $('.saveScoreButton');

    var $loadingImage = $('.loadingImage');
    var $scorePlaceholder = $('.gamescoreDataWrapp > p');
    var $playerNameInput = $('.gamescoreDataWrapp > input');
    var $topProgressBarWrapp = $('.topProgressBarWrapp');
    var $taskContainerWrappVisual = $('.taskContainerWrappVisual');

    // events
    $startGame1.on("click", {type: 1}, startGameFromHigscores);
    $startGame2.on("click", {type: 2}, startGameFromHigscores);
    $startGame3.on("click", {type: 3}, startGameFromHigscores);

    $newGameGamescoreButton1.on("click", {type: 1}, newGameFromGamescoreSection);
    $newGameGamescoreButton2.on("click", {type: 2}, newGameFromGamescoreSection);
    $newGameGamescoreButton3.on("click", {type: 3}, newGameFromGamescoreSection);
    $saveScoreButton.on("click", saveGamescore);
    events.on("gameFinished", showGamescoreSection);

    init();

    function init() {
        setSectionsHeight(function () {
            showLoadingImage();
        });
        setSectionsOffsets();
        centerGameWrapper();
    }

    // gameplay functions
    function startNewGame(typeOfGame) {
        gameType = typeOfGame;
        gameRuner.startNewGame(typeOfGame);
    }

    function startGameFromHigscores(type) {
        var typeOfGame = type.data['type'];
        console.log('startGameFromHigscores: ' + typeOfGame);
        $gameWrapper.animate({
            top: 0
        }, 500, "linear", function () {
            startNewGame(typeOfGame);
        });
    }

    function newGameFromGamescoreSection(type) {
        var typeOfGame = type.data['type'];
        $gamescoreWrapper.animate({
            top: $(window).height()
        }, 1000, "linear", function () {
            startNewGame(typeOfGame);
        });
    }

    function saveGamescore() {
        var data = {};

        animateSaveButton();

        data.score = gameRuner.getFinalScore();
        data.gametype = gameType;
        data.player = $playerNameInput.val();

        $.ajax({
            url: '/api/players',
            method: 'PUT',
            data: data
        }).done(function () {
            console.log("/api/players successed");
            resetSendForm();
            moveToHighscoresAfterSave();
        });
        console.log("ajax /api/players requested");
    }

    // functions for animation and showing diff sections
    function showGamescoreSection() {
        $gamescoreWrapper.css({top: 0});
    }

    function animateSaveButton() {
        var $image = $('<img>');
        $image.attr('src', '/images/loading.gif');
        $saveScoreButton.html('').append($image);
    }

    function moveToHighscoresAfterSave() {
        $gamescoreWrapper.animate({
            top: $(window).height()
        }, 1000, "linear", function () {
            $gameWrapper.animate({
                top: $(window).height()
            }, 1000, "linear");
        });
    }

    function resetSendForm() {
        $saveScoreButton.html('Save Score');
        $playerNameInput.val('');
        $scorePlaceholder.html('');
    }

    // init functions
    function setSectionsHeight(callback) {
        $loadingWrapper.height($(window).height());
        $highscoresWrapper.height($(window).height());
        $gameWrapper.height($(window).height());
        $gamescoreWrapper.height($(window).height());

        if (callback && typeof (callback) === 'function') {
            callback();
        }
    }

    function setSectionsOffsets() {
        $gameWrapper.css({top: $(window).height()});
        $gamescoreWrapper.css({top: $(window).height()});
    }

    function showLoadingImage() {
        $loadingImage.css("display", "inline");
    }

    function centerGameWrapper() {
        var margin = $gameWrapper.height() - $topProgressBarWrapp.height() - $taskContainerWrappVisual.height() - 20;
        margin /= 2;
        $topProgressBarWrapp.css({marginTop: margin});
    }
});