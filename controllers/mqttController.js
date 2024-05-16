/* eslint-disable no-undef */
const csvParser = require('csv-parser');
const db = require('../models');  // Impor model
const stream = require('stream');
const client = require('../services/mqttConfigs');  // Impor klien MQTT dari file konfigurasi

require('dotenv').config();


const climate_1 = db.climate_1;
const climate_2 = db.climate_2;



// Topic/DHT Eddystation1
client.on('message', async (topic, message) => {
    if (topic === process.env.TOPIC_1) {
        try {
            // Parse the message into a JSON object
            const jsonData = JSON.parse(message.toString());

            await climate_1.create({
                timestamp: jsonData.timestamp,
                temperature: jsonData.temperature,
                humidity: jsonData.humidity,
                rainfall: jsonData.rainfall,
                direction: jsonData.direction,
                angle: jsonData.angle,
                wind_speed: jsonData.wind_speed,
            });
      
        
                console.log(`Data ${process.env.TOPIC_1} inserted into the database!`);

        } catch (err) {
            console.error("Error processing data:", err);
        }
    }
});
client.on('message', async (topic, message) => {
     if (topic === process.env.TOPIC_2) {
        try {
            const jsonData = JSON.parse(message.toString());

            await climate_2.create({
                timestamp: jsonData.timestamp,
                hum_dht22: jsonData.hum_dht22,
                temp_dht22: jsonData.temp_dht22,
            });

            console.log(`Data ${process.env.TOPIC_2} inserted into the database!`);

        } catch (err) {
            console.error("Error processing data:", err);
        }
    }
});

