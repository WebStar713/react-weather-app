import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormInput, Card, CardHeader } from "shards-react";

// Import API Calls
import { getFiveDaysWeatherData } from './API';

// Import Components
import WeatherCard from './components/WeatherCard';
import Chart from "react-apexcharts";

// Import CSS files
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

//import Constans, Types and Helper Functions
import { Days } from './constants/days';
import { WeatherData } from './types/weather';
import { checkEndOfDay } from './helpers/time';
import { getTypesOfWeather, getWeatherStats } from './helpers/weather';

const itemInRawLength = 4;
const App: React.FC = () => {
  const [fiveDaysWeatherData, setFiveDaysWeatherData] = useState()
  const [city, setCity] = useState('Paris');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const fiveDaysWeatherData = await getFiveDaysWeatherData(city);
        setFiveDaysWeatherData(fiveDaysWeatherData);
        setIsError(false);
      } catch (error) {
        console.error(error)
        setFiveDaysWeatherData({});
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [city]);

  const getChartOptions = (weatherDataList) => ({
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: getTypesOfWeather(weatherDataList)
    }
  })

  const getChartSeries = (weatherDataList): any => {
    const weatherTypes = getTypesOfWeather(weatherDataList);

    const weatherStats = getWeatherStats(weatherTypes, weatherDataList)
    return (
      weatherTypes.map((weatherType, index) => ({
        name: weatherType,
        data: [weatherStats[index]]
      }))
    )
  }

  const renderWeatherCards = (list: WeatherData[]) => {
    const fiveDays: JSX.Element[] = [];
    let row: JSX.Element[] = [];
    let daily: JSX.Element[] = [];

    for (let index = 0; index < list.length; index++) {
      const isLastWeatherForecastOfDay = checkEndOfDay(new Date(list[index].dt_txt));

      daily.push(<Col key={`Col-${index}`}>
        <WeatherCard weatherData={list[index]} />
      </Col>)
      if (daily.length === itemInRawLength || isLastWeatherForecastOfDay) {
        row.push(<Row key={`Row-${index}`}>{daily}</Row>)
        daily = []
      }
      if (isLastWeatherForecastOfDay) {
        fiveDays.push(<Card className="mt-2 mb-2 w-100" style={{ opacity: 0.89 }} key={`Card-${index}`}> <CardHeader><h2>{Days[fiveDays.length]}</h2></CardHeader>{row}</Card>)
        row = []
      }
    }
    return fiveDays
  }

  const renderWeatherStats = (weatherDataList) => (
    <Card className="mt-2 mb-2 w-100" style={{ opacity: 0.89 }}>
      <Chart
        options={getChartOptions(weatherDataList)}
        series={getChartSeries(weatherDataList)}
        type="bar"
      /> </Card>
  )

  return (
    <div className="App bg-gradient-info">
      <Container className="w-25">
        <FormInput placeholder="City Name" className="mb-2 pt-2" type="text"
          value={city}
          onChange={event => setCity(event.target.value)}
          style={{ opacity: 0.89 }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              setCity(event.target.value)
            }
          }}
        />
      </Container>
      {
        !fiveDaysWeatherData && <Container className="bg-gradient-info" style={{ height: '100px' }} />
      }
      {isError && <Card className="mt-2 mb-2" style={{ opacity: 0.89 }}> <CardHeader><h2>City not found</h2></CardHeader></Card>}
      {isLoading ? (
        <Card className="mt-2 mb-2 " style={{ opacity: 0.89 }}> <CardHeader><h2>Loading ...</h2></CardHeader></Card>
      ) : (<Container className="mt-1 pb-2 h-100">
        <Row>
          {fiveDaysWeatherData && fiveDaysWeatherData!.list && renderWeatherCards(fiveDaysWeatherData.list)}
          {fiveDaysWeatherData && fiveDaysWeatherData!.list && renderWeatherStats(fiveDaysWeatherData.list)
          }
        </Row >
      </Container>
        )}
    </div >
  );
}

export default App;
