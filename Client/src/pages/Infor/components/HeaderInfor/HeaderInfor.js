import React from 'react';
import { ReactTyped as Typed } from 'react-typed';
import classNames from 'classnames/bind';
import styles from '../HeaderInfor/HeaderInfor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTiktok, faInstagram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import images from '../../../../components/ImageList/ImageList';
const cx = classNames.bind(styles);

const HeaderInfor = () => {
  return (
    <div className={cx('header')} style={{ zIndex: 2, boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}>
      <div className={cx('header_infor')}>
        <div className={cx('header_infor-img')}>
          <img src={images.myimg} alt="" className={cx('header_infor-myimg')} />
        </div>
        <div className={cx('header_infor-generalcontact')}>
          <h1 className={cx('infor-fullname')}>Trần Trung Kiên</h1>
          <span className={cx('textanimation')}>
            <Typed
              strings={['Tân Sinh Viên PTIT', 'Lập Trình Viên FrontEnd', 'Thực Tập Viên FullStack']}
              typeSpeed={50}
              backSpeed={50}
              backDelay={1300}
              loop
            />
          </span>
          <ul className={cx('infor-generalcontact-list')}>
            <a href="https://www.facebook.com/kien.trantrung.14473426" style={{ color: '#000', textDecoration: 'none' }}>
              <div className={cx('icon-wrap1')}>
                <FontAwesomeIcon icon={faFacebookF} className={cx('fab', 'fa-facebook-f')} />
              </div>
            </a>
            <a href="https://www.tiktok.com/@kien141002" style={{ color: '#000', textDecoration: 'none' }}>
              <div className={cx('icon-wrap2')}>
                <FontAwesomeIcon icon={faTiktok} className={cx('fab', 'fa-tiktok')} />
              </div>
            </a>
            <a href="https://www.instagram.com/trungkien141002/" style={{ color: '#000', textDecoration: 'none' }}>
              <div className={cx('icon-wrap3')}>
                <FontAwesomeIcon icon={faInstagram} className={cx('fab', 'fa-instagram')} />
              </div>
            </a>
            <a href="https://github.com/kiencutet" style={{ color: '#000', textDecoration: 'none' }}>
              <div className={cx('icon-wrap4')}>
                <FontAwesomeIcon icon={faGithub} className={cx('fab', 'fa-github')} />
              </div>
            </a>
            <a href="https://www.facebook.com/kien.trantrung.14473426" style={{ color: '#000', textDecoration: 'none' }}>
              <div className={cx('icon-wrap5')}>
                <FontAwesomeIcon icon={faTwitter} className={cx('fab', 'fa-twitter')} />
              </div>
            </a>
          </ul>
        </div>
      </div>
      <div className={cx('header_background')}>
        <ul>
          <li className={cx('infor-indexs')}>
            <p className={cx('infor-index')}>SĐT</p>
            <p>0776499168</p>
          </li>
          <li className={cx('infor-indexs')}>
            <p className={cx('infor-index')}>NGÀY SINH</p>
            <p>14/10/2002</p>
          </li>
        </ul>
        <ul>
          <li className={cx('infor-indexs')}>
            <p className={cx('infor-index')}>EMAIL</p>
            <p>Kiencutet@gmail.com</p>
          </li>
          <li className={cx('infor-indexs')}>
            <p className={cx('infor-index')}>QUÊ QUÁN</p>
            <p>Nghĩa Đồng, Nghĩa Hưng, Nam Định</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderInfor;
