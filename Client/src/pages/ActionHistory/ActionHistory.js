import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mqtt from 'mqtt';
import { Pagination, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ActionHistory.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import convertDateTime from '../../components/convertDateTime/convertDateTime';
const cx = classNames.bind(styles);

function ActionHistory() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [fieldName, setFieldName] = useState('all'); // Trạng thái cho tùy chọn được chọn
  const [searchValue, setSearchValue] = useState(''); // Trạng thái cho giá trị nhập vào
  const [searchState, setSearchState] = useState(1);
  const navigate = useNavigate();
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
  };
  const [actionhistory, setActionHistory] = useState([]);
  useEffect(() => {
    const fetchData = async (page, pageSize, orderBy, fieldName, searchValue) => {
      try {
        if (searchState !== 1) {
          const response = await axios.get(
            `http://localhost:3001/actionhistory/search/{field}?page=${page}&pageSize=${pageSize}&field=${fieldName}&value=${searchValue}&orderBy=${orderBy}`,
          );
          setActionHistory(response.data);
          console.log(response.data);
        } else {
          const response = await axios.get(`http://localhost:3001/actionhistory?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
          setActionHistory(response.data);
          console.log(response.data);
        }
        const queryParams = new URLSearchParams({
          page,
          pageSize,
          orderBy,
          field: fieldName,
          value: searchValue,
        }).toString();

        navigate({
          pathname: '/actionhistory',
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

  const getActionColor = action => {
    if (action === 'ON') {
      return '#52a0b8'; // Green color for LAMP ON
    } else {
      return '#333'; // Default color
    }
  };
  let totalPages = Math.ceil(actionhistory.totalCount / itemsPerPage);
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
                  <option value="deviceName">DEVICE_NAME</option>
                  <option value="action">ACTION</option>
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
      <div className={cx('history-table-div')}>
        <table className={cx('history-table')}>
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
                onClick={() => handleSort('deviceName')}
              >
                DEVICES&nbsp;
                {orderBy === 'deviceName_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'deviceName_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
                )}
              </th>
              <th
                style={{
                  background: 'linear-gradient(to top right, #98cad9, #3790ab)',
                  color: '#333',
                  borderRadius: '5px',
                }}
                onClick={() => handleSort('action')}
              >
                ACTION&nbsp;
                {orderBy === 'action_ASC' ? (
                  <FontAwesomeIcon icon={faArrowUpWideShort} className={cx('icon-hover')} />
                ) : orderBy === 'action_DESC' ? (
                  <FontAwesomeIcon icon={faArrowDownWideShort} className={cx('icon-hover')} />
                ) : (
                  <FontAwesomeIcon icon={faSort} className={cx('icon-hover')} />
                )}
              </th>
              <th
                style={{
                  background: 'linear-gradient(to top right, #efebd8, #ebd474, #ffcc00)',
                  color: '#333',
                  borderRadius: '5px',
                }}
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
      <div className={cx('history-table-div')} style={{ height: '68vh', overflowY: 'auto' }}>
        <table className={cx('history-table')}>
          <tbody>
            {actionhistory && actionhistory.data && actionhistory.data.length > 0 ? (
              actionhistory.data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.deviceName}</td>
                  <td style={{ color: getActionColor(item.action) }}>{item.action}</td>
                  <td>{convertDateTime(item.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">NO DATA</td>
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

export default ActionHistory;
