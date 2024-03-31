import React from 'react';
import { ReactTyped as Typed } from 'react-typed';
import classNames from 'classnames/bind';
import styles from './Infor.module.scss';
import Navigation from '../Navigation/Navigation';
import inforimg from '../../images/myimg.jpg';
import hacker from '../../images/hackerlo.jpg';
import hagiang from '../../images/hagiang.jpg';
import thuyen from '../../images/thuyen.jpg';
import hotam from '../../images/hotam.jpg';
import project1 from '../../images/project1.jpg';
import reactapp from '../../images/reactapp.jpg';
import tmdt from '../../images/tmdt.jpg';
import theband from '../../images/theband.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { faCss3Alt, faReact, faPython } from '@fortawesome/free-brands-svg-icons';
import { faJs } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function Infor() {
  return (
    <div>
      <div className={cx('base')}>
        <Navigation />
        <div className={cx('grid-colrow')}>
          <div className={cx('header')} style={{ zIndex: 2, boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}>
            <div className={cx('header_infor')}>
              <div className={cx('header_infor-img')}>
                <img src={inforimg} alt="" className={cx('header_infor-myimg')} />
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
                  <a
                    href="https://www.facebook.com/kien.trantrung.14473426"
                    style={{ color: '#000', textDecoration: 'none' }}
                  >
                    <div className={cx('icon-wrap1')}>
                      <FontAwesomeIcon icon={faFacebookF} className={cx('fab', 'fa-facebook-f')} />
                    </div>
                  </a>
                  <a href="https://www.tiktok.com/@kien141002" style={{ color: '#000', textDecoration: 'none' }}>
                    <div className={cx('icon-wrap2')}>
                      <FontAwesomeIcon icon={faTiktok} className={cx('fab', 'fa-tiktok')} />
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/trungkien141002/"
                    style={{ color: '#000', textDecoration: 'none' }}
                  >
                    <div className={cx('icon-wrap3')}>
                      <FontAwesomeIcon icon={faInstagram} className={cx('fab', 'fa-instagram')} />
                    </div>
                  </a>
                  <a href="https://github.com/kiencutet" style={{ color: '#000', textDecoration: 'none' }}>
                    <div className={cx('icon-wrap4')}>
                      <FontAwesomeIcon icon={faGithub} className={cx('fab', 'fa-github')} />
                    </div>
                  </a>
                  <a
                    href="https://www.facebook.com/kien.trantrung.14473426"
                    style={{ color: '#000', textDecoration: 'none' }}
                  >
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
          <div className={cx('container_category')} style={{ zIndex: 2, boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}>
            <a href="#" style={{ textDecoration: 'none' }}>
              <div className={cx('container_category-menu')}>
                <FontAwesomeIcon
                  icon={faUserSecret}
                  className={cx('fas', 'fa-user-secret', 'category-menu-icon-css')}
                />
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

          <div className={cx('container_category-contents')} style={{ zIndex: 2 }}>
            <div
              id="banthan"
              className={cx('container_category-content', 'flexing')}
              style={{ boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}
            >
              <div className={cx('category-content-intromyself')}>
                <h1 className={cx('introyourselfh1')}>Giới Thiệu</h1>
                <p>
                  Mình tên là Trần trung Kiên, năm nay mình 21 tuổi, mình sinh ra và lớn lên tại quê hương Nam Định,
                  hiện tại mình đang sinh sống và học tập tại Hà Nội và mình đang theo học tại Học Viện Công nghệ Bưu
                  Chính Viễn Thông, chuyên ngành của mình là Phát Triển ứng Dụng thuộc ngành Công Nghê Đa Phương Tiện.
                </p>
              </div>
              <div className={cx('category-content-mylike')}>
                <h1 className={cx('introyourselfh1')}>Sở Thích</h1>
                <div className={cx('mygamelike')}>
                  <div className={cx('mygamelike-content')}>
                    <i className={cx('fa-solid fa-keyboard', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                    <h2>Lập Trình</h2>
                  </div>
                  <div className={cx('mylikegwshow')}>
                    <img src={hacker} alt="" className={cx('imggwshow')} />
                    <ul className={cx('mylikegwshowul')}>
                      <h3>FullStack</h3>
                      <p>Hãy kiểm soát code, đừng để code kiểm soát tinh thần bạn!</p>
                    </ul>
                  </div>
                  <div className={cx('mygamelike-content')}>
                    <i className={cx('fa-solid fa-motorcycle', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                    <h2>Du Lịch</h2>
                  </div>
                  <div className={cx('mylikegwshow')}>
                    <img src={hagiang} alt="" className={cx('imggwshow')} />
                    <ul className={cx('mylikegwshowul')}>
                      <h3>Hà Giang</h3>
                      <p>
                        Vi vu với những đường đèo hiểm trở số 1, chúng ta sẽ tham quan sông Nho Quế, cột cờ Lũng Cú, đèo
                        mã Pí Lèng, cao nguyên đá Đồng Văn,...Còn chờ gì mà không xách balo lên và đi nào, chắc chắn sẽ
                        mang lại cho bạn cảm giác tuyệt vời!
                      </p>
                    </ul>
                  </div>
                  <div className={cx('mygamelike-content')}>
                    <i className={cx('fa-solid fa-microphone', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                    <h2>Ca Hát</h2>
                  </div>
                  <div className={cx('mylikegwshow')}>
                    <img src={thuyen} alt="" className={cx('imggwshow')} />
                    <ul className={cx('mylikegwshowul')}>
                      <h3>Anh muốn mình như con thuyền kia</h3>
                      <p>Một bài hát thay lời tỏ tình của một chàng trai với người con gái mà anh ấy theo đuổi.</p>
                    </ul>
                  </div>
                  <div className={cx('mygamelike-content')}>
                    <i className={cx('fa-brands fa-youtube', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                    <h2>Xem Phim</h2>
                  </div>
                  <div className={cx('mylikegwshow')}>
                    <img src={hotam} alt="" className={cx('imggwshow')} />
                    <ul className={cx('mylikegwshowul')}>
                      <h3>Hộ Tâm</h3>
                      <p>
                        Bộ phim kể về chuyện tình yêu đầy trắc trở của cặp tình nhân huyền yêu, sau khi trải qua muôn và
                        vạn thử thách thì cuối cùng họ cũng đã được ở bên cạnh nhau.
                      </p>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="hocvan"
              className={cx('container_category-content', 'flexing')}
              style={{ boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}
            >
              <h1 className={cx('introyourselfh1')}>Học Vấn</h1>

              <div className={cx('mygamelike-content')}>
                <i className={cx('fa-solid', 'fa-graduation-cap', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                <h2>Giáo Dục</h2>
              </div>

              <div className={cx('educations')}>
                <div className={cx('educationschool')}>
                  <h4 className={cx('educationschoolbefore')}>Học Viện Công Nghệ Bưu Chính Viễn Thông</h4>
                  <span>Từ 2020 -- Hiện Tại</span>
                  <p>
                    Mình trúng tuyển vào Học Viện với số điểm 26.05 và hiện tại mình đang là sinh viên năm thứ tư của
                    Học Viện. Mình khá tự hào khi là sinh viên của Học Viện còn gpa của mình thì ngược lại, mình rất
                    thất vọng về nó.
                  </p>
                </div>

                <div className={cx('educationschool')}>
                  <h4>F8 - Lập Trình FullStack</h4>
                  <span>Từ 2022 -- Hiện Tại</span>
                  <p>
                    Đầu năm 2022 mình đã biết đến F8 là một trang web rất chi là phù hợp cho những bạn có đam mê với
                    ngành lập trình web. Ở đây có rất nhiều khóa học cực kì hay và tâm huyết do anh Sơn Đặng tạo ra và
                    đa số là khóa học free. Nhưng nếu bạn bỏ tiền ra mua khóa học mất tiền thì tin mình đi bạn sẽ không
                    bao giờ thất vọng đâu, kiến thức bạn thu được sẽ là rất nhiều so với số tiền bạn bỏ ra.
                  </p>
                </div>

                <div className={cx('educationschoolnobefore')}>
                  <h4>Funix</h4>
                  <span>Từ 2023 -- Hiện Tại</span>
                  <p>
                    Funix là một trung tâm dạy học với đa nội dung từ lập trình, tiếng anh, ..... Chúng ta sẽ cần mất
                    học phí khi tham gia các khóa học nhưng tin mình lần nữa đi, ở đây có cực kì nhiều khóa học hay và
                    đặc sắc do cả giảng viên Việt Nam và cũng có thể là giảng viên nước ngoài giảng dạy. Đây là một
                    trung tâm uy tín nếu bạn đang phân vân không biết mình sẽ theo học ở đâu.
                  </p>
                </div>
              </div>

              <div className={cx('mygamelike-content')}>
                <i className={cx('fa-solid', 'fa-briefcase', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                <h2>Kinh Nghiệm</h2>
              </div>
              <div className={cx('educations')}>
                <div className={cx('educationschool')}>
                  <h4 className={cx('educationschoolbefore')}>Lập Trình Web</h4>
                  <span>Từ 2021 -- Hiện Tại</span>
                  <p>
                    Sau những giờ học ở trường và những kiến thức mình tìm hiểu được thì hiện tại thi mình đã nắm được
                    sơ sơ phần html,css và javascript. Ngoài ra mình cũng được học thêm một số ngôn ngữ lập trình khác
                    như là C,C++,Python,Java nhưng mà chỉ ở mức độ cơ bản.
                  </p>
                </div>

                <div className={cx('educationschool')}>
                  <h4>Chạy tiệc parttime</h4>
                  <span>Từ 2022 -- Hiện Tại</span>
                  <p>
                    Với công việc làm parttime này cho mình rất nhiều trải nghiệm thú vị cùng một khoản thu nhập tương
                    đối để có thể duy trì cuộc sống sinh hoạt và học tập.
                  </p>
                </div>

                <div className={cx('educationschoolnobefore')}>
                  <h4>Nghiên cứu khoa học</h4>
                  <span>Từ 2022 -- 2023</span>
                  <p>
                    Với các đề tài nghiên cứu khoa học mình đã học hỏi được rất nhiều kiến thức mới từ các người bạn
                    đồng hành cùng những kinh nghiệm để có thể thực hiện được một đề tài nghiên cứu khoa học nào đó.
                  </p>
                </div>
              </div>
              <div className={cx('category-content-education')}>
                <div className={cx('mygamelike-content')}>
                  <i className={cx('fa-solid', 'fa-chart-column', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                  <h2>Kỹ Năng Cá Nhân</h2>
                </div>

                <div className={cx('mygamelike-content')}>
                  <i className={cx('fa-solid', 'fa-gears', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                  <h2>Kỹ năng Lập Trình</h2>
                </div>
                <div className={cx('sklilldev', 'flexing')}>
                  <div className={cx('container1')} id="skills">
                    <div className={cx('technical-bars')}>
                      <div className={cx('bar')}>
                        <FontAwesomeIcon
                          icon={faHtml5}
                          className={cx('fab', 'fa-html5')}
                          style={{ color: 'orangered' }}
                        />
                        <div className={cx('info')}>
                          <span>HTML</span>
                        </div>
                        <div className={cx('progress-line', 'html')}>
                          <span></span>
                        </div>
                      </div>
                      <div className={cx('bar')}>
                        <FontAwesomeIcon
                          icon={faCss3Alt}
                          className={cx('fab', 'fa-css3-alt')}
                          style={{ color: '#147bbc' }}
                        />
                        <div className={cx('info')}>
                          <span>CSS</span>
                        </div>
                        <div className={cx('progress-line', 'css')}>
                          <span></span>
                        </div>
                      </div>
                      <div className={cx('bar')}>
                        <FontAwesomeIcon
                          icon={faJs}
                          className={cx('fab', 'fa-square-js')}
                          style={{ color: '#b0bc1e' }}
                        />
                        <div className={cx('info')}>
                          <span>Javascript</span>
                        </div>
                        <div className={cx('progress-line', 'javascript')}>
                          <span></span>
                        </div>
                      </div>
                      <div className={cx('bar')}>
                        <FontAwesomeIcon
                          icon={faReact}
                          className={cx('fab', 'fa-react')}
                          style={{ color: '#69bcbc' }}
                        />
                        <div className={cx('info')}>
                          <span>React</span>
                        </div>
                        <div className={cx('progress-line', 'react')}>
                          <span></span>
                        </div>
                      </div>
                      <div className={cx('bar')}>
                        <FontAwesomeIcon
                          icon={faPython}
                          className={cx('fab', 'fa-python')}
                          style={{ color: '#c32ec9' }}
                        />
                        <div className={cx('info')}>
                          <span>Python</span>
                        </div>
                        <div className={cx('progress-line', 'python')}>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx('mygamelike-content')}>
                  <h2>Kỹ năng Làm Việc</h2>

                  <div className={cx('container1')}>
                    <div className={cx('radial-bars')}>
                      <div className={cx('radial-bar')}>
                        <svg x="0px" y="0px" viewBox="0 0 200 200">
                          <circle className={cx('progress-bar')} cx="100" cy="100" r="80"></circle>
                          <circle className={cx('path', 'path-1')} cx="100" cy="100" r="80"></circle>
                        </svg>
                        <div className={cx('percentage')}>90%</div>
                        <div className={cx('text')}>Làm Việc Nhóm</div>
                      </div>

                      <div className={cx('radial-bar')}>
                        <svg x="0px" y="0px" viewBox="0 0 200 200">
                          <circle className={cx('progress-bar')} cx="100" cy="100" r="80"></circle>
                          <circle className={cx('path', 'path-2')} cx="100" cy="100" r="80"></circle>
                        </svg>
                        <div className={cx('percentage')}>65%</div>
                        <div className={cx('text')}>Thuyết Trình</div>
                      </div>

                      <div className={cx('radial-bar')}>
                        <svg x="0px" y="0px" viewBox="0 0 200 200">
                          <circle className={cx('progress-bar')} cx="100" cy="100" r="80"></circle>
                          <circle className={cx('path', 'path-3')} cx="100" cy="100" r="80"></circle>
                        </svg>
                        <div className={cx('percentage')}>75%</div>
                        <div className={cx('text')}>Tạo Lập Văn Bản</div>
                      </div>

                      <div className={cx('radial-bar')}>
                        <svg x="0px" y="0px" viewBox="0 0 200 200">
                          <circle className={cx('progress-bar')} cx="100" cy="100" r="80"></circle>
                          <circle className={cx('path', 'path-4')} cx="100" cy="100" r="80"></circle>
                        </svg>
                        <div className={cx('percentage')}>85%</div>
                        <div className={cx('text')}>Tin Học Văn Phòng</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="thanhtuu"
              className={cx('container_category-content', 'flexing')}
              style={{ boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}
            >
              <h1 className={cx('introyourselfh2')}>Thành Tựu Nho Nhỏ</h1>

              <div className={cx('projected')}>
                <img src={project1} alt="" className={cx('imggwshow3')} />
                <p className={cx('text')}>My Profile</p>
              </div>

              <div className={cx('projected')}>
                <img src={reactapp} alt="" className={cx('imggwshow3')} />
                <p className={cx('text')}>My ReactApp</p>
              </div>

              <div className={cx('projected')}>
                <img src={tmdt} alt="" className={cx('imggwshow3')} />
                <p className={cx('text')}>My Ecommerce</p>
              </div>

              <div className={cx('projected')}>
                <img src={theband} alt="" className={cx('imggwshow3')} />
                <p className={cx('text')}>The Band</p>
              </div>

              <p className={cx('pbottom')}>--------------------------------------------------</p>
            </div>
            <div
              id="muctieu"
              className={cx('container_category-content', 'flexing')}
              style={{ boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}
            >
              <h1 className={cx('introyourselfh1')}>Mục Tiêu</h1>

              <div className={cx('mygamelike-content')}>
                <i className={cx('fa-solid', 'fa-graduation-cap', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                <h2>Học Tập</h2>
              </div>

              <div className={cx('educations')}>
                <div className={cx('educationschool')}>
                  <h4 className={cx('educationschoolbefore')}>Ra Trường đúng hạn</h4>
                  <span>Từ Hiện Tại -- 2025</span>
                  <p>
                    Mình đang chuẩn bị học tiếng anh để lấy chứng chỉ ra trường cùng với đó mình sẽ cố gắng qua hết các
                    môn để được ra trường đúng so với dự kiến.
                  </p>
                </div>

                <div className={cx('educationschool')}>
                  <h4>Nắm chắc các ngôn ngữ lập trình web cơ bản</h4>
                  <span>Từ Hiện Tại -- Tương Lai</span>
                  <p>
                    Hiện tại mình đang dồn toàn lực để cải thiện nhanh nhất các kiến thức cơ bản nhất như thành thạo
                    html, css, js, reactjs,....Mục tiêu là học những kiến thức cần và đủ để có thể đi làm được.
                  </p>
                </div>

                <div className={cx('educationschoolnobefore')}>
                  <h4>Biết 1-2 ngoại ngữ</h4>
                  <span>Từ Hiện Tại -- Tương Lai</span>
                  <p>
                    Ngoài việc học tiếng anh để có chứng chỉ ra trường thì mình cũng có đam mê với tiếng Nhật. Mình sẽ
                    cố gắng học song song để khả năng ngoại ngữ của mình đa năng hơn.
                  </p>
                </div>
              </div>

              <div className={cx('mygamelike-content')}>
                <i className={cx('fa-solid', 'fa-briefcase', 'category-menu-icon-css')} style={{ scale: 0.7 }}></i>
                <h2>Việc Làm</h2>
              </div>

              <div className={cx('educations')}>
                <div className={cx('educationschool')}>
                  <h4 className={cx('educationschoolbefore')}>Mục tiêu việc làm ngắn hạn</h4>
                  <span>Từ Hiện Tại -- 2024</span>
                  <p>
                    Mình mong muốn phấn đấu để được đi thực tập ở một số nơi để làm quen với môi trường làm việc của
                    ngành cùng với đó tìm hiểu thêm các công nghệ mà thị trường đang cần.
                  </p>
                </div>

                <div className={cx('educationschool')}>
                  <h4>Mục tiêu việc làm dài hạn</h4>
                  <span>Từ Hiện Tại -- Tương Lai</span>
                  <p>
                    Mục tiêu dài hạn của mình là có một công việc dev ổn định và có thu nhập từ trung bình đến cao để có
                    thể cảm nhận cuộc sống một cách tốt nhất. Cùng với đó mình mong muốn bản thân càng hoàn thiện về mặt
                    kiến thức,....để có thể trở thành phiên bản tốt nhất của bản thân.
                  </p>
                </div>

                <p className={cx('pbottom')}>--------------------------------------------------</p>
              </div>
            </div>
            <div
              id="lienhe"
              className={cx('container_category-content', 'flexing')}
              style={{ boxShadow: '0 6px 10px rgba(0,0,0, 0.2)' }}
            >
              <h1 className={cx('introyourselfh1')}>Liên Hệ</h1>

              <div className={cx('content-section')}>
                <div className={cx('contact-content')}>
                  <div className={cx('contact-info')}>
                    <p>
                      <i className={cx('fa-solid', 'fa-location-dot', 'contant-text')}></i>Hà Đông, Hà Nội
                    </p>
                    <p>
                      <i className={cx('fa-solid', 'fa-phone', 'contant-text')}></i>Số Điện Thoại:{' '}
                      <a href="tel:+0776499168" className={cx('contant-text')}>
                        +0776499168
                      </a>
                    </p>
                    <p>
                      <i className={cx('fa-solid', 'fa-envelope', 'contant-text')}></i>Email:{' '}
                      <a href="mailto:kiencutet@gmail.com" className={cx('contant-text')}>
                        kiencutet@gmail.com
                      </a>
                    </p>
                  </div>

                  <div className={cx('contact-form')}>
                    <form action="">
                      <div className={cx('row')}>
                        <div className={cx('col', 'col-half', 's-col-full')}>
                          <input
                            type="text"
                            name=""
                            placeholder="Họ Và Tên"
                            required
                            id=""
                            className={cx('form-control')}
                          />
                        </div>
                        <div className={cx('col', 'col-half', 's-col-full', 's-mt-8')}>
                          <input
                            type="email"
                            name=""
                            placeholder="Email"
                            required
                            id=""
                            className={cx('form-control')}
                          />
                        </div>
                      </div>
                      <div className={cx('row', 'mt-8')}>
                        <div className={cx('col', 'col-full')}>
                          <input
                            type="text"
                            name=""
                            placeholder="Tin Nhắn"
                            required
                            id=""
                            className={cx('form-control')}
                          />
                        </div>
                      </div>
                      <input className={cx('contact-submit-btn')} type="submit" value="GỬI" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
