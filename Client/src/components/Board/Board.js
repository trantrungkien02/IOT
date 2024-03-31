import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import classNames from 'classnames/bind';
import styles from './Board.module.scss';
import fan from '../../images/fan2.png';
import lightoff from '../../images/offt.png';
import lighton from '../../images/ont.png';
import humidityicon from '../../images/humidity.png';
import temperatureicon from '../../images/tem.png';
import sunicon from '../../images/sun.png';
import Navigation from '../Navigation/Navigation';

const cx = classNames.bind(styles);

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Board() {
  // const data = [
  //   { name: 'Tháng 1', temperature: 20, humidity: 30, light: 200 },
  //   { name: 'Tháng 2', temperature: 22, humidity: 35, light: 180 },
  //   { name: 'Tháng 3', temperature: 25, humidity: 40, light: 250 },
  //   { name: 'Tháng 4', temperature: 28, humidity: 45, light: 220 },
  //   { name: 'Tháng 5', temperature: 30, humidity: 50, light: 300 },
  //   { name: 'Tháng 6', temperature: 32, humidity: 55, light: 280 },
  // ];

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
  const [isSpinning, setIsSpinning] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [data1, setData1] = useState([]);
  // const [hideBackground, setHideBackground] = useState(false);
  const handleCheckboxFan = () => {
    setIsSpinning((prevSpinning) => !prevSpinning);
    setIsChecked((prevChecked) => !prevChecked);
  };
  const handleCheckboxLight = () => {
    setIsLightOn((prevLightOn) => !prevLightOn);
    setIsChecked1((prevChecked1) => !prevChecked1);
  };

  useEffect(() => {
    // Cập nhật giá trị ngẫu nhiên khi component được render lần đầu tiên
    setTemperature(getRandomValue(0, 45));
    setHumidity(getRandomValue(60, 90));
    setLight(getRandomValue(0, 110));

    // Thiết lập interval để cập nhật giá trị mỗi 5 giây
    const intervalId = setInterval(() => {
      setTemperature(getRandomValue(0, 45));
      setHumidity(getRandomValue(60, 90));
      setLight(getRandomValue(0, 110));
    }, 3000);

    // Cleanup interval khi component bị unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const boardElement = document.querySelector(`.${cx('board')}`);
    const temperatureElement = document.querySelector(`.${cx('temperature')}`);
    const lightElement = document.querySelector(`.${cx('sunny')}`);
    const humidityElement = document.querySelector(`.${cx('humidity')}`);
    const chartElement = document.querySelector(`.${cx('chart')}`);
    const fanElement = document.querySelector(`.${cx('fan')}`);
    const lampElement = document.querySelector(`.${cx('lamp')}`);
    console.log(temperatureElement);
    console.log(humidityElement);
    console.log(lightElement);
    const checkTemperatureAlarm = () => {
      if (temperature > 40) {
        boardElement.classList.add(cx('temperature-alarm'));
        // temperatureElement.classList.remove(cx('temperature'));
        // humidityElement.classList.remove(cx('humidity'));
        // lightElement.classList.remove(cx('sunny'));
        chartElement.classList.remove(cx('chart-bg'));
        fanElement.classList.remove(cx('humidity'));
        lampElement.classList.remove(cx('sunny'));
      } else {
        boardElement.classList.remove(cx('temperature-alarm'));
        // temperatureElement.classList.add(cx('temperature'));
        // humidityElement.classList.add(cx('humidity'));
        // lightElement.classList.add(cx('sunny'));
        chartElement.classList.add(cx('chart-bg'));
        fanElement.classList.add(cx('humidity'));
        lampElement.classList.add(cx('sunny'));
      }
    };

    const setTemperatureColor = () => {
      if (temperature < 10) {
        temperatureElement.style.background = 'linear-gradient(to top right, #ffe2e5, #dfa6ac)';
      } else if (temperature >= 10 && temperature <= 30) {
        temperatureElement.style.background = 'linear-gradient(to top right, #dfa6ac, #dd4959)'; // Màu đậm hơn
      } else {
        temperatureElement.style.background = 'linear-gradient(to top right, #db7883, #c13746)'; // Màu đậm chết
      }
    };

    const setHumidityColor = () => {
      if (humidity < 70) {
        humidityElement.style.background = 'linear-gradient(to top right, #e2f8ff, #98cad9)';
      } else if (humidity >= 70 && humidity <= 80) {
        humidityElement.style.background = 'linear-gradient(to top right, #98cad9, #3790ab)'; // Màu đậm hơn
      } else {
        humidityElement.style.background = 'linear-gradient(to top right, #89bccf, #3b7799)'; // Màu đậm chết
      }
    };

    const setLightColor = () => {
      if (light < 40) {
        lightElement.style.background = 'linear-gradient(to top right, #efebd8, #ebd474, #ffcc00)';
      } else if (light >= 40 && light <= 80) {
        lightElement.style.background = 'linear-gradient(to top right, #ebd474, #ffcc00, #f79e2d)'; // Màu đậm hơn
      } else {
        lightElement.style.background = 'linear-gradient(to top right, #ffcc00, #ff6600)';
      }
    };
    checkTemperatureAlarm();
    setTemperatureColor();
    setHumidityColor();
    setLightColor();
  }, [temperature, humidity, light]); // Dependency trống, chỉ chạy một lần sau khi component được mount

  return (
    <div className={cx('bro')}>
      <Navigation />
      <div className={cx('board')}>
        <div className={cx('parameter')}>
          <div className={cx('temperature', 'parameter-child')}>
            <div className={cx('tem-content')}>
              <p className={cx('text-content')}>TEMPERATURE</p>
              <img src={temperatureicon} alt="" />
            </div>
            <p className={cx('text-content')}>{temperature} °C</p>
          </div>
          <div className={cx('humidity', 'parameter-child')}>
            <div className={cx('hum-content')}>
              <p className={cx('text-content')}>HUMIDITY</p>
              <img src={humidityicon} alt="" />
            </div>
            <p className={cx('text-content')}>{humidity} %</p>
          </div>
          <div className={cx('sunny', 'parameter-child')}>
            <div className={cx('li-content')}>
              <p className={cx('text-content')}>LIGHT</p>
              <img src={sunicon} alt="" />
            </div>
            <p className={cx('text-content')}>{light} Lux</p>
          </div>
        </div>
        <div className={cx('display')}>
          <div className={cx('chart', 'chart-bg')}>
            <BarChart width={800} height={400} data={data1}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="temperature" fill="#FF5733" name="TEMPERATURE" />
              <Bar dataKey="humidity" fill="#33A0FF" name="HUMIDITY" />
              <Bar dataKey="light" fill="#FFD700" name="LIGHT" />
            </BarChart>
          </div>
          <div className={cx('improve')}>
            <div className={cx('fan', 'humidity')}>
              <img
                src={fan}
                alt=""
                className={isSpinning ? cx('spin') : ''}
                onClick={() => setIsSpinning(!isSpinning)}
              />
              <label className={cx('switch')} style={{ marginTop: '35px' }}>
                <span className={cx('off-label', { 'bold-text': !isSpinning })}>OFF</span>
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxFan} />
                <span className={cx('slider', 'round')}></span>
                <span className={cx('on-label', { 'bold-text': isSpinning })}>ON</span>
              </label>
            </div>
            <div className={cx('lamp', 'sunny')}>
              {isLightOn ? (
                <img className={cx('lighton')} src={lighton} alt="Light On" />
              ) : (
                <img className={cx('lightoff')} src={lightoff} alt="Light Off" />
              )}
              <label className={cx('switch')}>
                <span className={cx('off-label', { 'bold-text': !isLightOn })}>NIGHT</span>
                <input type="checkbox" checked={isChecked1} onChange={handleCheckboxLight} />
                <span className={cx('slider1', 'round')}></span>
                <span className={cx('on-label', { 'bold-text': isLightOn })}>DAY</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
