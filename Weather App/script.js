const cityInput = document.querySelector('.city');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weathersummaryImg = document.querySelector('.weather-summary-image');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = '1bc7ca64cd48fc80dd33f1d162eca12b';
searchBtn.addEventListener('click', (e) => {
    const cityName = cityInput.value.trim();    
    if(cityName !== ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});
cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && cityInput.value.trim() !== ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});
async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}
async function updateWeatherInfo(cityName){
    const weatherData = await getFetchData('weather',cityName);
    if(weatherData.cod !== 200){
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);
    const {
        name : country,
        main : { temp, humidity },
        weather : [{ id,main }],
        wind :  {speed} 
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = `${Math.round(temp)}°C`;
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} km/h`;
    currentDateTxt.textContent = getCurrentDate();
    console.log(getCurrentDate());

    weathersummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    await updateForecastInfo(cityName);
    showDisplaySection(weatherInfoSection);
}
async function updateForecastInfo(cityName){
    const forecastData = await getFetchData('forecast',cityName);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    forecastItemsContainer.innerHTML = '';
    forecastData.list.forEach(forecastweather => {
        if(forecastweather.dt_txt.includes(timeTaken) && forecastweather.dt_txt.split(' ')[0] !== todayDate){
            updateForecastItems(forecastweather);
        }
    })
}
function updateForecastItems(weatherData){
    const {
        dt_txt : date,
        weather : [{ id }],
        main : { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const options = { month: 'short', day: '2-digit' };
    const formattedDate = dateTaken.toLocaleDateString('en-US', options);
    const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}"class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
                </div>`;
    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem);
}
function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg';
    if(id <= 321) return 'drizzle.svg';
    if(id <= 531) return 'rain.svg';
    if(id <= 622) return 'snow.svg';
    if(id <= 781) return 'atmosphere.svg';
    if(id <= 800) return 'clear.svg';
    else return 'clouds.svg';
}
function showDisplaySection(section){
    [notFoundSection, searchCitySection, weatherInfoSection].forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}
function getCurrentDate(){
    const date = new Date();
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
}