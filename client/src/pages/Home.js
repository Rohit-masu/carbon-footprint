import React, { useEffect, useState } from 'react';
import './assets/css/home.css';
import { Link } from 'react-router-dom';
import MeanCountry from './assets/js/meanCountry';
import MeanIndividual from './assets/js/meanIndividual';
import MeanCountryAnnual from './assets/js/meanCountryAnnual';
import MeanHousehold from './assets/js/meanHousehold';
import Auth from '../utils/auth';

const Home = () => {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAQI = async () => {
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              getAQI(city: "Delhi") {
                aqi
                co
                no2
                pm2_5
                description
                city
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.data && result.data.getAQI) {
        setAqiData(result.data.getAQI);
      }
    } catch (error) {
      console.error('Error fetching AQI:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAQI();
    const interval = setInterval(fetchAQI, 600000); // auto-refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  // AQI color coding
  const getAqiColor = (aqi) => {
  switch (aqi) {
    case 1:
      return '#009966'; // Good
    case 2:
      return '#ffde33'; // Fair
    case 3:
      return '#ff9933'; // Moderate
    case 4:
      return '#cc0033'; // Poor
    case 5:
      return '#660099'; // Very Poor
    default:
      return '#7e0023'; // Hazardous / Unknown
  }
};


  return (
    <main className="home-main">
      <div>
        <section className="home-header">
          <div className="home-title">
            <h1>
              Hari<span>Path</span>
            </h1>
          </div>
        </section>

        <div className="home-tagline">
          <h2>
            Find your carbon <span>footprint</span>.
          </h2>
        </div>

        {/* 🔴 AQI Card Section */}
        <section className="aqi-section">
          {loading ? (
            <div className="aqi-card loading">Fetching Delhi AQI...</div>
          ) : aqiData ? (
            <div
              className="aqi-card"
              style={{
                backgroundColor: getAqiColor(aqiData.aqi),
                color: 'white',
              }}
            >
              <h3>Air Quality - {aqiData.city}</h3>
              <p style={{ fontSize: '1.2rem' }}>AQI: {aqiData.aqi}</p>
              <p>{aqiData.description}</p>
              <div className="aqi-details">
                <small>PM2.5: {aqiData.pm2_5} μg/m³</small> |{' '}
                <small>NO₂: {aqiData.no2} μg/m³</small> |{' '}
                <small>CO: {aqiData.co} μg/m³</small>
              </div>
            </div>
          ) : (
            <div className="aqi-card error">Failed to fetch AQI data 😞</div>
          )}
        </section>

        {Auth.loggedIn() ? (
          <section className="login-btn">
            <Link to="/calculator">
              <button type="submit">Calculate Your Footprint!</button>
            </Link>
          </section>
        ) : (
          <section className="login-btn">
            <Link to="/login">
              <button type="submit">Calculate Your Footprint!</button>
            </Link>
          </section>
        )}

        {/* Existing text content */}
        <div className="intro-text">
          <div className="home-p">
            <div className="home-h3">What is a carbon footprint?</div>
            <p>
              Your carbon footprint is a measurement of your contribution to
              carbon emissions and climate change. Our everyday activities
              produce carbon dioxide and methane through direct causes, like
              driving a gas-powered car, or indirect causes, like using
              electricity in your home. Everyone’s carbon emissions add up and
              cause global climate change.
            </p>
            <br />
            <div className="home-h3">What can you do about it?</div>
            <p>
              Small changes add up to a huge global impact. Change starts with
              knowing your own carbon footprint and then changing what you can
              to reduce it.
            </p>
            <p className="home-p2">
              <strong>Calculate</strong> your footprint.{' '}
              <strong>Make a pledge</strong> to change. <strong>Do it</strong>.
              Mark your pledge <strong>complete</strong>.
            </p>
            <div className="home-footer">
              If you want to say thank you for this free service, donate to the
              organizations who are driving real systemic progress in the fight
              against climate change.
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="subtitle">
        <h2>Does your carbon footprint beat global averages?</h2>
      </div>

      <section className="chart-data">
        <div className="chart">
          <h2>Annual Carbon Emissions - Metric Tons</h2>
          <br />
          <h4>
            Global annual carbon emissions from 2020: 34,807,259,099 metric tons
          </h4>
          <br />
          <a
            href="https://ourworldindata.org/co2/"
            rel="noreferrer"
            target="_blank"
          >
            <MeanCountryAnnual />
          </a>
        </div>

        <div className="chart">
          <h2>Annual Per Capita Carbon Emissions - Metric Tons</h2>
          <br />
          <h4>
            Global annual per capita carbon emissions from 2020: 4.47 metric
            tons
          </h4>
          <br />
          <a
            href="https://ourworldindata.org/co2/"
            rel="noreferrer"
            target="_blank"
          >
            <MeanCountry />
          </a>
        </div>

        <div className="chart">
          <h2>
            Per-Household Annual Carbon Emissions in New Delhi - Metric Tons
          </h2>
          <br />
          <a
            href="https://www.zerofy.net/2022/04/04/household-co2-emissions.html"
            rel="noreferrer"
            target="_blank"
          >
            <MeanHousehold />
          </a>
        </div>

        <div className="chart">
          <h2>Breakdown of the Average Indian's Carbon Footprint</h2>
          <br />
          <a
            href="https://suncommon.com/understanding-your-carbon-footprint/"
            rel="noreferrer"
            target="_blank"
          >
            <MeanIndividual />
          </a>
        </div>
      </section>

      <br />
    </main>
  );
};

export default Home;
