import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Category/Category.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret, faBook, faGlobeAmericas, faBullseye } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const Category = () => {
  return (
    <div className={cx('container_category')} style={{ zIndex: 2, boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}>
      <a href="#" style={{ textDecoration: 'none' }}>
        <div className={cx('container_category-menu')}>
          <FontAwesomeIcon icon={faUserSecret} className={cx('fas', 'fa-user-secret', 'category-menu-icon-css')} />
          <p className={cx('category-menu-text-css')}>BẢN THÂN</p>
        </div>
      </a>
      <a href="#hocvan" style={{ textDecoration: 'none' }}>
        <div className={cx('container_category-menu')}>
          <FontAwesomeIcon icon={faBook} className={cx('fas', 'fa-book', 'category-menu-icon-css')} />
          <p className={cx('category-menu-text-css')}>HỌC VẤN</p>
        </div>
      </a>
      <a href="#thanhtuu" style={{ textDecoration: 'none' }}>
        <div className={cx('container_category-menu')}>
          <FontAwesomeIcon
            icon={faGlobeAmericas} // Chú ý đổi tên biểu tượng
            className={cx('fas', 'fa-earth-americas', 'category-menu-icon-css')}
          />
          <p className={cx('category-menu-text-css')}>THÀNH TỰU</p>
        </div>
      </a>
      <a href="#muctieu" style={{ textDecoration: 'none' }}>
        <div className={cx('container_category-menu')}>
          <FontAwesomeIcon icon={faBullseye} className={cx('fas', 'fa-bullseye', 'category-menu-icon-css')} />
          <p className={cx('category-menu-text-css')}>MỤC TIÊU</p>
        </div>
      </a>
    </div>
  );
};
export default Category;
