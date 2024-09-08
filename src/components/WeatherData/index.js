import { Component } from "react";
import Header from "../Header";
import Loader from "react-loader-spinner"
import AppContext from "../../Context/AppContext";
import { CiTempHigh } from "react-icons/ci";

import "./index.css"


const apiStatusConstant = {
    success: "SUCCESS",
    inProgress: "INPROGRESS",
    failure: "FAILURE",
    initial: "INITIAL"
}

class WeatherData extends Component {
    state = { weatherData: [], weatherDescription: {} , apiStatus: apiStatusConstant.initial}

    componentDidMount() {
        this.getWeatherData()
    }

    getFetchedWeatherData = (data) => ({
        name: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min,
        humidity: data.main.humidity,
        speed: data.wind.speed,
        main: data.weather[0].main
    })

    getWeatherData = async () => {
        this.setState({ apiStatus: apiStatusConstant.inProgress })
        const { match } = this.props
        const { params } = match
        const { name } = params


        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=a811ca324acc5007a4b11015ba3b3e41`
        const options = {
            method: "GET"
        }
        const weatherResponse = await fetch(weatherApiUrl, options)

        if (weatherResponse.ok === true) {
            const weatherData = await weatherResponse.json()
            const updateWeatherData = this.getFetchedWeatherData(weatherData)

            this.setState({ weatherData: updateWeatherData, apiStatus: apiStatusConstant.success })
        }else {
            this.setState({ apiStatus: apiStatusConstant.failure })
        }
    }

    renderWeatherData = () => {
        const { weatherData } = this.state
        const { name, temp, feels_like, temp_min, temp_max, humidity, speed, main } = weatherData


        const windSpeed = (speed * 3.6).toFixed(2)
        const tempInCelcius = Math.ceil((temp - 273.15), 2)
        const feelsLikeTemp = Math.ceil((feels_like - 273.15), 2)
        const tempMin = Math.ceil((temp_min - 273.15), 2)
        const tempMax = Math.ceil((temp_max - 273.15), 2)

        return (
            <AppContext.Consumer>
                {value => {
                    const { isDarkTheme } = value
                    const textColor = isDarkTheme ? "textDark" : "textLight"
                    const border = isDarkTheme ? "borderDark" : "borderLight"

                    return (
                        <div className="weatherData-container">
                            <h1 className="cityName">{name}</h1>
                            <div className={`details-container ${border}`}>
                                <div>
                                    <p className={`now ${textColor}`}>Now</p>
                                    <h1 className={`temparature ${textColor}`}>{tempInCelcius}° C</h1>
                                    <p className={`text ${textColor}`}> Feels Like {feelsLikeTemp}° C</p>
                                    <p className={`text ${textColor}`}> <CiTempHigh /> Temp Min: {tempMin}° C</p>
                                    <p className={`text ${textColor}`}> <CiTempHigh /> Temp Max: {tempMax}° C</p>
                                </div>
                                <div>
                                    <p className={`cloudType ${textColor}`}>{main}</p>
                                    <p className={`text ${textColor}`}>Humidity: {humidity} %</p>
                                    <p className={`text ${textColor}`}>Wind Speed: {windSpeed} Km/hr</p>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </AppContext.Consumer>
        )
    }

    renderLoadingView = () => (
        <div className="loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#F7931E" height={40} width={40} />
        </div>
    )

    renderFailureView = () => (
        <div className="no-jobs-container">
            <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
                className="no-city-image"
            />
            <h1 className="failureHeading">Oops! Something Went Wrong</h1>
            <p className="failureDescription">
                We cannot seem to find the page you are looking for
            </p>
            <button type="button" className="failureButton" onClick={this.getWeatherData}>
                Retry
            </button>
        </div>
    )

    renderWeatherView = () => {
        const { apiStatus } = this.state

        switch (apiStatus) {
            case apiStatusConstant.success:
                return this.renderWeatherData();
            case apiStatusConstant.inProgress:
                return this.renderLoadingView();
            case apiStatusConstant.failure:
                return this.renderFailureView()
            default:
                return null;
        }
    }

    render() {
        return (
            <AppContext.Consumer>
                {value => {
                    const { isDarkTheme } = value

                    const homeBgColor = isDarkTheme ? "homeBgDark" : "homeBgLight"

                    return (
                        <>
                            <Header />
                            <div className={`weatherPage-container ${homeBgColor}`}>
                                {this.renderWeatherView()}
                            </div>
                        </>
                    )
                }}
            </AppContext.Consumer>
        )
    }
}

export default WeatherData
