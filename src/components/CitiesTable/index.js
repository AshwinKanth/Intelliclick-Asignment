import { Component } from "react";
import {Link} from "react-router-dom"
import { RiSearch2Line } from "react-icons/ri";
import Header from "../Header";
import InfiniteScroll from 'react-infinite-scroll-component';
import AppContext from "../../Context/AppContext";
import Loader from "react-loader-spinner"
import "./index.css"


const apiStatusConstant = {
    success: "SUCCESS",
    inProgress: "INPROGRESS",
    failure: "FAILURE",
    initial: "INITIAL"
}



class CitiesTable extends Component {
    state = { citiesData: [], page: 0,searchInput:"" ,apiStatus: apiStatusConstant.initial}

    componentDidMount() {
        this.getCitiesData()
    }


    getCitiesData = async () => {
        this.setState({ apiStatus: apiStatusConstant.inProgress })
        const { page } = this.state
        const apiUrl = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=50&start=${page * 50}`

        const options = {
            method: "GET"
        }

        const response = await fetch(apiUrl, options)

        if (response.ok === true) {
            const data = await response.json()
            const updatedData = data.records.map(each => ({
                name: each.fields.name,
                cou_name_en: each.fields.cou_name_en,
                timezone: each.fields.timezone
            }))
            this.setState({ citiesData: updatedData, apiStatus: apiStatusConstant.success })
        }else {
            this.setState({ apiStatus: apiStatusConstant.failure })
        }
    }


    onChangeSearchInput = (event) => {
        this.setState({searchInput: event.target.value  })
    }


    rendercities = () => {
        const { citiesData,searchInput } = this.state

        const filteredList = citiesData.filter(each =>
            each.name.toLowerCase().includes(searchInput.toLowerCase()),
        )

        return (
            <AppContext.Consumer>
                {value => {
                    const { isDarkTheme } = value

                    const textColor = isDarkTheme ? "textDark" : "textLight"
                    const searchBgColor = isDarkTheme ? "searchBgDark" : "searchBgLight"

                    return (
                        <>
                            <div className={`search-container ${searchBgColor}`}>
                                <RiSearch2Line  className="searchIcon"/>
                                <input type="search" className="input" placeholder="Enter the city" onChange={this.onChangeSearchInput} />
                            </div>
                        
                        <div className="citiesBg-container"   >
                            <InfiniteScroll dataLength={citiesData.length} next={this.getCitiesData} hasMore={true}
                                loader={<h4 className="loading">Loading...</h4>} >
                                <div className="table-container">
                                    <p className={`dataName ${textColor}`}>City Name</p>
                                    <p className={`dataName ${textColor}`}>Country</p>
                                    <p className={`dataName ${textColor}`}>TimeZone</p>
                                </div>
                                {filteredList.length === 0 ? (
                                     <div className="no-products-view">
                                     <img
                                         src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
                                         className="no-products-img"
                                         alt="no city"
                                     />
                                     <p className="no-products-description">
                                     No City Found
                                     </p>
                                 </div>
                                ):(
                                    <>
                                    {filteredList.map(eachCity => (
                                        <Link to={`/weather/${eachCity.name}`} className="dataLink">
                                        <ul className="tableData">
                                            <li className={`data ${textColor}`}>{eachCity.name}</li>
                                            <li className={`data ${textColor}`}>{eachCity.cou_name_en}</li>
                                            <li className={`data ${textColor}`}>{eachCity.timezone}</li>
                                        </ul>
                                        </Link>
                                    ))}
                                    </>
                                )}
                            </InfiniteScroll>
                        </div>
                        </>
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
                className="no-jobs-image"
            />
            <h1 className="failureHeading">Oops! Something Went Wrong</h1>
            <p className="failureDescription">
                We cannot seem to find the page you are looking for
            </p>
            <button type="button" className="failureButton" onClick={this.getCitiesData}>
                Retry
            </button>
        </div>
    )

    renderCitiesTableView = () => {
        const { apiStatus } = this.state

        switch (apiStatus) {
            case apiStatusConstant.success:
                return this.rendercities();
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
                {value =>{
                    const {isDarkTheme} = value

                    const homeBgColor = isDarkTheme ? "homeBgDark" : "homeBgLight"

                    return(
                        <>
                        <Header />
                        <div className={`citiesContainer ${homeBgColor}`}>
                            {this.renderCitiesTableView()}
                        </div>
                    </>
                    )
                }}
            </AppContext.Consumer>
        )
    }
}

export default CitiesTable