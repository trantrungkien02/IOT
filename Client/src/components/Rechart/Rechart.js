import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import convertDateTime from '../convertDateTime/convertDateTime';

const RealTimeLineChart = () => {
  const [chartData, setChartData] = useState(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('chartData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const maxPoints = 20; // Giới hạn số điểm hiển thị trên biểu đồ

  // Hàm để fetch dữ liệu từ API
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/dashboard?page=1&pageSize=1&orderBy=id_DESC`);
      const { temperature, humidity, light } = response.data[0]; // Lấy dữ liệu
      const newData = {
        timestamp: convertDateTime(new Date().toISOString()), // Sử dụng thời gian hiện tại làm trục x
        temperature,
        humidity,
        light,
      };

      setChartData(prevData => {
        const updatedData = [...prevData, newData];
        // Giữ tối đa maxPoints trên biểu đồ
        console.log(updatedData.length);
        if (updatedData.length > maxPoints) {
          // updatedData.splice(0, updatedData.length - maxPoints);
          updatedData.shift();
        }
        // Save updated data to localStorage
        localStorage.setItem('chartData', JSON.stringify(updatedData));
        return updatedData;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Gọi fetchData mỗi 5 giây
    const intervalId = setInterval(fetchData, 5000);
    fetchData(); // Lấy dữ liệu ngay lập tức khi component được mount

    return () => clearInterval(intervalId); // Cleanup khi component bị unmount
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <LineChart width={800} height={400} data={chartData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="timestamp" tickFormatter={tick => new Date(tick).toLocaleTimeString()} />
      <Tooltip />
      {/* Chú thích cho các cột */}
      <Legend
        formatter={value => {
          switch (value) {
            case 'temperature':
              return 'Temperature (°C)';
            case 'humidity':
              return 'Humidity (%)';
            case 'light':
              return 'Light (Lux)';
            default:
              return value;
          }
        }}
      />
      {/* Trục Y bên trái dùng cho nhiệt độ và độ ẩm */}
      <YAxis yAxisId="left" domain={[0, 100]} label={{ value: '°C or %', angle: 0, position: 'insideTop', dy: -30 }} />
      {/* Trục Y bên phải dùng cho ánh sáng */}
      <YAxis yAxisId="right" domain={[0, 1000]} orientation="right" />
      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#dd4f5e" name="Temperature (°C)" />
      <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#3a92ac" name="Humidity (%)" />
      <Line yAxisId="right" type="monotone" dataKey="light" stroke="#fdcd0f" name="Light (Lux)" />
    </LineChart>
  );
};

export default RealTimeLineChart;
