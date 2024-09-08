import React from 'react'

const AppContext = React.createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
})

export default AppContext