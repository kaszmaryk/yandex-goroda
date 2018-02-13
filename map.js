/**
 * Инициализация карты
 * **/
let myMap;
ymaps.ready(function(){
    myMap = new ymaps.Map("YMapsID", {
        center: [55.76, 37.64],
        zoom: 2,
        controls: [],
        type: 'yandex#satellite'
    })
});