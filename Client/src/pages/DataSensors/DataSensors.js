import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
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
  const [orderBy, setOrderBy] = useState('');
  // console.log(orderBy);
  const handleChangePage = (event, value) => {
    setPage(value);
    setOrderBy('');
    // Thực hiện các hành động khác khi thay đổi trang ở đây
  };

  const handleChangeItemsPerPage = event => {
    const newItemsPerPage = event.target.value;
    setItemsPerPage(newItemsPerPage);
    setOrderBy('');
    setPage(1); // Reset trang về 1 khi thay đổi số lượng phần tử trên mỗi trang
  };
  const handleSort = column => {
    if (orderBy === '') {
      setOrderBy(`${column}_ASC`);
    }
    if (orderBy !== '') {
      if (orderBy === `${column}_ASC`) setOrderBy(`${column}_DESC`);
      else setOrderBy(`${column}_ASC`);
    }
  };

  const [datasensor, setDataSenSor] = useState([]);
  useEffect(() => {
    const fetchData = async (page, pageSize, orderBy) => {
      try {
        const response = await axios.get(`http://localhost:3001/datasensor?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
        setDataSenSor(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // console.log(itemsPerPage, orderBy, columnNames);
    fetchData(page, itemsPerPage, orderBy);

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

  const convertDateTime = dateTimeString => {
    if (!moment(dateTimeString, moment.ISO_8601).isValid()) {
      return 'Ngày giờ không hợp lệ';
    }

    return moment(dateTimeString).format('HH:mm:ss - DD/MM/YYYY');
  };
  let totalPages = Math.ceil(datasensor.totalCount / itemsPerPage);
  return (
    <div className={cx('base')}>
      <Navigation />
      <div className={cx('sensor-table-div')}>
        <table className={cx('sensor-table')}>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }} onClick={() => handleSort('id')}>
                ID&nbsp;
                {orderBy === 'id_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'id_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
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
                {orderBy === 'temperature_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'temperature_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
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
                {orderBy === 'humidity_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'humidity_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
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
                {orderBy === 'light_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'light_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
                )}
                {/* <img src={sunicon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /> */}
              </th>
              <th style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }} onClick={() => handleSort('createdAt')}>
                TIME&nbsp;
                {orderBy === 'createdAt_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'createdAt_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
                )}
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className={cx('sensor-table-div')} style={{ height: '68vh', overflowY: 'auto' }}>
        <table className={cx('sensor-table')}>
          <tbody>
            {datasensor &&
              datasensor.data &&
              datasensor.data.length > 0 &&
              datasensor.data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td style={{ color: getTemperatureColor(item.temperature) }}>{item.temperature} °C</td>
                  <td style={{ color: getHumidityColor(item.humidity) }}>{item.humidity} %</td>
                  <td style={{ color: getLightColor(item.light) }}>{item.light} Lux</td>
                  <td>{convertDateTime(item.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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
