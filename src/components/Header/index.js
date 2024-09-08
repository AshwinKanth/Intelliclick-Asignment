import React from 'react'
import { Link } from "react-router-dom"
import AppContext from '../../Context/AppContext'

import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

import "./index.css"


const Header = () => {

    return (
        <AppContext.Consumer>
            {value => {
                const { isDarkTheme, toggleTheme } = value

                const onClickChangeTheme = () => {
                    toggleTheme()
                }

                const navBgColor = isDarkTheme ? "navBgDark" : "navBgLight"
                const navTextColor = isDarkTheme ? "navTextDark" : "navTextLight"


                return (
                    <nav className={`nav-container ${navBgColor}`}>
                        <div className='logo-container'>
                            <Link to="/" className="navLink">
                                <img src='https://res.cloudinary.com/dq1ktqbtb/image/upload/v1725778417/weather_image_yo2zs6.png' alt='weatherImage' className='navImage' />
                                <h1 className={`navHeading ${navTextColor}`}>Weather</h1>
                            </Link>
                        </div>
                        <p onClick={onClickChangeTheme}>{isDarkTheme ? <FaMoon className='moonIcon' size={40} /> : <MdSunny className='sunIcon' size={40} />}</p>
                    </nav>
                )
            }}
        </AppContext.Consumer>
    )
}

export default Header