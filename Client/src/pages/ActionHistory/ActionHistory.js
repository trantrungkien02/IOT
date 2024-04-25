import React, { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Pagination, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ActionHistory.module.scss';
import Navigation from '../../components/Navigation/Navigation';
const cx = classNames.bind(styles);

function ActionHistory() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');

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

  const [actionhistory, setActionhistory] = useState([]);
  useEffect(() => {
    const fetchData = async (page, pageSize, orderBy) => {
      try {
        const response = await axios.get(`http://localhost:3001/actionhistory?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
        setActionhistory(response.data);
        console.log(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log(itemsPerPage, orderBy);
    fetchData(page, itemsPerPage, orderBy);
  }, [itemsPerPage, page, orderBy]);
  const getActionColor = action => {
    if (action === 'on') {
      return '#52a0b8'; // Green color for LAMP ON
    } else {
      return '#333'; // Default color
    }
  };
  const convertDateTime = dateTimeString => {
    if (!moment(dateTimeString, moment.ISO_8601).isValid()) {
      return 'Ngày giờ không hợp lệ';
    }

    return moment(dateTimeString).format('HH:mm:ss - DD/MM/YYYY');
  };
  let totalPages = Math.ceil(actionhistory.totalCount / itemsPerPage);
  return (
    <div className={cx('base')}>
      <Navigation />
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
            {actionhistory &&
              actionhistory.data &&
              actionhistory.data.length > 0 &&
              actionhistory.data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.deviceName}</td>
                  <td style={{ color: getActionColor(item.action) }}>{item.action}</td>
                  <td>{convertDateTime(item.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={cx('page')}>
        <div>Total Pages: {totalPages}</div>
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
