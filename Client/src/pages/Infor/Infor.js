import React from 'react';
import classNames from 'classnames/bind';
import styles from './Infor.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import HeaderInfor from './components/HeaderInfor/HeaderInfor';
import CategoryContent from './components/CategoryContent/CategoryContent';
import Category from './components/Category/Category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function Infor() {
  return (
    <div>
      <div className={cx('base')}>
        <Navigation />
        <div className={cx('grid-colrow')}>
          <HeaderInfor />
          <Category />
          <CategoryContent />
        </div>
      </div>
      <div className={cx('homepage')}>
        <a href="#" alt="">
          <FontAwesomeIcon icon={faHome} className={cx('fas', 'fa-house')} />
        </a>
      </div>

      <a href="#lienhe">
        <div className={cx('homepage1')}>Liên Hệ</div>
      </a>

      <div className={cx('circle1')}></div>
      <div className={cx('circle2')}></div>
      <div className={cx('circle3')}></div>
      <div className={cx('circle4')}></div>
      <div className={cx('circle5')}></div>
      <div className={cx('circle6')}></div>
      <div className={cx('circle7')}></div>
      <div className={cx('circle8')}></div>
    </div>
  );
}

export default Infor;
