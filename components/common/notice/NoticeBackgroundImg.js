import React from 'react';
import styled from 'styled-components';

/**
 * 
 * ishidden // boolean
  contHeight // string
  img // obj {src: icon_partner_search, width: '100px', height: '100px'}
  titleTxt // obj {size: '22px', color: '#555', txt: '파트너를 검색하여 요청할 수 있습니다'}
  subTxt // obj {size: '18px', color: '#777', txt: '고유번호 혹은 업체명 등으로 파트너를 검색하세요.'}
 */
function NoticeBackgroundImg(props) {
  const {
    ishidden,
    contHeight,
    img,
    titleTxt,
    subTxt,
  } = props;

  return (
    <Styled.NoticeBackgroundImg {...props} >
      <div className={`${ishidden ? "hidden" : "show"} notice_background`}>
          <div className="img-cont">
            <img src={img.src} />
          </div>
          <div className="notice-cont">
            <p className="title">{titleTxt.txt}</p>
            <p className="sub-title">{subTxt.txt}</p>
          </div>
      </div>
    </Styled.NoticeBackgroundImg>
  );
}

const Styled = {
  NoticeBackgroundImg: styled.div`
    width: 100%;
    .notice_background{
      &.show{
        display: flex;
      }
      &.hidden{
        display: none;
      }
    }
    .notice_background {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: ${({contHeight}) => contHeight ? contHeight : '100%'};

      .img-cont {
        text-align: center;
        img {
          display: inline-block;
          width: ${({img}) => img.width ? img.width : '100px'};
          height: ${({img}) => img.height ? img.height : '100px'};
        }
      }

      .notice-cont {
        margin-top: 40px;
        text-align: center;
        .title {
          font-size: ${({titleTxt}) => titleTxt.size ? titleTxt.size : '22px'};
          color: ${({titleTxt}) => titleTxt.color ? titleTxt.color : '#555'};
        }

        .sub-title {
          font-size: ${({subTxt}) => subTxt.size ? subTxt.size : '18px'};
          color: ${({subTxt}) => subTxt.color ? subTxt.color : '#777'};
        }
      }
    }
  `,
}

export default NoticeBackgroundImg;