import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useDidUpdateEffect } from 'lib/utils';
import { color, font } from 'styles/__utils';
import cx from 'classnames';
import _ from 'lodash';

function ArrowPageContainer(props) {
  const {
    sagas,
    success,
    page,
    matchUrl,
    paging,
    pagingData: propsPagingData,
    url,
  } = props;

  // NOTE: paging link click
  /**
   * 
   * @param {object} config 
   */
  const handlePageClick = config => {
    const { e, value } = config;
    e.preventDefault();
    sagas({ page: page + value });
  }

  // NOTE: init pageContainer 
  useEffect(() => {
    if (success && url !== '/works') props.history.push(`${url}/${page}`);
  }, [page]);

  // NOTE: browser url change
  useDidUpdateEffect(() => {
    const isRouterActionPop = props.history.action === 'POP';
    if (isRouterActionPop) sagas(matchUrl);
  }, [matchUrl]);

  return (
    <Paging
      config={paging}
      onClick={handlePageClick}
      countPerPage={1}
      getPageUrl={`${url}`}
      pagingData={propsPagingData}
    />
  );
}

function Paging(props) {
  const { onClick = () => { }, config, pagingData, getPageUrl } = props;
  const hasTotalPage = pagingData.totalPage !== 0;

  return (
    <Styled.Pagination>
      <div className="pagination">
        {hasTotalPage &&
          <span className="page__view">
            {pagingData.page} /  {pagingData.totalPage}
          </span>
        }
        <a
          className={cx("Arrow__btn", { unActive: !pagingData.prevCheck })}
          href={`${getPageUrl}/${pagingData.page - 1}`}
          onClick={(e) => onClick({ type: "prev", value: -1, e })}>
          {config.prevPageText || "prev"}
        </a>
        <a
          className={cx("Arrow__btn", { unActive: !pagingData.nextCheck })}
          href={`${getPageUrl}/${pagingData.page + 1}`}
          onClick={(e) => onClick({ type: "prev", value: 1, e })}>
          {config.nextPageText || "next "}
        </a>
      </div>

    </Styled.Pagination>
  )
}


const Styled = {
  PageNationComponent: styled.div`
  `,
  Pagination: styled.div`
    &:after{
      display:block;
      content:"";
      clear: both;
    }
    & > .pagination{
      .page__view{
        position:relative;
        float:left;
        left: 50%;
        transform: translateX(-50%)
        ${font(16, color.gray_text)};
        top:10px;
      }
      .Arrow__btn{
        position:relative;
        display:inline-block;
        cursor: pointer;
        padding:3px;
        font-size:30px;
        color:${color.black};
        transition:.3s;
        &:hover{
          color:${color.blue};
        }
        &.unActive{
          color:gray;
          opacity:.5;
          pointer-events:none;
          &:hover{
            color:gray;
          }
        }
      }
    }
    
  `
}

export default withRouter(ArrowPageContainer);





// DEBUG: 커스텀 할 수도 있음
// import {useSelector} from 'react-redux';
// import {makeQuerySelector} from 'lib/reselector';
// import { useImmer } from 'use-immer';
// import Pagination from "react-js-pagination";

/**
 * <ArrowPageContainer
    sagas={(config) => LISTING_WORKS_SEARCH_SAGAS({ ...searchConfig, ...config })}
    success={listingReducer.works.success}
    failure={listingReducer.works.failure}
    pending={listingReducer.works.pending}
    page={listingReducer.works.pagingData.page}
    url={'/works'}
    matchUrl={props.match.params.list}
    pagingData={listingReducer.works.pagingData}
    paging={{
      prevPageText: <ArrowBackIosIcon
        disabled={isEndPrevPage}
        className={cx("Arrow__btn_svg", { disabled: isEndPrevPage })}
      />,
      nextPageText: <ArrowForwardIosIcon
        disabled={isEndNextPage}
        className={cx("Arrow__btn_svg", { disabled: isEndNextPage })}
      />
    }}
  />
 */
