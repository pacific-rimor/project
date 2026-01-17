// server.js - Main Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import simulated data module
const { generateData, updateData, applyScenario, getDashboardData } = require('./data/simulated-data');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve subdomain pages
app.get('/mobility', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mobility.html'));
});

app.get('/environment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'environment.html'));
});

app.get('/health', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'health.html'));
});

app.get('/agriculture', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agriculture.html'));
});

// API Endpoints
app.get('/api/dashboard', (req, res) => {
    res.json(getDashboardData());
});

app.get('/api/traffic', (req, res) => {
    const data = generateData();
    res.json({
        timestamp: new Date().toISOString(),
        vehicleDensity: data.traffic.vehicleDensity,
        congestionLevel: data.traffic.congestionLevel,
        trafficFlow: data.traffic.trafficFlow,
        publicTransportUsage: data.traffic.publicTransportUsage,
        accidentsToday: data.traffic.accidentsToday,
        averageSpeed: data.traffic.averageSpeed
    });
});

app.get('/api/environment', (req, res) => {
    const data = generateData();
    res.json({
        timestamp: new Date().toISOString(),
        airQualityIndex: data.environment.airQualityIndex,
        temperature: data.environment.temperature,
        humidity: data.environment.humidity,
        energyConsumption: data.environment.energyConsumption,
        renewableEnergyPercentage: data.environment.renewableEnergyPercentage,
        co2Levels: data.environment.co2Levels,
        rainfall: data.environment.rainfall
    });
});

app.get('/api/health', (req, res) => {
    const data = generateData();
    res.json({
        timestamp: new Date().toISOString(),
        pollutionRiskLevel: data.health.pollutionRiskLevel,
        hospitalLoad: data.health.hospitalLoad,
        respiratoryCases: data.health.respiratoryCases,
        publicHealthIndex: data.health.publicHealthIndex,
        vaccinationRate: data.health.vaccinationRate,
        averageLifeExpectancy: data.health.averageLifeExpectancy
    });
});

app.get('/api/agriculture', (req, res) => {
    const data = generateData();
    res.json({
        timestamp: new Date().toISOString(),
        cropYieldIndex: data.agriculture.cropYieldIndex,
        foodSupplyStability: data.agriculture.foodSupplyStability,
        waterUsageEfficiency: data.agriculture.waterUsageEfficiency,
        smartIrrigationCoverage: data.agriculture.smartIrrigationCoverage,
        localFoodProduction: data.agriculture.localFoodProduction,
        foodWastePercentage: data.agriculture.foodWastePercentage
    });
});

app.post('/api/scenario', (req, res) => {
    const { trafficIncrease, rainfallDecrease, energyIncrease } = req.body;
    
    if (trafficIncrease === undefined || rainfallDecrease === undefined || energyIncrease === undefined) {
        return res.status(400).json({ error: 'Missing scenario parameters' });
    }
    
    const result = applyScenario(trafficIncrease, rainfallDecrease, energyIncrease);
    res.json(result);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Smart City Dashboard running at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/`);
    console.log(`🚗 Mobility: http://localhost:${PORT}/mobility`);
    console.log(`🌿 Environment: http://localhost:${PORT}/environment`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`🌾 Agriculture: http://localhost:${PORT}/agriculture`);
});

// Start simulated data updates
setInterval(updateData, 5000); // Update every 5 seconds