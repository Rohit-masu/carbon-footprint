import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      city
      homeData {
        _id
        waterEmissions
        electricityEmissions
        heatEmissions
      }
      travelData {
        _id
        vehicleEmissions
        publicTransitEmissions
        planeEmissions
      }
      pledgeData {
        _id
        action
        description
        icon
        link
      }
    }
  }
`;

export const QUERY_PLEDGES = gql`
  query pledges {
    pledges {
      _id
      action
      description
      icon
      link
    }
  }
`;

// 🟢 Add these new queries
export const GET_AQI = gql`
  query getAQI($city: String!) {
    getAQI(city: $city) {
      aqi
      co
      no2
      pm2_5
      description
      city
    }
  }
`;

export const GET_EMISSION_SUMMARY = gql`
  query getCarbonSummary($city: String) {
    getCarbonSummary(city: $city) {
      totalEmissions
      homeEmissions
      travelEmissions
      comparisonToAverage
      suggestions
      aqi
      aqiStatus
      city
      lastUpdated
    }
  }
`;
export const GET_INDIA_COMPARISON = gql`
  query getIndiaComparison {
    getIndiaComparison {
      country
      emissions
      perCapita
      year
    }
  }
`;

export const GET_DELHI_HOUSEHOLD = gql`
  query getDelhiHouseholdData {
    getDelhiHouseholdData {
      averageHousehold
      transportation
      electricity
      cooking
      waste
      other
      year
    }
  }
`;

export const GET_INDIAN_FOOTPRINT = gql`
  query getIndianFootprintBreakdown {
    getIndianFootprintBreakdown {
      categories
      emissions
      percentages
    }
  }
`;