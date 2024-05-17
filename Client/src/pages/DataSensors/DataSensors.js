import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Pagination, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
// import { BiSortUp } from 'react-icons/bs';
import classNames from 'classnames/bind';
import styles from './DataSensors.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import convertDateTime from '../../components/convertDateTime/convertDateTime';
// import moment from 'moment';
// import humidityicon from '../../images/humidity.png';
// import temperatureicon from '../../images/tem.png';
// import sunicon from '../../images/sun.png';
const cx = classNames.bind(styles);

function DataSensors() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [fieldName, setFieldName] = useState('all'); // Trạng thái cho tùy chọn được chọn
  const [searchValue, setSearchValue] = useState(''); // Trạng thái cho giá trị nhập vào
  const [searchState, setSearchState] = useState(1);
  const navigate = useNavigate();
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
  // Hàm xử lý khi tùy chọn thay đổi
  const handleFieldChange = event => {
    setFieldName(event.target.value); // Cập nhật tùy chọn được chọn
  };

  // Hàm xử lý khi giá trị nhập vào thay đổi
  const handleSearchChange = event => {
    setSearchValue(event.target.value); // Cập nhật giá trị nhập vào
  };

  // Hàm xử lý khi nút tìm kiếm được nhấp
  const handleSearchClick = () => {
    setSearchState(prevState => prevState + 1);
    setPage(1);
    console.log(searchState);
  };
  const deleteSearchState = () => {
    setSearchState(1);
    setSearchValue('');
    setFieldName('all');
    console.log(searchState);
  };
  const [datasensor, setDataSenSor] = useState([]);
  useEffect(() => {
    const fetchData = async (page, pageSize, orderBy, fieldName, searchValue) => {
      try {
        let queryParams;
        if (searchState !== 1) {
          const response = await axios.get(
            `http://localhost:3001/datasensor/search/{field}?page=${page}&pageSize=${pageSize}&field=${fieldName}&value=${searchValue}&orderBy=${orderBy}`,
          );
          setDataSenSor(response.data);
          queryParams = new URLSearchParams({
            page,
            pageSize,
            orderBy,
            field: fieldName,
            value: searchValue,
          }).toString();
          console.log(response.data);
        } else {
          const response = await axios.get(`http://localhost:3001/datasensor?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
          setDataSenSor(response.data);
          queryParams = new URLSearchParams({
            page,
            pageSize,
            orderBy,
          }).toString();
          console.log(response.data);
        }

        navigate({
          pathname: '/datasensor',
          search: `?${queryParams}`,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // console.log(itemsPerPage, orderBy, columnNames);
    fetchData(page, itemsPerPage, orderBy, fieldName, searchValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, page, orderBy, searchState]);

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
      <div className={cx('s003')}>
        <form>
          <div className={cx('inner-form')}>
            <div className={cx('input-field')}>
              <div className={cx('input-select')}>
                <select onChange={handleFieldChange} value={fieldName}>
                  <option value="all">All</option>
                  <option value="id">ID</option>
                  <option value="temperature">TEMPERATURE</option>
                  <option value="humidity">HUMIDITY</option>
                  <option value="light">LIGHT</option>
                  <option value="createdAt">CREATED_AT</option>
                </select>
              </div>
            </div>
            <div className={cx('input-field')}>
              <input type="text" value={searchValue} onChange={handleSearchChange} placeholder="Enter Keywords?" />
            </div>
            <div className={cx('input-field', 'third-wrap')}>
              {/* <button className={cx('btn-search')} type="button"> */}
              <button className={cx('btn-search')} onClick={handleSearchClick} type="button">
                <svg
                  class="svg-inline--fa fa-search fa-w-16"
                  aria-hidden="true"
                  data-prefix="fas"
                  data-icon="search"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
              <button className={cx('btn-search')} onClick={deleteSearchState} type="button">
                CLEAR SEARCH
              </button>
            </div>
          </div>
        </form>
      </div>
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
            {datasensor && datasensor.data && datasensor.data.length > 0 ? (
              datasensor.data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td style={{ color: getTemperatureColor(item.temperature) }}>{item.temperature} °C</td>
                  <td style={{ color: getHumidityColor(item.humidity) }}>{item.humidity} %</td>
                  <td style={{ color: getLightColor(item.light) }}>{item.light} Lux</td>
                  <td>{convertDateTime(item.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">NO DATA</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={cx('page')}>
        <div>Total Pages: {isNaN(parseInt(totalPages)) ? 0 : parseInt(totalPages)}</div>

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
