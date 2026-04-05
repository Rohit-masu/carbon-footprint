import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './assets/css/calculator.css';

import Select from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem, Slider } from '@mui/material';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRAVEL, ADD_HOME } from '../utils/mutations';
import { QUERY_ME, GET_AQI } from '../utils/queries';
import { Box } from '@mui/system';
import Auth from '../utils/auth';

// ─────────────────────────────────────────────────────────────────────────────
// INDIA-SPECIFIC EMISSION FACTORS (kg CO₂ per unit)
// Sources:
//  • Grid electricity : CEA India 2023 → 0.82 kg CO₂/kWh
//  • Car (hatchback)  : ~0.12  kg CO₂/km  (petrol, eg. Swift)
//  • Car (sedan)      : ~0.145 kg CO₂/km  (petrol, eg. City)
//  • Car (SUV/MUV)    : ~0.19  kg CO₂/km  (petrol, eg. Innova)
//  • CNG car/auto     : ~0.07  kg CO₂/km
//  • Electric car     : ~0.082 kg CO₂/km  (India grid)
//  • Petrol 2-wheeler : ~0.058 kg CO₂/km
//  • Electric scooter : ~0.025 kg CO₂/km  (India grid)
//  • City bus         : ~0.045 kg CO₂/km/passenger
//  • Metro/local train: ~0.031 kg CO₂/km/passenger
//  • Auto-rickshaw    : ~0.065 kg CO₂/km
//  • Domestic flight  : ~0.133 kg CO₂/km/passenger
//  • LPG (14.2 kg)    : ~11.5  kg CO₂/cylinder
//  • PNG              : ~2.2   kg CO₂/m³
//  • Biomass/chulha   : ~0.5   kg CO₂/meal
// ─────────────────────────────────────────────────────────────────────────────

const EF = {
  car: { Hatchback: 0.12, Sedan: 0.145, SUV_MUV: 0.19, CNG: 0.07, Electric: 0.082 },
  twoWheeler: { Petrol: 0.058, Electric: 0.025 },
  bus: 0.045,
  metro: 0.031,
  auto: 0.065,
  plane: 0.133,
  electricity: 0.82,
  lpg: 11.5,
  png: 2.2,
  biomealKg: 0.5,
};

const Calculator = () => {
  const [formState, setFormState] = useState({
    carType: 'Hatchback',
    carKm: 500,
    twoWheelerType: 'Petrol',
    twoWheelerKm: 300,
    busKm: 100,
    metroKm: 50,
    autoKm: 30,
    planeKm: 0,
    showersPerWeek: 7,
    showerMinutes: 10,
    flushesPerDay: 4,
    laundryPerMonth: 8,
    cookingFuel: 'LPG',
    lpgCylinders: 1,
    pngM3: 10,
    acHours: 6,
    acMonths: 6,
    fridgeCount: 1,
    tvHours: 3,
    laptopHours: 4,
    geyserHours: 1,
    geyserMonths: 4,
  });

  const navigate = useNavigate();

  const { data: aqiData } = useQuery(GET_AQI, {
    variables: { city: 'Delhi' },
    skip: !Auth.loggedIn(),
  });
  const aqiInfo = aqiData?.getAQI || {};

  const [addTravel] = useMutation(ADD_TRAVEL, {
    update(cache) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({ query: QUERY_ME, data: { me: { ...me, travelData: [...me.travelData] } } });
      } catch (e) { console.warn(e); }
    },
  });

  const [addHome] = useMutation(ADD_HOME, {
    update(cache) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({ query: QUERY_ME, data: { me: { ...me, homeData: [...me.homeData] } } });
      } catch (e) { console.warn(e); }
    },
  });

  const calculateFootprint = async () => {
    const {
      carType, carKm, twoWheelerType, twoWheelerKm,
      busKm, metroKm, autoKm, planeKm,
      showersPerWeek, showerMinutes, flushesPerDay, laundryPerMonth,
      cookingFuel, lpgCylinders, pngM3,
      acHours, acMonths, fridgeCount, tvHours, laptopHours,
      geyserHours, geyserMonths,
    } = formState;

    // ── TRAVEL ──────────────────────────────────────────────────
    const vehicleEmissions = Math.round(
      carKm * (EF.car[carType] || 0.12) +
      twoWheelerKm * (EF.twoWheeler[twoWheelerType] || 0.058)
    );
    const publicTransitEmissions = Math.round(
      busKm * EF.bus + metroKm * EF.metro + autoKm * EF.auto
    );
    const planeEmissions = Math.round(planeKm * EF.plane);

    // ── WATER ───────────────────────────────────────────────────
    // 7 L/min shower, 0.0003 kg CO2/L; 9 L/flush, 0.0002 kg CO2/L; 60 L/load
    const waterEmissions = Math.round(
      showerMinutes * 7 * 0.0003 * showersPerWeek * 4 +
      9 * 0.0002 * flushesPerDay * 30 +
      60 * 0.0003 * laundryPerMonth
    );

    // ── ELECTRICITY (kWh × 0.82) ─────────────────────────────────
    const acKwh      = 1.5 * acHours * (acMonths * 30);
    const fridgeKwh  = 1.2 * fridgeCount * 30;          // 150W effective
    const tvKwh      = 0.1 * tvHours * 30;              // 100W avg TV
    const laptopKwh  = 0.045 * laptopHours * 30;        // 45W
    const geyserKwh  = 2 * geyserHours * (geyserMonths * 30); // 2kW geyser
    const electricityEmissions = Math.round(
      (acKwh + fridgeKwh + tvKwh + laptopKwh + geyserKwh) * EF.electricity
    );

    // ── COOKING / HEAT ────────────────────────────────────────────
    let heatEmissions = 0;
    if (cookingFuel === 'LPG')      heatEmissions = Math.round(lpgCylinders * EF.lpg);
    else if (cookingFuel === 'PNG') heatEmissions = Math.round(pngM3 * EF.png);
    else if (cookingFuel === 'Electric') heatEmissions = Math.round(0.5 * 3 * 30 * EF.electricity);
    else if (cookingFuel === 'Biomass')  heatEmissions = Math.round(EF.biomealKg * 3 * 30);

    try {
      await addTravel({ variables: { vehicleEmissions, publicTransitEmissions, planeEmissions } });
      await addHome({ variables: { waterEmissions, electricityEmissions, heatEmissions } });
      navigate('/myfootprint');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => { e.preventDefault(); calculateFootprint(); };

  const sx = (color = 'green') => ({
    color,
    margin: '40px 0 15px 0',
    '& .MuiSlider-valueLabel': { borderRadius: '15px', backgroundColor: color },
    '& .MuiSlider-rail': { padding: '5px' },
  });

  const aqiColor = [null,'#009966','#ffde33','#ff9933','#cc0033','#660099'];

  return (
    <div>
      {Auth.loggedIn() ? (
        <main className="calculator-main">
          <h1>Carbon Footprint Calculator</h1>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '0.5rem' }}>
            🇮🇳 India-calibrated · CEA 2023 grid factor (0.82 kg CO₂/kWh) · distances in <strong>kilometres</strong>
          </p>

          {aqiInfo.aqi && (
            <div className="aqi-card" style={{
              margin: '1rem auto', padding: '1rem', borderRadius: '12px', width: 'fit-content',
              backgroundColor: aqiColor[aqiInfo.aqi] || '#7e0023', color: '#fff',
            }}>
              <h2>Air Quality — {aqiInfo.city}</h2>
              <p>AQI: {aqiInfo.aqi} — {aqiInfo.description}</p>
              <p>PM2.5: {aqiInfo.pm2_5} μg/m³ | NO₂: {aqiInfo.no2} μg/m³ | CO: {aqiInfo.co} μg/m³</p>
            </div>
          )}

          <div className="text">
            <div className="description">
              <div className="calc-h3">Fill out your travel and home info, then click Find My Footprint.</div>
              <p>Defaults reflect a typical urban Indian adult. All distances in kilometres.</p>
            </div>
          </div>

          <section className="slider-sections">
            <form onSubmit={handleSubmit}>
              <div className="calculator">

                {/* ── TRAVEL ─────────────────────────────── */}
                <div className="travel">
                  <h2>🚗 My Travel</h2>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel>Car Type</InputLabel>
                    <Select name="carType" value={formState.carType} onChange={handleChange}
                      sx={{ color: '#243b4a', margin: '0 0 15px 0' }}>
                      <MenuItem value="Hatchback">Hatchback (Swift, i10…)</MenuItem>
                      <MenuItem value="Sedan">Sedan (City, Dzire…)</MenuItem>
                      <MenuItem value="SUV_MUV">SUV / MUV (Creta, Innova…)</MenuItem>
                      <MenuItem value="CNG">CNG Car</MenuItem>
                      <MenuItem value="Electric">Electric Vehicle</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Car km Per Month</label>
                    <Slider sx={sx('green')} name="carKm" value={formState.carKm}
                      onChange={handleChange} valueLabelDisplay="on" step={100} min={0} max={3000} marks />
                  </Box>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel>Two-Wheeler Type</InputLabel>
                    <Select name="twoWheelerType" value={formState.twoWheelerType} onChange={handleChange}
                      sx={{ color: '#243b4a', margin: '0 0 15px 0' }}>
                      <MenuItem value="Petrol">Petrol Bike / Scooter</MenuItem>
                      <MenuItem value="Electric">Electric Scooter</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Two-Wheeler km Per Month</label>
                    <Slider sx={sx('#2C82B3')} name="twoWheelerKm" value={formState.twoWheelerKm}
                      onChange={handleChange} valueLabelDisplay="on" step={50} min={0} max={2000} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>City Bus km Per Month</label>
                    <Slider sx={sx('green')} name="busKm" value={formState.busKm}
                      onChange={handleChange} valueLabelDisplay="on" step={25} min={0} max={500} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Metro / Local Train km Per Month</label>
                    <Slider sx={sx('#2C82B3')} name="metroKm" value={formState.metroKm}
                      onChange={handleChange} valueLabelDisplay="on" step={10} min={0} max={300} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Auto-Rickshaw km Per Month</label>
                    <Slider sx={sx('green')} name="autoKm" value={formState.autoKm}
                      onChange={handleChange} valueLabelDisplay="on" step={10} min={0} max={200} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Domestic Flight km Per Month</label>
                    <Slider sx={sx('#2C82B3')} name="planeKm" value={formState.planeKm}
                      onChange={handleChange} valueLabelDisplay="on" step={100} min={0} max={5000} marks />
                  </Box>
                </div>

                {/* ── HOME — WATER & COOKING ─────────────── */}
                <div className="home1">
                  <h2>🚿 Water</h2>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Showers Per Week</label>
                    <Slider sx={sx('green')} name="showersPerWeek" value={formState.showersPerWeek}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={14} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Minutes Per Shower</label>
                    <Slider sx={sx('#2C82B3')} name="showerMinutes" value={formState.showerMinutes}
                      onChange={handleChange} valueLabelDisplay="on" step={2} min={2} max={30} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Toilet Flushes Per Day</label>
                    <Slider sx={sx('green')} name="flushesPerDay" value={formState.flushesPerDay}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={10} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Loads of Laundry Per Month</label>
                    <Slider sx={sx('#2C82B3')} name="laundryPerMonth" value={formState.laundryPerMonth}
                      onChange={handleChange} valueLabelDisplay="on" step={2} min={0} max={30} marks />
                  </Box>

                  <h2 style={{ marginTop: '1.5rem' }}>🍳 Cooking</h2>

                  <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel>Cooking Fuel</InputLabel>
                    <Select name="cookingFuel" value={formState.cookingFuel} onChange={handleChange}
                      sx={{ color: '#243b4a', margin: '0 0 15px 0' }}>
                      <MenuItem value="LPG">LPG Cylinder</MenuItem>
                      <MenuItem value="PNG">Piped Natural Gas (PNG)</MenuItem>
                      <MenuItem value="Electric">Electric / Induction</MenuItem>
                      <MenuItem value="Biomass">Biomass / Chulha</MenuItem>
                    </Select>
                  </FormControl>

                  {formState.cookingFuel === 'LPG' && (
                    <Box sx={{ m: 1, width: 300 }}>
                      <label>LPG Cylinders Per Month</label>
                      <Slider sx={sx('green')} name="lpgCylinders" value={formState.lpgCylinders}
                        onChange={handleChange} valueLabelDisplay="on" step={0.25} min={0} max={3} marks />
                    </Box>
                  )}
                  {formState.cookingFuel === 'PNG' && (
                    <Box sx={{ m: 1, width: 300 }}>
                      <label>PNG Usage (m³ Per Month)</label>
                      <Slider sx={sx('#2C82B3')} name="pngM3" value={formState.pngM3}
                        onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={30} marks />
                    </Box>
                  )}
                </div>

                {/* ── HOME — ELECTRICITY ─────────────────── */}
                <div className="home2">
                  <h2>⚡ Electricity</h2>
                  <p style={{ fontSize: '0.8rem', color: '#555', marginTop: 0 }}>
                    India grid: 0.82 kg CO₂/kWh (CEA 2023)
                  </p>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>AC Hours Per Day (when running)</label>
                    <Slider sx={sx('green')} name="acHours" value={formState.acHours}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={16} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Months Per Year You Use AC</label>
                    <Slider sx={sx('#2C82B3')} name="acMonths" value={formState.acMonths}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={12} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Number of Fridges / Refrigerators</label>
                    <Slider sx={sx('green')} name="fridgeCount" value={formState.fridgeCount}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={3} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Hours of TV Per Day</label>
                    <Slider sx={sx('#2C82B3')} name="tvHours" value={formState.tvHours}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={12} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Hours of Laptop / PC Per Day</label>
                    <Slider sx={sx('green')} name="laptopHours" value={formState.laptopHours}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={16} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Geyser Hours Per Day (when used)</label>
                    <Slider sx={sx('#2C82B3')} name="geyserHours" value={formState.geyserHours}
                      onChange={handleChange} valueLabelDisplay="on" step={0.5} min={0} max={4} marks />
                  </Box>

                  <Box sx={{ m: 1, width: 300 }}>
                    <label>Months Per Year You Use Geyser</label>
                    <Slider sx={sx('green')} name="geyserMonths" value={formState.geyserMonths}
                      onChange={handleChange} valueLabelDisplay="on" step={1} min={0} max={12} marks />
                  </Box>
                </div>
              </div>

              <div className="calculator-btn">
                <button type="submit">Find My Footprint</button>
              </div>
            </form>
          </section>
        </main>
      ) : (
        <div className="not-logged-in">
          <h2 className="no-info-title">Log in to use our carbon footprint calculator!</h2>
          <Link to="/login"><button type="submit">Log In</button></Link>
        </div>
      )}
    </div>
  );
};

export default Calculator;
