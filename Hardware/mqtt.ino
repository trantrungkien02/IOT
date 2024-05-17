#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN D4
#define DHTTYPE DHT11
#define LIGHT_SENSOR_PIN A0

DHT_Unified dht(DHTPIN, DHTTYPE);

const char *ssid = "Kim Hoang 5G";
const char *password = "88888888";
const char *mqtt_server = "192.168.0.102";
const char *mqtt_username = "kienok"; 
const char *mqtt_password = "kienok";
const char *mqtt_username2 = "kienkk"; 
const char *mqtt_password2 = "kienkk"; 
const char *topic = "datasensor";


WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastTime = 0;
float temperature, humidity, lightIntensity;

void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void callback(char *topic, byte *payload, unsigned int length) {

  
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  
    if ((char)payload[0] == 'o' && (char)payload[1] == 'f' && (char)payload[2] == 'f' && (char)payload[3] == 'f' && (char)payload[4] == 'a' && (char)payload[5] == 'n') {
      digitalWrite(D1, LOW);
      client.publish("device/led/status", "FAN OFF");
      Serial.println("FAN OFF");
    } else if ((char)payload[0] == 'o' && (char)payload[1] == 'n' && (char)payload[2] == 'f' && (char)payload[3] == 'a' && (char)payload[4] == 'n') {
      digitalWrite(D1, HIGH);
      client.publish("device/led/status", "FAN ON");
      Serial.println("FAN ON");
    } else if ((char)payload[0] == 'o' && (char)payload[1] == 'n' && (char)payload[2] == 'l' && (char)payload[3] == 'e' && (char)payload[4] == 'd') {
      digitalWrite(D2, HIGH);
      client.publish("device/led/status", "LED ON");
      Serial.println("LED ON");
    } else if ((char)payload[0] == 'o' && (char)payload[1] == 'f' && (char)payload[2] == 'f' && (char)payload[3] == 'l' && (char)payload[4] == 'e' && (char)payload[5] == 'd') {
      digitalWrite(D2, LOW);
      client.publish("device/led/status", "LED OFF");
      Serial.println("LED OFF");
    }
  }

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Connected");
      client.subscribe("device/led");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
void setup() {
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  dht.humidity().getSensor(&sensor);

  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1993);
  client.setCallback(callback);
  
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  
  unsigned long now = millis();
if (now - lastTime > 5000) {
  lastTime = now;

  // Read temperature
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    Serial.print(F("Temperature: "));
    Serial.print(event.temperature);
    Serial.print(F(" °C - "));
    temperature = event.temperature;
  }

  // Read humidity
  dht.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    Serial.print(F("Humidity: "));
    Serial.print(event.relative_humidity);
    Serial.print(F(" % - "));
    humidity = event.relative_humidity;
  }

  // Read light intensity
  int lightValue = analogRead(LIGHT_SENSOR_PIN);
  //light = map(lightValue, 0, 1023, 0, 100);  
  lightIntensity = 1024 - lightValue;

  Serial.print("Light: ");
  Serial.print((int)lightIntensity);
  Serial.println(F(" Lux"));


    // Publish data to MQTT
   String data =String(temperature) + " " + String(humidity) + " " + String((int)lightIntensity);
  char dataChar[data.length() + 1];
  data.toCharArray(dataChar, sizeof(dataChar));
  client.publish(topic, dataChar);

    delay(100);
  }
}