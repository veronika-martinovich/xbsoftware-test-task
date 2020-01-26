document.addEventListener('DOMContentLoaded', function(){

  let table = document.querySelector('tbody');
  let form = document.querySelector('form');
  let newCity = document.querySelector('input[name="city"]');
  let newState = document.querySelector('input[name="state"]');
  let newLat = document.querySelector('input[name="lat"]');
  let newLon = document.querySelector('input[name="lon"]');

  function CityMap(str){
    this.listOfCities = str.slice(0, -1).split(";");
    
    this.handleData = function(arr) {
      let cities = arr.map(item => {
        let obj = {};
        obj.cityName = item.split(",")[0].slice(1);
        obj.state = item.split(",")[1].slice(1, 3);
        obj.lat = Number(item.split(",")[2]);
        obj.lon = Number(item.split(",")[3]);
        return obj;
        })
        return cities;
    }

    this.cities = localStorage.cities ? JSON.parse(localStorage.getItem('cities')) : this.handleData(this.listOfCities);

    this.addCity = function(city, state, lat, lon){
      let obj = {};
      obj.cityName = city;
      obj.state = state;
      obj.lat = lat;
      obj.lon = lon;
      this.cities.push(obj);
    }

    this.getMostCity = function(worldSide){
      if (worldSide === 'North') {
        return this.getNorthernmostCity()
      }
      if (worldSide === 'East') {
        return this.getEasternmostCity()
      }
      if (worldSide === 'South') {
        return this.getSouthernmostCity()
      }
      if (worldSide === 'West') {
        return this.getWesternmostCity()
      }
    }

    this.getNorthernmostCity = function() {
      let maxLat = -90;
      this.cities.forEach(item => {
        if (item.lat > maxLat) {
          maxLat = item.lat;
        }
      })

      let northernmostCityName = this.cities.find(item => {
        return item.lat === maxLat
      }).cityName;

      return northernmostCityName;
    }

    this.getEasternmostCity = function() {
      let maxLon = -180;
      this.cities.forEach(item => {
        if (item.lon > maxLon) {
          maxLon = item.lon;
        }
      })

      let easternmostCityName = this.cities.find(item => {
        return item.lon === maxLon
      }).cityName;

      return easternmostCityName;
    }

    this.getSouthernmostCity = function() {
      let minLat = 90;
      this.cities.forEach(item => {
        if (item.lat < minLat) {
          minLat = item.lat;
        }
      })

      let southernmostCityName = this.cities.find(item => {
        return item.lat === minLat
      }).cityName;

      return southernmostCityName;
    }

    this.getWesternmostCity = function() {
      let minLon = 180;
      this.cities.forEach(item => {
        if (item.lon < minLon) {
          minLon = item.lon;
        }
      })

      let westernmostCityName = this.cities.find(item => {
        return item.lon === minLon
      }).cityName;

      return westernmostCityName;
    }

    this.getClosestCity = function(lat, lon) {

      function degToRad(deg) {
        return deg * (Math.PI/180);
      }

      const R = 6371;
      let sinLat = Math.sin(degToRad(lat));
      let cosLat = Math.cos(degToRad(lat));
      let distances = this.cities.map(item => {
        let sinLatCity = Math.sin(degToRad(item.lat));
        let cosLatCity = Math.cos(degToRad(item.lat));
        let cosDeltaLon = Math.cos(degToRad(lon - item.lon));
        let dist = Math.acos(sinLat * sinLatCity + cosLat * cosLatCity * cosDeltaLon) * R;
        return dist; 
      })
      let minDist = Math.min.apply(null, distances);
      let closestCityName = this.cities.find((item, index) => {
        return distances.indexOf(minDist) === index;
      }).cityName;

      return closestCityName;
    }

    this.getStates = function() {
      let states = [];
      this.cities.forEach(item => {
       if (!states.includes(item.state)) {
         states.push(item.state)
       }
      })
      return states.join(" ");
    }

    this.searchByState = function(state) {
      let searchResults = this.cities.filter(item => {
        return item.state === state
      });
      let cityNames = searchResults.map(item => {
        return item.cityName
      });
      return cityNames;
    }
  }

  function createTableRowMarkup(cityObj) {
    let tableRow = document.createElement('tr');
    let cityData = document.createElement('td');
    cityData.textContent = cityObj.cityName;
    let stateData = document.createElement('td');
    stateData.textContent = cityObj.state;
    let latData = document.createElement('td');
    latData.textContent = cityObj.lat;
    let lonData = document.createElement('td');
    lonData.textContent = cityObj.lon;
    tableRow.append(cityData, stateData, latData, lonData);
    return tableRow;
  }

  function updateMarkup(arr){
    table.innerHTML = '';
    arr.forEach(item => {
      let tableRow = createTableRowMarkup(item);
      table.append(tableRow);
    })
    localStorage.setItem('cities', JSON.stringify(arr));
  }

  form.onsubmit = function(e){
    e.preventDefault();
    cityMap.addCity(newCity.value, newState.value, newLat.value, newLon.value);
    updateMarkup(cityMap.cities);
    newCity.value = '';
    newState.value = '';
    newLat.value = '';
    newLon.value = '';
  }

  let cityMap = new CityMap('"Nashville, TN", 36.17, -86.78;"New York, NY", 40.71, -74.00;"Atlanta, GA", 33.75, -84.39;"Denver, CO", 39.74, -104.98;"Seattle, WA", 47.61, -122.33;"Los Angeles, CA", 34.05, -118.24;"Memphis, TN", 35.15, -90.05;')
  updateMarkup(cityMap.cities);

  console.log(cityMap.searchByState('CO'));
  console.log(cityMap.getStates());
  console.log(cityMap.getClosestCity(33, -84));
  console.log(cityMap.cities);
  console.log(cityMap.getMostCity('North'));
  console.log(cityMap.getMostCity('East'));
  console.log(cityMap.getMostCity('South'));
  console.log(cityMap.getMostCity('West'));
  console.log(cityMap.cities);
  console.log(localStorage.cities)
})