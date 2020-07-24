import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import weatherPlaceholder from './weatherPlaceholder.png';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
import './App.css';

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
            <Card.Img variant="top" src={"http://openweathermap.org/img/w/" + results.list[0].weather[0].icon + ".png"} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>Day One</Card.Title>
              <Card.Text>
                {results.list[0].main.temp}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={"http://openweathermap.org/img/w/" + results.list[1].weather[0].icon + ".png"} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>Day Two</Card.Title>
              <Card.Text>
                {results.list[1].main.temp}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={"http://openweathermap.org/img/w/" + results.list[2].weather[0].icon + ".png"} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>Day Three</Card.Title>
              <Card.Text>
                {results.list[2].main.temp}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={"http://openweathermap.org/img/w/" + results.list[3].weather[0].icon + ".png"} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>Day Four</Card.Title>
              <Card.Text>
                {results.list[3].main.temp}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={"http://openweathermap.org/img/w/" + results.list[4].weather[0].icon + ".png"} alt="Weather Placeholder image" />
            <Card.Body>
              <Card.Title>Day Five</Card.Title>
              <Card.Text>
                {results.list[4].main.temp}
              </Card.Text>
            </Card.Body>
          </Card>

        </CardDeck>
      </div>
    );
  }
}

export default App;