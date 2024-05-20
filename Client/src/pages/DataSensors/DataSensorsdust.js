import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pagination, Select, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './DataSensorsdust.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import convertDateTime from '../../components/convertDateTime/convertDateTime';
const cx = classNames.bind(styles);

function DataSensors() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [fieldName, setFieldName] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [searchState, setSearchState] = useState(1);
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [resetDatePickers, setResetDatePickers] = useState(true);

  // function formatDate(inputDateString) {
  //   const originalDate = new Date(inputDateString);

  //   const formattedDate = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1)
  //     .toString()
  //     .padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')}`;

  //   return formattedDate;
  // }
  console.log(startDate, endDate);
  const navigate = useNavigate();

  const handleChangePage = (event, value) => {
    setPage(value);
    // setOrderBy('');
  };

  const handleChangeItemsPerPage = event => {
    const newItemsPerPage = event.target.value;
    setItemsPerPage(newItemsPerPage);
    setOrderBy('');
    setPage(1);
  };

  const handleSort = column => {
    if (orderBy === '') {
      setOrderBy(`${column}_ASC`);
    } else if (orderBy === `${column}_ASC`) {
      setOrderBy(`${column}_DESC`);
    } else {
      setOrderBy(`${column}_ASC`);
    }
  };
  const handleStartDateChange = newDate => {
    setStartDate(newDate ? newDate : null); // Cập nhật giá trị startDate
    setSearchValue('');
    setSearchState(1);
  };

  // Hàm xử lý sự kiện khi thay đổi giá trị của END DATE
  const handleEndDateChange = newDate => {
    setEndDate(newDate ? newDate : null); // Cập nhật giá trị endDate
    setSearchValue('');
    setSearchState(1);
  };

  const handleFieldChange = event => {
    const value = event.target.value;
    setFieldName(value);
    setShowDatePickers(value === 'createdAt');
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
    setStartDate(null);
    setEndDate(null);
    setResetDatePickers(false);
    console.log(resetDatePickers);
  };

  const handleSearchClick = () => {
    setSearchState(prevState => prevState + 1);
    setPage(1);
    setOrderBy('');
  };

  const deleteSearchState = () => {
    setSearchValue('');
    setFieldName('all');
    setPage(1);
    setSearchState(prevState => prevState + 1);
  };

  const [datasensor, setDataSenSor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let queryParams;
        if (searchState > 1 && searchValue !== '') {
          const response = await axios.get(
            `http://localhost:3001/datasensor/search/${fieldName}?page=${page}&pageSize=${itemsPerPage}&field=${fieldName}&value=${searchValue}&orderBy=${orderBy}`,
          );
          setDataSenSor(response.data);
          console.log(response.data);
          queryParams = new URLSearchParams({
            page,
            pageSize: itemsPerPage,
            orderBy,
            field: fieldName,
            value: searchValue,
          }).toString();
          console.log('getsearch');
        } else if (searchState > 1 && startDate !== null && endDate !== null) {
          const response = await axios.get(
            `http://localhost:3001/datasensor/searchcreatedat?page=${page}&pageSize=${itemsPerPage}&startDate=${startDate}&endDate=${endDate}&orderBy=${orderBy}`,
          );
          setDataSenSor(response.data);
          setResetDatePickers(true);
          console.log(response.data, resetDatePickers);
          queryParams = new URLSearchParams({
            page,
            pageSize: itemsPerPage,
            orderBy,
            startDate: startDate,
            endDate: endDate,
          }).toString();
          console.log('getCreatedAt', startDate, endDate, resetDatePickers);
        } else {
          const response = await axios.get(`http://localhost:3001/datasensor?page=${page}&pageSize=${itemsPerPage}&orderBy=${orderBy}`);
          setDataSenSor(response.data);
          queryParams = new URLSearchParams({
            page,
            pageSize: itemsPerPage,
            orderBy,
          }).toString();
          console.log('getall', startDate, endDate, resetDatePickers);
        }

        navigate({
          pathname: '/datasensor',
          search: `?${queryParams}`,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, itemsPerPage, orderBy, searchState]);

  useEffect(() => {
    if (searchValue === '') {
      setSearchState(prevState => prevState + 1);
      setOrderBy('');
      setResetDatePickers(true);
      console.log(resetDatePickers);
    }
  }, [searchValue]);

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
  const getDustColor = dust => {
    if (dust < 20) {
      return '#808080';
    } else if (dust >= 20 && dust < 40) {
      return '#808080';
    } else if (dust >= 40 && dust < 60) {
      return '#505050'; // Màu xám
    } else {
      return '#303030';
    }
  };

  let totalPages = Math.ceil(datasensor.totalCount / itemsPerPage);
  return (
    <div className={cx('base')}>
      <Navigation />

      <div className={cx('sensor-table-parent')}>
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
                    <option value="dust">DUST</option>
                    <option value="createdAt">CREATED_AT</option>
                  </select>
                </div>
              </div>
              <div className={cx('input-field')}>
                <input type="text" value={searchValue} onChange={handleSearchChange} placeholder="Enter Keywords?" />
              </div>
              {showDatePickers ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="START DATE"
                      format={'YYYY-MM-DD'}
                      value={resetDatePickers ? startDate : null}
                      onChange={handleStartDateChange}
                    />
                  </LocalizationProvider>
                  &nbsp;&nbsp;
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="END DATE" format={'YYYY-MM-DD'} value={resetDatePickers ? endDate : null} onChange={handleEndDateChange} />
                  </LocalizationProvider>
                </>
              ) : null}

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
                {/* <button className={cx('btn-search')} onClick={deleteSearchState} type="button">
                  CLEAR SEARCH
                </button> */}
              </div>
            </div>
          </form>
        </div>
        <div className={cx('sensor-table-div')}>
          <table className={cx('sensor-table')}>
            <thead>
              <tr>
                <th
                  className={cx('th-feild')}
                  style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }}
                  onClick={() => handleSort('id')}
                >
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
                  className={cx('th-feild')}
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
                  className={cx('th-feild')}
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
                  className={cx('th-feild')}
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
                <th
                  className={cx('th-feild')}
                  style={{
                    background: 'linear-gradient(to top right, #d3d3d3, #b0b0b0, #808080)',
                    color: '#333',
                    borderRadius: '5px',
                  }}
                  onClick={() => handleSort('dust')}
                >
                  DUST&nbsp;
                  {orderBy === 'dust_ASC' ? (
                    <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                  ) : orderBy === 'dust_DESC' ? (
                    <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                  ) : (
                    <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
                  )}
                  {/* <img src={sunicon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /> */}
                </th>
                <th
                  className={cx('th-feild')}
                  style={{ backgroundColor: '#c9d4d7', color: '#333', borderRadius: '5px' }}
                  onClick={() => handleSort('createdAt')}
                >
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
        <div className={cx('sensor-table-div')} style={{ height: '64vh', overflowY: 'auto' }}>
          <table className={cx('sensor-table')}>
            <tbody>
              {datasensor && datasensor.data && datasensor.data.length > 0 ? (
                datasensor.data.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ color: getTemperatureColor(item.temperature) }}>{item.temperature} °C</td>
                    <td style={{ color: getHumidityColor(item.humidity) }}>{item.humidity} %</td>
                    <td style={{ color: getLightColor(item.light) }}>{item.light} Lux</td>
                    <td style={{ color: getDustColor(item.dust) }}>{item.dust} Mg/m3</td>
                    <td>{convertDateTime(item.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">{datasensor}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={cx('page')}>
          <div className={cx('total-page')}>Total Pages: {isNaN(parseInt(totalPages)) ? 0 : parseInt(totalPages)}</div>

          <Pagination
            count={totalPages} // Tổng số trang
            page={page} // Trang hiện tại
            onChange={handleChangePage} // Xử lý sự kiện khi trang thay đổi
            showFirstButton
            showLastButton
            className={cx('page-list')}
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
    </div>
  );
}

export default DataSensors;
