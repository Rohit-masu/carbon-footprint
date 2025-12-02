const { User, Pledge } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const fetch = require('node-fetch');
const axios = require('axios');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('homeData')
          .populate('travelData')
          .populate('pledgeData');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },

    pledges: async () => Pledge.find().select('-__v'),

    

    getCarbonSummary: async (parent, { city }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      const user = await User.findById(context.user._id);

      // --- 1️⃣ Calculate emissions ---
      const home = user.homeData[0] || {};
      const travel = user.travelData[0] || {};

      const totalEmissions =
        (home.waterEmissions || 0) +
        (home.electricityEmissions || 0) +
        (home.heatEmissions || 0) +
        (travel.vehicleEmissions || 0) +
        (travel.publicTransitEmissions || 0) +
        (travel.planeEmissions || 0);

      // --- 2️⃣ Compare to national average ---
      const avgFootprint = 1900;
      let comparisonToAverage =
        totalEmissions > avgFootprint
          ? 'above average'
          : totalEmissions < avgFootprint
          ? 'below average'
          : 'equal to the average';

      // --- 3️⃣ Suggestions ---
      const suggestions = [];
      if (travel.vehicleEmissions > 200)
        suggestions.push('Use public transport more often.');
      if (home.electricityEmissions > 300)
        suggestions.push('Switch to LED bulbs or solar power.');
      if (home.waterEmissions > 100)
        suggestions.push('Try reducing water wastage.');

      // --- 4️⃣ Real-time AQI using OpenAQ ---
      let aqi = null;
      let aqiStatus = 'N/A';
      try {
        const response = await fetch(
          `https://api.openaq.org/v2/latest?limit=1&city=${city || 'Delhi'}`
        );
        const data = await response.json();
        if (data?.results?.length > 0) {
          aqi = data.results[0].measurements[0].value;
          if (aqi <= 50) aqiStatus = 'Good';
          else if (aqi <= 100) aqiStatus = 'Moderate';
          else if (aqi <= 200) aqiStatus = 'Unhealthy';
          else aqiStatus = 'Hazardous';
        }
      } catch (err) {
        console.error('AQI fetch failed:', err.message);
      }
      

      return {
        totalEmissions,
        comparisonToAverage,
        suggestions,
        aqi,
        aqiStatus,
        city: city || 'Delhi',
        lastUpdated: new Date().toISOString(),
      };
      
    },

    // --- 🔥 New standalone AQI query ---
    getAQI: async (_, { city }) => {
      try {
        const API_KEY = process.env.AQI_API_KEY;
        const cities = {
          delhi: { lat: 28.6139, lon: 77.209 },
          mumbai: { lat: 19.076, lon: 72.8777 },
          kolkata: { lat: 22.5726, lon: 88.3639 },
          chennai: { lat: 13.0827, lon: 80.2707 },
        };

        const { lat, lon } = cities[city.toLowerCase()] || cities['delhi'];

        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const result = data.list[0];
        const aqi = result.main.aqi;
        const desc = ['Good 🌿', 'Fair 🙂', 'Moderate 😐', 'Poor 😷', 'Very Poor 💀'][aqi - 1];

        return {
          aqi,
          co: result.components.co,
          no2: result.components.no2,
          pm2_5: result.components.pm2_5,
          description: desc,
          city: city,
        };
      } catch (err) {
        console.error('Failed to fetch AQI:', err.message);
        throw new Error('Unable to fetch AQI data');
      }
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Incorrect credentials');
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError('Incorrect credentials');
      const token = signToken(user);
      return { token, user };
    },

    addTravel: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $set: { travelData: args } },
        { new: true }
      ).populate('travelData');
    },

    addHome: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $set: { homeData: args } },
        { new: true }
      ).populate('homeData');
    },

   addPledge: async (parent, { pledgeId }, context) => {
  if (!context.user) throw new AuthenticationError('Not logged in');
  return User.findByIdAndUpdate(
    context.user._id,
    { $addToSet: { pledgeData: pledgeId } },
    { new: true }
  ).populate('pledgeData'); // ✅ populate to return full pledge info
},

removePledge: async (parent, { pledgeId }, context) => {
  if (!context.user) throw new AuthenticationError('Not logged in');
  return User.findByIdAndUpdate(
    context.user._id,
    { $pull: { pledgeData: pledgeId } },
    { new: true }
  ).populate('pledgeData');
},
    updateCity: async (parent, { city }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return User.findByIdAndUpdate(context.user._id, { $set: { city } }, { new: true });
    },

    autoCalculateEmissions: async (
      parent,
      { carKm, busKm, flightHours, electricityKwh, waterLiters, heatUsage },
      context
    ) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      // emission factors
      const carFactor = 0.21;
      const busFactor = 0.105;
      const flightFactor = 90;
      const electricityFactor = 0.82;
      const waterFactor = 0.0003;
      const heatFactor = 2.5;

      const travelEmissions = {
        vehicleEmissions: Math.round(carKm * carFactor),
        publicTransitEmissions: Math.round(busKm * busFactor),
        planeEmissions: Math.round(flightHours * flightFactor),
      };

      const homeEmissions = {
        electricityEmissions: Math.round(electricityKwh * electricityFactor),
        waterEmissions: Math.round(waterLiters * waterFactor),
        heatEmissions: Math.round(heatUsage * heatFactor),
      };

      return User.findByIdAndUpdate(
        context.user._id,
        { $set: { travelData: travelEmissions, homeData: homeEmissions } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
