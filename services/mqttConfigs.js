/* eslint-disable no-undef */
const mqtt = require('mqtt');
require('dotenv').config();

const options = {
    username: process.env.USERNAMEMQTT,
    password: process.env.PASSWORDMQTT 
};

const client = mqtt.connect(process.env.LINKMQTT, options);

client.on('connect', () => {

    // Langganan ke topic/dht Eddy station 1
    client.subscribe(process.env.TOPIC_1, (err) => {
        if (err) {
            console.error(`Error subscribing to ${process.env.TOPIC_1} :`, err);
        } else {
            console.log("1. MQTT terhubung pada:", process.env.TOPIC_1);  // <-- Menampilkan topik di terminal
        }
    });
});

    client.on('connect', () => {
    client.subscribe(process.env.TOPIC_2, (err) => {
        if (err) {
            console.error(`Error subscribing to ${process.env.TOPIC_2} :`, err);
        } else {
            console.log("2. MQTT terhubung pada:", process.env.TOPIC_2);  // <-- Menampilkan topik di terminal
        }
    });
});

module.exports = client;
