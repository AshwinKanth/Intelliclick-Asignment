import React, { Component } from 'react'
import {Route,Switch} from "react-router-dom"
import CitiesTable from './components/CitiesTable'
import WeatherData from "./components/WeatherData"
import AppContext from './Context/AppContext'


class App extends Component {
  state = { isDarkTheme: false }

  toggleTheme = () => {
    this.setState(prevState => ({ isDarkTheme: !prevState.isDarkTheme }))
  }

  render() {
    const { isDarkTheme } = this.state
    return (
      <AppContext.Provider value={{
        isDarkTheme, toggleTheme: this.toggleTheme,
      }}>

        <Switch>
          <Route  exact path="/" component={CitiesTable}/>
          <Route exact path="/weather/:name" component={WeatherData} />
        </Switch>
      </AppContext.Provider>
    )
  }
}


export default App