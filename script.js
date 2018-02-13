var usedCities = [];
var finalWord = "Сдаюсь";
var cityIsUsedMsg = "Город уже назывался!";
var cityIsNotExistMsg = "Город не существует";
var userCityInput = document.querySelector("#user-city-input");
var useVoiceButton = document.querySelector("#use-voice");
var submitButton = document.querySelector("#submit");
var failButton = document.querySelector("#fail");
var output = document.querySelector("#output");
var lastLetter = 'а';

console.log(submitButton);

/**
 * Function checks if there's a response in array
 *
 * @using {jsonObject} cities
 * @param {string} word - asked word
 * @returns {boolean} - is there's a response
 **/
function haveResponse(word){
    return cities[getLastLetter(word)].length > 0;
}


/**
 * Function returns answer on letter
 *
 * @using {jsonObject} cities
 * @param {string} letter - asked letter
 * @returns {string} city - answer city
 **/
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
    if(city.length <= 1
        || typeof(city) === 'number'
        || city.charAt(0) !== lastLetter) {

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
 * Main function. Take users input and create response
 * **/
function gameStep(){
    //todo: rewrite function to check users input
    userCity = userCityInput.value.toLowerCase();
    console.log(userCity);
    if(!checkAnswer(userCity)) {
        alert("City must started on '" + lastLetter + "' letter");
        return false;
    }
    if(isCityUsed(userCity)) {
        alert(cityIsUsedMsg);
        return false;
    } else {
        addCity(userCity);        
    }

    
}

function addAnswer(city, player){
    var answerBlock = document.createElement('div');
    answerBlock.className = 'answer-'+player;
    answerBlock.innerHTML = city;
    output.appendChild(answerBlock);
}

function computerAnswer(userCity) {
    if(haveResponse(userCity)) {
        computerCity = getAnswer(lastLetter);
        console.log(computerCity);
        if(computerCity === finalWord) {
            console.log(finalWord);
            alert(finalWord);
        } else {
            addAnswer(computerCity, 'computer');
            lastLetter = getLastLetter(computerCity);
            usedCities.push(computerCity);
        }
    } else {
        console.log(finalWord);
        alert(finalWord);
    }
}

function getCoords(cityName) {
    var myGeocoder = ymaps.geocode(cityName, {results: 1}); //делаю запрос
    var result;
    myGeocoder.then( //при получении ответа делаю это
        function (res) {
            result = res.geoObjects.get(0).geometry.getCoordinates();
            console.log(result);
        }
    );
    return result;
}

function addCity(userCity) {
    var myGeocoder = ymaps.geocode(userCity, {results: 1, kind: "locality"});
    myGeocoder.then(
        function (res) {
            var firstGeoObject = res.geoObjects.get(0),
            // Координаты геообъекта.
            coords = firstGeoObject.geometry.getCoordinates(),
            // Область видимости геообъекта.
            bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            // Получаем строку с адресом и выводим в иконке геообъекта.
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            // Добавляем первый найденный геообъект на карту.
            myMap.geoObjects.add(firstGeoObject);
            // Масштабируем карту на область видимости геообъекта.
            myMap.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true
            });
            addAnswer(userCity, 'user');
            lastLetter = getLastLetter(userCity);
            usedCities.push(userCity);
            computerAnswer(userCity);            
        }, 
        function(err) {
            alert(cityIsNotExistMsg);
        }
    );
} 

submitButton.addEventListener('click', gameStep);
