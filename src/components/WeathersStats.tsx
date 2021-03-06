import React from 'react';
import { Card } from "shards-react";
import Chart from "react-apexcharts";

import { getTypesOfWeather, getWeatherStats } from '../helpers/weather';
import { IWeatherForecastListItem } from '../types/weather';

interface Iprops {
  weatherDataList: IWeatherForecastListItem[]
}

const WeatherStats = (props: Iprops) => {
  const { weatherDataList } = props;

  // return null if there is no weatherData in the list
  if (!weatherDataList) return null

  const getChartOptions = (weatherDataList: IWeatherForecastListItem[], preciseWeatherType = false) => ({
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: getTypesOfWeather(weatherDataList, preciseWeatherType)
    }
  })

  const getChartSeries = (weatherDataList: IWeatherForecastListItem[], preciseWeatherType = false): { name: string, data: number }[] => {
    const weatherTypes = getTypesOfWeather(weatherDataList, preciseWeatherType);
    const weatherStats = getWeatherStats(weatherTypes, weatherDataList, preciseWeatherType);

    return (
      [{
        name: "",
        data: weatherStats
      }]
    )
  }

  return (
    <>
      <Card className="mt-2 mb-2 w-100" style={{ opacity: 0.89 }}>
        <Chart
          options={getChartOptions(weatherDataList)}
          series={getChartSeries(weatherDataList)}
          type="bar"
        /> </Card>
      <Card className="mt-2 mb-2 w-100" style={{ opacity: 0.89 }}>
        <Chart
          options={getChartOptions(weatherDataList, true)}
          series={getChartSeries(weatherDataList, true)}
          type="bar"
        /> </Card>
    </>
  )
}

export default WeatherStats;