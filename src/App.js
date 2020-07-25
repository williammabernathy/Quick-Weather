import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
import './App.css';

// function for getting the day of the week using Date
// returns and array of the current day + the next four
// used to populate cards in App
function getDaysOfWeek() {
  var d = new Date();
  var weekday = new Array(7);
  var days = new Array(5);
  var currentDay = d.getDay();

  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  days[0] = weekday[currentDay];

  for (var i = 0; i < 4; i++) {
    currentDay++;
    if (currentDay === 7) {
      currentDay = 0;
    }
    days[i + 1] = weekday[currentDay];
  }

  return days;
}

// function for getting all weather icons
// placing them in an array
// and returning to be used to populate cards in App
function getWeatherIcons(results) {
  var weatherIcons = new Array(5);

  for (var i = 0; i < 5; i++) {
    weatherIcons[i] = "http://openweathermap.org/img/wn/" + results.list[i].weather[0].icon + "@2x.png";
  }

  return weatherIcons;
}

function getDailyTemperatures(results) {
  var temperaturesDaily = new Array(5);

  for (var i = 0; i < 5; i++) {
    temperaturesDaily[i] = Math.round(results.list[i].main.temp * (9 / 5) - 459.67);
  }

  return temperaturesDaily;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchZipCode: 40336,
    };

    this.setWeather = this.setWeather.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  // set the results with returned json data
  setWeather(results) {
    this.setState({ results });
  }

  // fetch weather (open weather)
  fetchWeather(searchZipCode) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${searchZipCode},us&appid=08d4fea27ae00e7c79b59befd31e8d18`)
      .then(response => response.json())
      .then(results => this.setWeather(results));
  }

  // when component mounts/lifecycle update, update the searched term and refetch data
  componentDidMount() {
    const { searchZipCode } = this.state;
    this.fetchWeather(searchZipCode);
  }

  // render the app
  render() {
    const { results, searchZipCode } = this.state;

    // if results are initially empty, return null
    if (!results) { return null; }

    var days = getDaysOfWeek();
    var weatherIcons = getWeatherIcons(results);
    var temperaturesDaily = getDailyTemperatures(results);

    return (
      <div className="App">
        <h1>Quick Weather</h1>

        <Form>
          <Form.Group>
            <Form.Label>Zip Code</Form.Label>
            <Form.Control placeholder="5 digi zip code" />
            <Form.Text>
              Currently, only US is supported.
            </Form.Text>
          </Form.Group>
        </Form>

        <CardDeck>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={weatherIcons[0]} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>{days[0]}</Card.Title>
              <Card.Text>
                {temperaturesDaily[0]}&deg;F
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={weatherIcons[1]} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>{days[1]}</Card.Title>
              <Card.Text>
                {temperaturesDaily[1]}&deg;F
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={weatherIcons[2]} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>{days[2]}</Card.Title>
              <Card.Text>
                {temperaturesDaily[2]}&deg;F
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={weatherIcons[3]} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>{days[3]}</Card.Title>
              <Card.Text>
                {temperaturesDaily[3]}&deg;F
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={weatherIcons[4]} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>{days[4]}</Card.Title>
              <Card.Text>
                {temperaturesDaily[4]}&deg;F
              </Card.Text>
            </Card.Body>
          </Card>

        </CardDeck>
      </div>
    );
  }
}

export default App;