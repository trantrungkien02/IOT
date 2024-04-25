import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
// import { BiSortUp } from 'react-icons/bs';
import classNames from 'classnames/bind';
import styles from './DataSensors.module.scss';
import Navigation from '../../components/Navigation/Navigation';
// import moment from 'moment';
// import humidityicon from '../../images/humidity.png';
// import temperatureicon from '../../images/tem.png';
// import sunicon from '../../images/sun.png';
const cx = classNames.bind(styles);

function DataSensors() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [columnNames, setColumnNames] = useState('');
  const initialOrderBy = {
    id: '',
    temperature: '',
    humidity: '',
    light: '',
    createdAt: '',
  };
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const handleChangePage = (event, value) => {
    setPage(value);
    // Thực hiện các hành động khác khi thay đổi trang ở đây
  };

  const handleChangeItemsPerPage = event => {
    const newItemsPerPage = event.target.value;
    setItemsPerPage(newItemsPerPage);
    setOrderBy(initialOrderBy);
    setPage(1); // Reset trang về 1 khi thay đổi số lượng phần tử trên mỗi trang
  };
  const handleSort = column => {
    const newOrderBy = { ...orderBy };
    let currentOrder = newOrderBy[column];
    setColumnNames(column);
    if (currentOrder) {
      switch (currentOrder) {
        case `${column}_ASC`:
          currentOrder = `${column}_DESC`;
          break;
        case `${column}_DESC`:
          currentOrder = `${column}_ASC`;
          break;
        default:
          break;
      }
    } else {
      currentOrder = `${column}_ASC`;
    }

    // Xóa giá trị của cột đang sắp xếp để giữ nguyên các giá trị của các cột khác
    Object.keys(newOrderBy).forEach(key => {
      if (key !== column) {
        delete newOrderBy[key];
      }
    });

    newOrderBy[column] = currentOrder;
    setOrderBy(newOrderBy);

    console.log(newOrderBy[column]);
  };

  const [datasensor, setDataSenSor] = useState([]);
  useEffect(() => {
    const fetchData = async (page, pageSize, orderBy) => {
      try {
        const response = await axios.get(`http://localhost:3001/datasensor?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
        setDataSenSor(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log(itemsPerPage, orderBy, columnNames);
    fetchData(page, itemsPerPage, orderBy[columnNames]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, page, orderBy]);

  const getTemperatureColor = temperature => {
    if (temperature < 15) {
      return '#f76caf';
    } else if (temperature >= 15 && temperature < 35) {
      return '#e84575';
    } else {
      return '#cc184e';
    }
  };

  const getHumidityColor = humidity => {
    if (humidity < 70) {
      return '#53d2db';
    } else if (humidity >= 70 && humidity < 80) {
      return '#4f8fbf';
    } else {
      return '#26648b';
    }
  };

  const getLightColor = light => {
    if (light < 40) {
      return '#f7ba79';
    } else if (light >= 40 && light < 80) {
      return '#e55905';
    } else {
      return '#f4443f';
    }
  };

  let totalPages = Math.ceil(datasensor.totalCount / itemsPerPage);
  return (
    <div className={cx('base')}>
      <Navigation />
      <table className={cx('sensor-table')}>
        <thead>
          <tr>
            <th style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }} onClick={() => handleSort('id')}>
              ID&nbsp;
              {orderBy.id === 'id_ASC' ? (
                <FontAwesomeIcon icon={faArrowUpWideShort} />
              ) : orderBy.id === 'id_DESC' ? (
                <FontAwesomeIcon icon={faArrowDownWideShort} />
              ) : (
                <FontAwesomeIcon icon={faSort} />
              )}
            </th>
            <th
              style={{
                background: 'linear-gradient(to top right, #dfa6ac, #dd4959)',
                color: '#333',
                borderRadius: '5px',
              }}
              onClick={() => handleSort('temperature')}
            >
              TEMPERATURE&nbsp;
              {orderBy.temperature === 'temperature_ASC' ? (
                <FontAwesomeIcon icon={faArrowUpWideShort} />
              ) : orderBy.temperature === 'temperature_DESC' ? (
                <FontAwesomeIcon icon={faArrowDownWideShort} />
              ) : (
                <FontAwesomeIcon icon={faSort} />
              )}
              {/* <img src={temperatureicon} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} /> */}
            </th>
            <th
              style={{
                background: 'linear-gradient(to top right, #98cad9, #3790ab)',
                color: '#333',
                borderRadius: '5px',
              }}
              onClick={() => handleSort('humidity')}
            >
              HUMIDITY&nbsp;
              {orderBy.humidity === 'humidity_ASC' ? (
                <FontAwesomeIcon icon={faArrowUpWideShort} />
              ) : orderBy.humidity === 'humidity_DESC' ? (
                <FontAwesomeIcon icon={faArrowDownWideShort} />
              ) : (
                <FontAwesomeIcon icon={faSort} />
              )}
              {/* <img src={humidityicon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /> */}
            </th>
            <th
              style={{
                background: 'linear-gradient(to top right, #efebd8, #ebd474, #ffcc00)',
                color: '#333',
                borderRadius: '5px',
              }}
              onClick={() => handleSort('light')}
            >
              LIGHT&nbsp;
              {orderBy.light === 'light_ASC' ? (
                <FontAwesomeIcon icon={faArrowUpWideShort} />
              ) : orderBy.light === 'light_DESC' ? (
                <FontAwesomeIcon icon={faArrowDownWideShort} />
              ) : (
                <FontAwesomeIcon icon={faSort} />
              )}
              {/* <img src={sunicon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /> */}
            </th>
            <th style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }} onClick={() => handleSort('createdAt')}>
              TIME&nbsp;
              {orderBy.createdAt === 'createdAt_ASC' ? (
                <FontAwesomeIcon icon={faArrowUpWideShort} />
              ) : orderBy.createdAt === 'createdAt_DESC' ? (
                <FontAwesomeIcon icon={faArrowDownWideShort} />
              ) : (
                <FontAwesomeIcon icon={faSort} />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {datasensor &&
            datasensor.data &&
            datasensor.data.length > 0 &&
            datasensor.data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td style={{ color: getTemperatureColor(item.temperature) }}>{item.temperature}</td>
                <td style={{ color: getHumidityColor(item.humidity) }}>{item.humidity}</td>
                <td style={{ color: getLightColor(item.light) }}>{item.light}</td>
                <td>{item.createdAt}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={cx('page')}>
        <div>Total Pages: {parseInt(totalPages)}</div>

        <Pagination
          count={totalPages} // Tổng số trang
          page={page} // Trang hiện tại
          onChange={handleChangePage} // Xử lý sự kiện khi trang thay đổi
          showFirstButton
          showLastButton
        />
        <div className={cx('select-horizontal')}>
          <Select label="Items per page" value={itemsPerPage} onChange={handleChangeItemsPerPage}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default DataSensors;
