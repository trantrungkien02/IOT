import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
// import mqtt from 'mqtt';
import classNames from 'classnames/bind';
import styles from './Boarddust.module.scss';
import images from '../../components/ImageList/ImageList';
import Navigation from '../../components/Navigation/Navigation';
import RealTimeLineChart from '../../components/Rechart/Rechart';

const cx = classNames.bind(styles);

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// const mqttServer = 'mqtt://192.168.50.13'; // Địa chỉ của MQTT broker
// const mqttOptions = {
//   port: 1993,
//   username: 'kienok', // Tên người dùng MQTT
//   password: 'kienok', // Mật khẩu MQTT
// };
// const client = mqtt.connect(mqttServer, mqttOptions);

// client.on('connect', () => {
//   console.log('Connected to MQTT broker');
//   client.subscribe('datasensor'); // Đăng ký subscribe vào chủ đề 'datasensor'
// });
// client.on('message', (topic, message) => {
//   console.log('Received message from topic:', topic);
//   console.log('Message:', message.toString());
// });

// client.on('error', error => {
//   console.error('MQTT error:', error);
// });

// client.on('close', () => {
//   console.log('Disconnected from MQTT broker');
// });
function Board() {
  useEffect(() => {
    // Hàm để tạo dữ liệu ngẫu nhiên
    const generateRandomData = () => {
      return Array.from({ length: 5 }, (_, index) => ({
        name: `Item ${index + 1}`,
        temperature: getRandomValue(0, 45),
        humidity: getRandomValue(60, 90),
        light: getRandomValue(0, 110),
      }));
    };

    // Cập nhật dữ liệu ban đầu
    setData1(generateRandomData());

    // Thiết lập interval để cập nhật dữ liệu mỗi giây
    const intervalId = setInterval(() => {
      setData1(generateRandomData());
    }, 3000);

    // Cleanup interval khi component bị unmounted
    return () => clearInterval(intervalId);
  }, []);

  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);
  const [dust, setDust] = useState(0);
  const [isSpinning, setIsSpinning] = useState(null);
  const [isChecked, setIsChecked] = useState(null);
  const [isChecked1, setIsChecked1] = useState(null);
  const [isLightOn, setIsLightOn] = useState(null);
  const [client, setClient] = useState(null);
  const [data1, setData1] = useState([]);
  const [dustBackgroundClass, setDustBackgroundClass] = useState('');
  // const [hideBackground, setHideBackground] = useState(false);

  useEffect(() => {
    const savedIsSpinning = localStorage.getItem('isSpinning') === 'true';
    const savedIsChecked = localStorage.getItem('isChecked') === 'true';
    const savedIsChecked1 = localStorage.getItem('isChecked1') === 'true';
    const savedIsLightOn = localStorage.getItem('isLightOn') === 'true';

    setIsSpinning(savedIsSpinning);
    setIsChecked(savedIsChecked);
    setIsChecked1(savedIsChecked1);
    setIsLightOn(savedIsLightOn);
  }, []);

  // Save states to localStorage whenever they change
  useEffect(() => {
    if (isSpinning !== null) localStorage.setItem('isSpinning', isSpinning);
    if (isChecked !== null) localStorage.setItem('isChecked', isChecked);
    if (isChecked1 !== null) localStorage.setItem('isChecked1', isChecked1);
    if (isLightOn !== null) localStorage.setItem('isLightOn', isLightOn);
  }, [isSpinning, isChecked, isChecked1, isLightOn]);

  const handleCheckboxFan = () => {
    // Nếu đèn đang tắt (isLightOn là false), thực hiện cuộc gọi API trước khi bật đèn
    const action = isSpinning ? 'offfan' : 'onfan'; // Nếu đèn đang sáng thì tắt, nếu đèn đang tắt thì bật

    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/actionhistory/create', {
          deviceName: 'FAN',
          action, // Sử dụng hành động dựa trên trạng thái hiện tại
        });

        if (response.data.mqttMessage === 'FAN ON') {
          // Đợi 1 giây rồi mới thay đổi trạng thái của đèn
          setTimeout(() => {
            setIsSpinning(true);
            setIsChecked(true);
          }, 500);
        } else if (response.data.mqttMessage === 'FAN OFF') {
          setTimeout(() => {
            setIsSpinning(false);
            setIsChecked(false);
          }, 500);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Gọi hàm fetch để thực hiện yêu cầu POST
  };
  const handleCheckboxLight = () => {
    // Nếu đèn đang tắt (isLightOn là false), thực hiện cuộc gọi API trước khi bật đèn
    const action = isLightOn ? 'offled' : 'onled'; // Nếu đèn đang sáng thì tắt, nếu đèn đang tắt thì bật

    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/actionhistory/create', {
          deviceName: 'LED',
          action, // Sử dụng hành động dựa trên trạng thái hiện tại
        });

        if (response.data.mqttMessage === 'LED ON') {
          // Đợi 1 giây rồi mới thay đổi trạng thái của đèn
          setTimeout(() => {
            setIsLightOn(true);
            setIsChecked1(true);
          }, 500);
        } else if (response.data.mqttMessage === 'LED OFF') {
          setTimeout(() => {
            setIsLightOn(false);
            setIsChecked1(false);
          }, 500);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Gọi hàm fetch để thực hiện yêu cầu POST
  };
  const [datasensor, setDataSenSor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/dashboard?page=1&pageSize=1&orderBy=id_DESC`);
        setDataSenSor(response.data[0]);
        setTemperature(response.data[0].temperature);
        setHumidity(response.data[0].humidity);
        setLight(response.data[0].light);
        setDust(response.data[0].dust);
        setDustBackgroundClass(response.data[0].dust > 60 ? 'temperature-alarm' : '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // console.log(itemsPerPage, orderBy, columnNames);
    fetchData();
    // Thiết lập interval để cập nhật giá trị mỗi 5 giây

    console.log(temperature, humidity, light);

    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);
  console.log(dustBackgroundClass, temperature, humidity, light);
  const [temperatureColor, setTemperatureColor] = useState('');
  const [humidityColor, setHumidityColor] = useState('');
  const [lightColor, setLightColor] = useState('');
  const [dustColor, setDustColor] = useState('');

  useEffect(() => {
    const checkTemperatureAlarm = () => {
      if (temperature > 40) {
        setTemperatureColor('linear-gradient(to top right, #db7883, #c13746)');
      } else if (temperature >= 10 && temperature <= 30) {
        setTemperatureColor('linear-gradient(to top right, #dfa6ac, #dd4959)');
      } else {
        setTemperatureColor('linear-gradient(to top right, #ffe2e5, #dfa6ac)');
      }
    };

    const checkHumidityColor = () => {
      if (humidity < 70) {
        setHumidityColor('linear-gradient(to top right, #e2f8ff, #98cad9)');
      } else if (humidity >= 70 && humidity <= 80) {
        setHumidityColor('linear-gradient(to top right, #98cad9, #3790ab)');
      } else {
        setHumidityColor('linear-gradient(to top right, #89bccf, #3b7799)');
      }
    };

    const checkLightColor = () => {
      if (light < 40) {
        setLightColor('linear-gradient(to top right, #efebd8, #ebd474, #ffcc00)');
      } else if (light >= 40 && light <= 80) {
        setLightColor('linear-gradient(to top right, #ebd474, #ffcc00, #f79e2d)');
      } else {
        setLightColor('linear-gradient(to top right, #ffcc00, #ff6600)');
      }
    };
    const checkDustColor = () => {
      if (dust < 40) {
        setDustColor('linear-gradient(to top right, #d3d3d3, #b0b0b0, #808080)');
      } else if (dust >= 40 && dust <= 80) {
        setDustColor('linear-gradient(to top right, #b0b0b0, #808080, #505050)');
      } else {
        setDustColor('linear-gradient(to top right, #808080, #505050, #303030)');
      }
    };

    console.log('rerender');
    checkTemperatureAlarm();
    checkHumidityColor();
    checkLightColor();
    checkDustColor();
  }, [temperature, humidity, light, dust]);

  return (
    <div className={cx('bro')}>
      <Navigation />
      <div className={cx('board')}>
        <div className={cx('parameter')}>
          <div className={cx('parameter-child')} style={{ background: temperatureColor }}>
            <div className={cx('tem-content')}>
              <p className={cx('text-content')}>TEMPERATURE</p>
              <img src={images.temperatureicon} alt="" />
            </div>
            <p className={cx('text-content')}>{temperature} °C</p>
          </div>
          <div className={cx('parameter-child')} style={{ background: humidityColor }}>
            <div className={cx('hum-content')}>
              <p className={cx('text-content')}>HUMIDITY</p>
              <img src={images.humidityicon} alt="" />
            </div>
            <p className={cx('text-content')}>{humidity} %</p>
          </div>
          <div className={cx('parameter-child')} style={{ background: lightColor }}>
            <div className={cx('li-content')}>
              <p className={cx('text-content')}>LIGHT</p>
              <img src={images.sunicon} alt="" />
            </div>
            <p className={cx('text-content')}>{light} Lux</p>
          </div>
          <div className={cx('parameter-child', dustBackgroundClass)} style={{ background: dust <= 60 ? dustColor : '' }}>
            <div className={cx('li-content')}>
              <p className={cx('text-content')}>DUST</p>
              <img src={images.dust} alt="" />
            </div>
            <p className={cx('text-content')}>{dust} MG/M3</p>
          </div>
        </div>
        <div className={cx('display')}>
          <div className={cx('chart', 'chart-bg')}>
            <RealTimeLineChart />
          </div>
          <div className={cx('improve')}>
            <div className={cx('fan', 'humidity')}>
              {isSpinning === null ? (
                <div>Loading...</div>
              ) : (
                <>
                  <img src={images.fan} alt="" className={isSpinning ? cx('spin') : ''} onClick={handleCheckboxFan} />
                  <label className={cx('switch')} style={{ marginTop: '35px' }}>
                    <span className={cx('off-label', { 'bold-text': !isSpinning })}>OFF</span>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxFan} />
                    <span className={cx('slider', 'round')}></span>
                    <span className={cx('on-label', { 'bold-text': isSpinning })}>ON</span>
                  </label>
                </>
              )}
            </div>
            <div className={cx('lamp', 'sunny')}>
              {isLightOn === null ? (
                <div>Loading...</div>
              ) : (
                <>
                  {isLightOn ? (
                    <img className={cx('lighton')} src={images.lighton} alt="Light On" />
                  ) : (
                    <img className={cx('lightoff')} src={images.lightoff} alt="Light Off" />
                  )}
                  <label className={cx('switch')}>
                    <span className={cx('off-label', { 'bold-text': !isLightOn })}>NIGHT</span>
                    <input type="checkbox" checked={isChecked1} onChange={handleCheckboxLight} />
                    <span className={cx('slider1', 'round')}></span>
                    <span className={cx('on-label', { 'bold-text': isLightOn })}>DAY</span>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
