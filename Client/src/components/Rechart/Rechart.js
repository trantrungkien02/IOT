import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const RealTimeLineChart = () => {
  const [chartData, setChartData] = useState([]); // Trạng thái cho dữ liệu biểu đồ
  const maxPoints = 20; // Giới hạn số điểm hiển thị trên biểu đồ

  // Hàm để fetch dữ liệu từ API
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/dashboard?page=1&pageSize=1&orderBy=id_DESC`);
      const { temperature, humidity, light } = response.data[0]; // Lấy dữ liệu
      const newData = {
        timestamp: new Date().toISOString(), // Sử dụng thời gian hiện tại làm trục x
        temperature,
        humidity,
        light,
      };

      setChartData(prevData => {
        const updatedData = [...prevData, newData];
        // Giữ tối đa maxPoints trên biểu đồ
        if (updatedData.length > maxPoints) {
          updatedData.shift();
        }
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
      <YAxis yAxisId="left" domain={[0, 100]} />
      {/* Trục Y bên phải dùng cho ánh sáng */}
      <YAxis yAxisId="right" domain={[0, 1000]} orientation="right" />
      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
      <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#387908" name="Humidity (%)" />
      <Line yAxisId="right" type="monotone" dataKey="light" stroke="#8884d8" name="Light (Lux)" />
    </LineChart>
  );
};

export default RealTimeLineChart;
