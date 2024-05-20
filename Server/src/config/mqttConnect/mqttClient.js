const mqtt = require('mqtt');

const mqttServer = 'mqtt://192.168.0.100';
const mqttOptions = {
  port: 1993,
  username: 'kienok',
  password: 'kienok',
};
const client = mqtt.connect(mqttServer, mqttOptions);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('datasensor');
});

client.on('message', (topic, message) => {
  console.log('Received message from topic:', topic);
  console.log('Message:', message.toString());
});

client.on('error', error => {
  console.error('MQTT error:', error);
});

client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

module.exports = client;
