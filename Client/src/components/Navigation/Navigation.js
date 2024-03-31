import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navigation.module.scss';

const cx = classNames.bind(styles);

const Navigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabClick = (path) => {
    setActiveTab(path);
  };

  return (
    <div className={cx('Nav')}>
      <div className={cx('Nav-child', { 'Nav-link-active': activeTab === '/' })}>
        <Link to="/" className={cx('Nav-link')} onClick={() => handleTabClick('/')}>
          DASHBOARD
        </Link>
      </div>
      <div className={cx('Nav-child', { 'Nav-link-active': activeTab === '/datasensors' })}>
        <Link to="/datasensors" className={cx('Nav-link')} onClick={() => handleTabClick('/datasensors')}>
          DATA SENSORS
        </Link>
      </div>
      <div className={cx('Nav-child', { 'Nav-link-active': activeTab === '/actionhistory' })}>
        <Link to="/actionhistory" className={cx('Nav-link')} onClick={() => handleTabClick('/actionhistory')}>
          ACTION HISTORY
        </Link>
      </div>
      <div className={cx('Nav-child', { 'Nav-link-active': activeTab === '/infor' })}>
        <Link to="/infor" className={cx('Nav-link')} onClick={() => handleTabClick('/infor')}>
          INFORMATION
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
