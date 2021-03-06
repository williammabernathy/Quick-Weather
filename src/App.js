import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import CardDeck from 'react-bootstrap/CardDeck';
import './App.css';

// function for getting the day, month and standard time using the date string
// return from the api call
function getDaysOfWeek(dateString) {
  var d = new Date(dateString.replace(' ', 'T'));
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var currentDay = d.getDay();
  var currentMonth = d.getMonth();

  // convert military time to 12 hour format including AM or PM
  var hours = d.getHours();
  var AmOrPm = hours >= 12 ? "p.m." : "a.m.";
  hours = (hours % 12) || 12;
  var minutes = d.getMinutes();
  var finalTime = hours + ":" + minutes + "0 " + AmOrPm.toUpperCase();

  var dayName = (weekday[currentDay] + ", " + month[currentMonth] + " " + d.getDate() + " | " + finalTime).toString();

  return dayName;
}

// function called to smooth scroll to the top of the page
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// function for getting the weather data
/*
weatherInfo[i][0] = list.dt_text (date)
weatherInfo[i][1] = temp
weatherInfo[i][2] = feels like
weatherInfo[i][3] = min temp
weatherInfo[i][4] = max temp
weatherInfo[i][5] = humidity %
weatherInfo[i][6] = weather.main/weather.description
weatherInfo[i][7] = wind speed
weatherInfo[i][8] = weather icon
weatherInfo[i][9] = city name
*/
function getWeatherData(results) {
  if (results.message === "city not found") { return null; }

  var weatherInfo = new Array(39);

  // populate array with arrays
  for (var i = 0; i < 39; i++) {
    weatherInfo[i] = new Array(10);
  }

  // will nested arrays with data
  for (var j = 0; j < 39; j++) {
    weatherInfo[j][0] = results.list[j].dt_txt;
    weatherInfo[j][1] = Math.round(results.list[j].main.temp);
    weatherInfo[j][2] = Math.round(results.list[j].main.feels_like);
    weatherInfo[j][3] = Math.round(results.list[j].main.temp_min);
    weatherInfo[j][4] = Math.round(results.list[j].main.temp_max);
    weatherInfo[j][5] = results.list[j].main.humidity;
    weatherInfo[j][6] = (results.list[j].weather[0].description).charAt(0).toUpperCase() + (results.list[j].weather[0].description).slice(1);
    weatherInfo[j][7] = Math.round(results.list[j].wind.speed);
    weatherInfo[j][8] = "http://openweathermap.org/img/wn/" + results.list[j].weather[0].icon + "@2x.png";
    weatherInfo[j][9] = results.city.name;
  }

  return weatherInfo;
}

/*
  Main
*/
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchZipCode: 40336,
    };

    this.setWeather = this.setWeather.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
    this.fetchWeatherSearch = this.fetchWeatherSearch.bind(this);
    this.handelZipChange = this.handelZipChange.bind(this);
  }

  // set the results with returned json data
  setWeather(results) {
    this.setState({ results });
  }

  // fetch weather (open weather)
  fetchWeather(searchZipCode) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${searchZipCode},us&units=imperial&appid=08d4fea27ae00e7c79b59befd31e8d18`)
      .then(response => response.json())
      .then(results => this.setWeather(results));
  }

  // fetch weather on search submission
  fetchWeatherSearch(event) {
    event.preventDefault();
    var searchedValue = this.state.searchZipCode;
    var validZip = /^\d{5}$|^\d{5}-\d{4}$/;

    if (searchedValue === "" || searchedValue === null || !validZip.test(searchedValue)) {
      alert("Invalid Input");
    }
    else {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${searchedValue},us&units=imperial&appid=08d4fea27ae00e7c79b59befd31e8d18`)
        .then(response => response.json())
        .then(results => this.setWeather(results));
    }
  }

  // when component mounts/lifecycle update, update the searched term and refetch data
  componentDidMount() {
    const { searchZipCode } = this.state;
    this.fetchWeather(searchZipCode);
  }

  // set the searched zipCode
  handelZipChange(event) {
    event.preventDefault();
    this.setState({ searchZipCode: event.target.value });
  }

  // render the app
  render() {
    const { results } = this.state;

    // if results are initially empty, return null
    if (!results) { return null; }

    // sort our fetched data to populate fields
    var weatherInfo = getWeatherData(results);

    // if weatherInfo returns an error for an incorrect zip code, display appropriately 
    if (!weatherInfo) {
      return (
        <div className="App">
          <div className="contentContainer">

            <Navbar className="navBar" bg="dark" variant="dark" sticky="top">
              <Navbar.Brand>Quick Weather</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Form className="backToTopForm">
                  <Button className="backToTopButton" variant="dark" onClick={scrollTop}>Back To Top</Button>
                </Form>
                <Navbar.Text>
                  <a href="https://github.com/williammabernathy/Quick-Weather">GitHub</a>
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>

            <div className="formContainer">
              <Form onSubmit={(event) => { this.fetchWeatherSearch(event) }}>
                <Form.Group>
                  <Form.Label className="formLabel">Zip Code (<b>Try Again</b>):</Form.Label>
                  <Form.Control
                    className="controlSearchBar"
                    value={this.state.searchZipCode}
                    type="text"
                    placeholder="Zip Code"
                    onChange={(event) => { this.setState({ searchZipCode: event.target.value }) }}
                  />
                  <Form.Text className="formText">
                    Currently, only the U.S. is supported.
                  </Form.Text>
                </Form.Group>

                <Button as="input" type="submit" value="Submit" />
              </Form>
            </div>

            <div className="errorContainer">
              Oops! Looks like something went wrong. Most likely, the zip code doesn't exists. <br />
              If you believe the archives to be incomplete, while impossible, maybe submit an issue with <a href="https://openweathermap.org/api">Open Weather</a>
            </div>

            <div className="footerContainer">
              <footer>
                Built by <a href="https://github.com/williammabernathy">William Abernathy</a> with React<br />
                Data from <a href="https://openweathermap.org/api">Open Weather</a>
              </footer>
            </div>
          </div>
        </div >
      );
    }

    return (
      <div className="App">
        <div className="contentContainer">

          <Navbar className="navBar" bg="dark" variant="dark" sticky="top">
            <Navbar.Brand>Quick Weather</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Form className="backToTopForm">
                <Button className="backToTopButton" variant="dark" onClick={scrollTop}>Back To Top</Button>
              </Form>
              <Navbar.Text>
                <a href="https://github.com/williammabernathy/Quick-Weather">GitHub</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>

          <div className="formContainer">
            <Form onSubmit={(event) => { this.fetchWeatherSearch(event) }}>
              <Form.Group>
                <Form.Label className="formLabel">Zip Code (Currently showing results for <b>{weatherInfo[0][9]}</b>):</Form.Label>
                <Form.Control
                  className="controlSearchBar"
                  value={this.state.searchZipCode}
                  type="text"
                  placeholder="Zip Code"
                  onChange={(event) => { this.setState({ searchZipCode: event.target.value }) }}
                />
                <Form.Text className="formText">
                  Currently, only the U.S. is supported.
                </Form.Text>
              </Form.Group>

              <Button as="input" type="submit" value="Submit" />
            </Form>
          </div>

          <div className="cardDeckContainer">
            <CardDeck className="cardDeck">
              {weatherInfo.map((data, index) => {
                return (
                  <Card className="weatherCards" key={index} >
                    <Card.Img className="bsCardImage" variant="top" src={weatherInfo[index][8]} alt="Weather Image" />
                    <Card.Header as="h5">{getDaysOfWeek(data[0])}</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        Temp: {data[1]}&deg;F<br />
                        Feels Like: {data[2]}&deg;F<br />
                        Low: {data[3]}&deg;F<br />
                        High: {data[4]}&deg;F<br />
                        Humidity: {data[5]}%<br />
                        Description: {data[6]}<br />
                        Wind Speed: {data[7]} Miles/hour<br />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )
              })}
            </CardDeck>
          </div>

          <div className="footerContainer">
            <footer>
              Built by <a href="https://github.com/williammabernathy">William Abernathy</a> with React<br />
              Data from <a href="https://openweathermap.org/api">Open Weather</a>
            </footer>
          </div>
        </div>
      </div >
    );
  }
}

export default App;