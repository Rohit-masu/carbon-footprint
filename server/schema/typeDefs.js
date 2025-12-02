const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Home {
    _id: ID
    waterEmissions: Float
    electricityEmissions: Float
    heatEmissions: Float
    createdAt: String
  }

  type Travel {
    _id: ID
    vehicleEmissions: Float
    publicTransitEmissions: Float
    planeEmissions: Float
    createdAt: String
  }

  type Pledge {
    _id: ID
    action: String
    description: String
    icon: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    city: String
    homeData: [Home]
    travelData: [Travel]
    pledgeData: [Pledge]
  }

  type CarbonSummary {
    totalEmissions: Float
    homeEmissions: Float
    travelEmissions: Float
    comparisonToAverage: String
    suggestions: [String]
    aqi: Int
    aqiStatus: String
    city: String
    lastUpdated: String
  }

  type AQI {
    aqi: Int
    co: Float
    no2: Float
    pm2_5: Float
    description: String
    city: String
  }

  type EmissionStats {
    date: String
    total: Float
    home: Float
    travel: Float
  }

  type Auth {
    token: ID!
    user: User
  }

  # 🔥 New types for chart data
  type DelhiEmissions {
    total: Float
    transportation: Float
    energy: Float
    industry: Float
    residential: Float
    date: String
  }

  type CountryComparison {
    country: String
    emissions: Float
    perCapita: Float
    year: Int
  }

  type DelhiHousehold {
    averageHousehold: Float
    transportation: Float
    electricity: Float
    cooking: Float
    waste: Float
    other: Float
    year: Int
  }

  type IndianFootprint {
    categories: [String]
    emissions: [Float]
    percentages: [Float]
  }

  # ✅ Merge all queries into one block
  type Query {
    me: User
    pledges: [Pledge]
    getCarbonSummary(city: String): CarbonSummary
    getAQI(city: String!): AQI
    getEmissionHistory(limit: Int): [EmissionStats]
    getLeaderboard: [User]
    getDelhiEmissions: DelhiEmissions
    getIndiaComparison: [CountryComparison]
    getDelhiHouseholdData: DelhiHousehold
    getIndianFootprintBreakdown: IndianFootprint
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth

    addTravel(
      vehicleEmissions: Float!
      publicTransitEmissions: Float!
      planeEmissions: Float!
    ): User

    addHome(
      waterEmissions: Float!
      electricityEmissions: Float!
      heatEmissions: Float!
    ): User

    addPledge(pledgeId: ID!): User
    removePledge(pledgeId: ID!): User

    updateCity(city: String!): User

    autoCalculateEmissions(
      carKm: Float
      busKm: Float
      flightHours: Float
      electricityKwh: Float
      waterLiters: Float
      heatUsage: Float
    ): User

    addTransportEntry(
      carKm: Float
      busKm: Float
      flightHours: Float
    ): User

    addHomeEnergyEntry(
      electricityKwh: Float
      waterLiters: Float
      heatUsage: Float
    ): User
  }
`;

module.exports = typeDefs;
