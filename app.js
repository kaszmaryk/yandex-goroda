//game variables
let usedCities = [];
let userCities = [];
let computerCities = [];
let lastLetter = 'а';
let gameIsOn = true;
let userCity = "";
let cityAddress = "";
let isUserWin = false;

//Game messages
let finalWord = "Сдаюсь!";
let cityIsUsedMsg = "город уже использовался!";
let cityIsNotExisting = "город с таким названием не существует!";

//DOM elements
let userCityInput = document.querySelector("#user-city-input");
let useVoiceButton = document.querySelector("#use-voice");
let submitButton = document.querySelector("#submit");
let failButton = document.querySelector("#fail");
let output = document.querySelector("#output");
let lastLetterElem = document.querySelector("#last-letter");

//Speach recognition
let SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
let SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
let SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/**
 * Main function of game
 *
function game() {
    if(!gameIsOn)
        return false;

    console.log(ymaps);
}*/

/**
 * Step of game
 * 
 * @param {string} cityName = null
 * @param {boolean} isUser = true
 * **/
function gameStep(cityName = null, isUser = true) {
    if(!isUser && !haveResponse(lastLetter)) {
        alern(finalWord);
        isUserWin = true;
        loose();
        return false;
    } else if(!isUser && haveResponse(lastLetter)) {
        cityName = getAnswer(lastLetter);
    } else if(isUser) {
        cityName = userCityInput.value;
    }

    if(!checkAnswer(cityName)) {
        return false;
    }

    var myGeocoder = ymaps.geocode(cityName, {results: 1, kind: "locality"});

    hasResult = true;

    myGeocoder.then(
        function(res){
            console.log(res);
            var firstGeoObject = res.geoObjects.get(0),
            // Координаты геообъекта.
            coords = firstGeoObject.geometry.getCoordinates(),
            // Область видимости геообъекта.
            bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            // Получаем строку с адресом и выводим в иконке геообъекта.
            cityAddress = firstGeoObject.getAddressLine();
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            // Добавляем первый найденный геообъект на карту.
            myMap.geoObjects.add(firstGeoObject);
            // Масштабируем карту на область видимости геообъекта.
            myMap.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true
            });                
        },
        function(err) {
            console.log(err);
            hasResult = false;
        }
    )
    .then(
        function(){
            usedCities.push(cityName.toLowerCase());
            lastLetter = getLastLetter(cityName);
            addAnswer(cityName, cityAddress, isUser);
            if(isUser) {
                userCities.push(formatCityName(cityName));
                gameStep(null,false);
            } else {
                computerCities.push(cityName);
                updateLastLetterElem(formatCityName(lastLetter));
            }
        }
    );
}

/**
 * Function checks if there're cities in object
 * 
 * @return {boolean} 
 * **/
function haveResponse() {
    return cities[lastLetter].length > 0;
}

/**
 * This function updates last letter in info
 * 
 * @param {string} lastLetter 
 * **/
function updateLastLetterElem(lastLetter) {
    lastLetterElem.innerHTML = lastLetter.toUpperCase();
}

/**
 * Function returns cityname from object
 * or returns finalWord if there's no answers
 * 
 * @param {string} letter - letter, on which city should be selected
 * @return {string} city || finalWord
 * **/
function getAnswer(letter) {
    city = cities[letter].pop();
    if(isCityUsed(city)) {
        if(haveResponse(letter)) {
            getAnswer(letter);
        } else {
            return finalWord;
        }
    } else {
        return city;
    }
}

/**
 * Function return last gaming letter of word
 *
 * @param {string} word - asked word
 * @returns {string} lastLetter - last gaming letter in word
 * */
function getLastLetter(word) {
    wordArr = word.split('');
    let lastLetter = '';
    do {
        lastLetter = wordArr.pop();
        console.log(lastLetter);
    } while ((lastLetter === "ь" || lastLetter === "ъ") && wordArr.length > 0);
    return lastLetter;
}

/**
 * Function checks if the city is correct
 *
 * @param {string} city - name of city
 * @returns {boolean} - is cityis correct
 * **/
function checkAnswer(city) {
    //todo: rewrite function
    city = city.toLowerCase();

    if(city.length <= 1
        || typeof(city) === 'number'
        || city.charAt(0) !== lastLetter) {

        return false;
    }

    if(isCityUsed(city)) {
        alert(cityIsUsedMsg);
        return false;
    }    

    if(city === finalWord) {
        return false;
    }

    return true;
}

/**
 * Function checks if city is used yet in this game
 *
 * @using {array} usedCities
 * @param {string} city - asked city
 * @returns {boolean} - is there's city in usedCities
 * */
function isCityUsed(city) {
    return usedCities.indexOf(city) > -1;
}

/**
 * Function add view of city name
 * 
 * @param {string} city - cityname
 * @param {string} player - player name * 
 * **/
function addAnswer(city, address, player, block = output){
    let answerBlock = document.createElement('div');    
    let cityBlock = document.createElement('p');
    let addressBlock = document.createElement('p');
    let playerClass = player ? "user" : "computer";
    answerBlock.className = 'answer-'+playerClass;
    addressBlock.className = "address-line";    
    cityBlock.innerHTML = formatCityName(city);
    addressBlock.innerHTML = address;
    answerBlock.appendChild(cityBlock);
    answerBlock.appendChild(addressBlock);
    block.insertBefore(answerBlock, block.firstChild);
}

/**
 * Function returns formatted city name by format Xx...x
 * 
 * @param {string} cityName
 * @returns {string} 
*/
function formatCityName(cityName) {
    let letters = cityName.toLowerCase().split('');
    letters[0] = letters[0].toUpperCase();
    return letters.join('');
}

/**
 * Function return last gaming letter of word
 *
 * @param {string} word - asked word
 * @returns {string} lastLetter - last gaming letter in word
 * */
function getLastLetter(word) {
    wordArr = word.split('');
    let lastLetter = '';
    do {
        lastLetter = wordArr.pop();
        console.log(lastLetter);
    } while ((lastLetter === "ь" || lastLetter === "ъ" || lastLetter === "ы") && wordArr.length > 0);
    return lastLetter;
}


/**
 * Function use speechAPI, recognize name of city 
*/
function getCityNameByVoice(){
    recognition = new SpeechRecognition();
    speechRecognitionList = new SpeechGrammarList();
    //speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    //todo: write a documentation
    recognition.start();
    console.log('Processing recognition');

    recognition.onresult = function(event) {
        let lastRes = event.results.length - 1;
        let cityName = event.results[lastRes][0].transcript;
        console.log(cityName);
        userCityInput.value = cityName;
        gameStep(cityName, true);
    }

    /*recognition.onspeechend = function() {
        recognition.stop();
      }
      
    recognition.onnomatch = function(event) {
        diagnostic.textContent = "I didn't recognise that color.";
    }
    
    recognition.onerror = function(event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }*/
}

/**
 * Function shows fail message and disables buttons and textinput
 * 
*/
function loose() {
    alert("Вы проиграли");
    userCityInput.disabled = true;
    useVoiceButton.disabled = true;
    submitButton.disabled = true;
    showSummary(isUserWin);
}

/**
 * Function shows summary of game
 * 
*/
function showSummary(isUserWin) {
    let winner = isUserWin ? "Вы выиграли!" : "Выиграл компьютер";
    let summary = document.querySelector("#summary");
    let winnerBlock = document.querySelector("#winner");
    let playerSumBlock = document.querySelector("#player-cities .sum");
    let computerSumBlock = document.querySelector("#computer-cities .sum");
    let playerCitiesList = document.querySelector("#player-cities .cities");
    let computerCitiesList = document.querySelector("#computer-cities .cities");

    let gamesSection = document.querySelector(".games-section");
    let yMapsID = document.querySelector("#YMapsID");

    gamesSection.setAttribute("style", "display: none;")
    yMapsID.setAttribute("style", "display: none;");

    winnerBlock.innerHTML = winner;
    playerSumBlock.innerHTML = "Города, названные вами: <br><span>" + userCities.length + "</span>";
    computerSumBlock.innerHTML = "Города, названные компьютером: <br><span>" + computerCities.length + "</span>";
    userCities.forEach(function(city){
        addAnswer(city, null, true, playerCitiesList);
    });
    computerCities.forEach(function(city){
        addAnswer(city, null, false, computerCitiesList);
    });
    summary.setAttribute("style", "display: flex;");
}

//game();
useVoiceButton.addEventListener('click', getCityNameByVoice);
submitButton.addEventListener('click', gameStep);
failButton.addEventListener('click', loose);   