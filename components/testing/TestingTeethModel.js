import React, { useRef, useEffect, useCallback, useState } from "react";
import styled from 'styled-components';
import _ from 'lodash';
import { color } from 'styles/__utils';
import { useImmer } from 'use-immer';
import { useSharedCallbackUnsafe } from 'lib/utils';
import {getElementAttrToObject} from 'lib/library';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { log } from 'lib/library';


const TeethModelState = {
  clickedIdx: 0,
  selected: {
    id: null,
    element: null
  },
  bridge: [],
  bridgeItems: [],
  items: []
}



function TeethModel(props) {
  const svgRef = useRef(null);
  const [values, setValues] = useImmer(TeethModelState);
  const { svgId, type, onClick } = props;


  const eventMouseover = config => {
    const { target } = config;
    target.classList.add('on');
  };

  const eventMouseleave = config => {
    const { target } = config;
    if (!target.classList.contains('fixed')) {
      target.classList.remove('on');
    }
  }


  const handleClick = useSharedCallbackUnsafe(config => {
    const { type, e, target, gTag } = config;
    if (type === 'bridge') {
      const targetElement = e.target;
      const bridgeId = e.target.getAttribute('data-bridge-id');
      if (targetElement.classList.contains('on')) {
        targetElement.classList.remove('on');
        setValues(draft => {
          draft.bridge = _.filter(values.bridge, item => item !== bridgeId);
        });
      } else {
        targetElement.classList.add('on');
        setValues(draft => {
          draft.bridge.push(bridgeId);
        });
      }
    }

    if (type === 'tooth') {
      // NOTE: tooth style init
      _.map(values.items, item => {
        item.pathOuterTag.classList.remove('fixed');
        item.pathOuterTag.classList.remove('on');
      })

      // 클릭했을때 현재  tooth가 아니면
      if (values.selected.element !== target) {
        target.classList.add('fixed');
        setValues(draft => {
          draft.selected.id = gTag.getAttribute('data-tooth-id');
          draft.selected.element = target;
        });
      } else {
        // 클릭 했을때 현재 tooth와 같을때
        target.classList.remove('fixed');
        target.classList.remove('on');

        // const targetItemInfo = values.items[+values.selected.id+1];
        setValues(draft => {
          draft.selected.id = null;
          draft.selected.element = null;
        });
      }
    }
    setValues(draft => {
      draft.clickedIdx = values.clickedIdx + 1;
    })
  });

  // NOTE: handleClick시 이벤트
  useEffect(() => {
    if (values.clickedIdx > 0) {
      onClick && onClick({ type: "teeth", tooth: values.selected, bridge: values.bridge })
    }
  }, [values.clickedIdx]);


  // NOTE: tooth init
  useEffect(() => {
    if (values.items[0]) {
      const itemsList = values.items;
      // NOTE: circle, outer add className 
      _.map(itemsList, (item, idx) => {
        const gTagId = idx + 1;
        item.gTag.setAttribute('data-tooth-id', gTagId);
        item.pathInTag.classList.add('__teethModel__in')
        item.pathOuterTag.classList.add('__teethModel__outer');
        item.circleTag.classList.add('__teethModel__circle');


        // item.pathOuterTag.addEventListener('mouseover', (e) => eventMouseover({ type: 'circle', e, target: item.pathOuterTag }));
        // item.pathInTag.addEventListener('mouseover', (e) => eventMouseover({ type: 'circle', e, target: item.pathOuterTag }));
        // item.circleTag.addEventListener('mouseover', (e) => eventMouseover({ type: 'circle', e, target: item.pathOuterTag }));

        // item.pathOuterTag.addEventListener('mouseleave', (e) => eventMouseleave({ type: 'circle', e, target: item.pathOuterTag }));
        // item.pathInTag.addEventListener('mouseleave', (e) => eventMouseleave({ type: 'circle', e, target: item.pathOuterTag }));
        // item.circleTag.addEventListener('mouseleave', (e) => eventMouseleave({ type: 'circle', e, target: item.pathOuterTag }));

        // NOTE: tooth Click
        item.pathOuterTag.addEventListener('click', (e) => handleClick({ type: "tooth", e, target: item.pathOuterTag, gTag: item.gTag }));
        item.circleTag.addEventListener('click', (e) => handleClick({ type: "tooth", e, target: item.pathOuterTag, gTag: item.gTag }));
        item.pathInTag.addEventListener('click', (e) => handleClick({ type: "tooth", e, target: item.pathOuterTag, gTag: item.gTag }));

      })
      console.log('item!');
      // console.log(values.items);
    }
  }, [values.items]);

  // NOTE: bridge init
  useEffect(() => {
    if (values.bridgeItems[0]) {
      // // NOTE: bridge event, add className
      const bridgeList = values.bridgeItems;
      _.map(bridgeList, (item, idx) => {
        item.classList.add('__teethModel__bridge');
        item.setAttribute('data-bridge-id', `${idx + 18}${idx + 19}`);
        item.addEventListener('click', (e) => handleClick({ type: "bridge", e }))
      });
    }
  }, [values.bridgeItems]);




  // NOTE: init 
  // NOTE: 브릿지는 18번부터시작, 치아는 1번부터시작
  // DEBUG: 아이템 리스트를 useImmerState에다가 다 넣고 진행해보기



  useEffect(() => {
    const svgRefCurrent = svgRef.current;
    const getElementGList = Array.from(svgRefCurrent.querySelectorAll(`#${svgId} g`));
    const getElementCircleBridgeList = Array.from(svgRefCurrent.querySelectorAll(`#${svgId} circle[stroke-miterlimit]`));
    const getPathAndCircleList = _.map(getElementGList,
      item => ({
        gTag: item,
        pathOuterTag: item.querySelector('path[stroke]'),
        pathInTag: item.querySelector('path:not([stroke])'),
        circleTag: item.querySelector('circle')
      }));
    setValues(draft => {
      draft.items = getPathAndCircleList;
      draft.bridgeItems = getElementCircleBridgeList;
    });


    // NOTE: 이벤트 해제
    return () => {
      const getElementGList = svgRef.current.querySelectorAll('g');
      const getPathAndCircleList = _.map(getElementGList, item => ({
        pathOuterTag: item.querySelector('path[stroke]'),
        pathInTag: item.querySelector('path:not([stroke])'),
        circleTag: item.querySelector('circle')
      }));



      // 
      _.map(getPathAndCircleList, item => {
        item.pathInTag.removeEventListener('mouseover', eventMouseover);
        item.pathInTag.removeEventListener('mouseleave', eventMouseleave);
        item.circleTag.removeEventListener('mouseover', eventMouseover);
        item.circleTag.removeEventListener('mouseleave', eventMouseleave);
      })
    }
  }, [svgRef]);


  

  return (
    <Styled.TeethModel >
      <svg
        id={svgId}
        ref={svgRef}
        className="teeth_svg"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        x="0"
        y="0"
        version="1.1"
        viewBox="0 0 267.333 448"
        xmlSpace="preserve"
      >
        <g>
          <radialGradient
            id="a"
            cx="63.737"
            cy="-1707.651"
            r="14.45"
            className="bg"
            gradientTransform="matrix(.9875 .1578 .1963 -1.2283 318.985 -1912.984)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>

          <path
            fill="url(#a)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M60.667 204.333C55.081 207.478 53.491 207.4 44.8 206c-8.688-1.4-9.142-5.727-10.237-11.795-2.511-13.92 12.77-11.705 20.27-11.871 11.879-.265 12.171 18.434 5.834 21.999z"
            className="stroke"
          ></path>

          <path
            fill="#E7F2FB"
            d="M41.944 188.333c5.174 2.092 4.831 4.643 3.213 5.809-1.126.814-2.141-.225-3.307-.184-.813.029-1.307.811-.688 1.292.624.487 2.271.772 2.404.927.895 1.025-.567 2.239-1.216 3.478-.853 1.632.286 2.714 1.43 1.537 1.979-2.033 1.497-4.209 3.996-1.852 3.902 3.683 6.691 1.288 2.734-.868-2.595-1.415-4.075-8.882.406-8.72 1.383.05 1.843-1.105 1.301-1.87-1.156-1.626-3.415.82-5.14.654-1.341-.129-2.188-1.51-3.321-2.065-1.673-.817-3.855 1.037-1.812 1.862z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(18.69 198.333)"
          >
            18
        </text>
          <circle
            cx="45.661"
            cy="193.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="b"
            cx="-39.139"
            cy="-636.894"
            r="17.067"
            className="bg"
            gradientTransform="matrix(.9992 -.0398 -.0432 -1.0847 58.652 -526.355)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#b)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M38.833 179.833c4.392 1.214 9.231.536 14.289.999 16.849 1.542 14.323-22.814 11.378-27.499-2.229-3.547-16.922-4.346-23.616-4.671-15.234-.739-9.049 29.237-2.051 31.171z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M42.806 162.051c2.759.841 2.049 4.177-1.91 5.371-2.865.863-1.511 4.25-.178 2.551 4.061-5.175 4.157 2.054 6.828 2.155 1.107.042 1.676-.651-.787-3.219-1.816-1.895-1.686-5.521 2.501-5.905 1.771-.162 1.717-1.991-.069-2.222-1.229-.158-2.693.202-2.793-1.162-.217-2.936-.729-3.436-2.161-.754-.897 1.675-10.267.493-1.431 3.185z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(16.169 168.974)"
          >
            17
        </text>
          <circle
            cx="45.661"
            cy="164.619"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="c"
            cx="37.532"
            cy="-1024.219"
            r="18.681"
            className="bg"
            gradientTransform="matrix(.9664 .0645 .0787 -1.1807 92.184 -1079.524)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#c)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M38.442 145.664c8.344 3.443 23.205 5.378 27.558-2.497 2.629-4.755 5.821-22.758 2.87-25.667-2.954-2.909-23.615-7.127-29.113-3.859-12.898 7.671-7.853 29.326-1.315 32.023z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M37.826 127.841c-.444 1.275 2.161 1.485 3.367 2.091 2.543 1.276 3.375 3.997 2.689 7.272.95-1.252 1.44-3.875 2.231-4.361 2.162-1.334 9.767 2.144 2.904-1.798-3.869-2.224-.906-4.731-2.699-6.236-3.436 5.56-8.204 2.208-8.492 3.032z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(15.617 133.852)"
          >
            16
        </text>
          <circle
            cx="46.109"
            cy="129.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="d"
            cx="86.691"
            cy="-1727.167"
            r="15.6"
            className="bg"
            gradientTransform="matrix(.9582 .1409 .148 -1.0067 224.031 -1649.68)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#d)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M37.936 98.083c-1.084 6.331.728 10.9 4.727 12.597 3.998 1.698 5.965.934 10.837 1.486 5.25.595 10.913-.213 13.75-3.657 2.838-3.443 1.627-8.229-1.171-10.763-2.8-2.535-14.389-10.679-20.246-9.497-3.785.765-7.201 5.78-7.897 9.834z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M54.42 97.797c-1.138.391-1.911.476-2.654 1.512-1.591 2.215-1.345 6.239-.65 8.276.372 1.089-1.005 1.425-1.813-.153-.507-.986-1.633-.217-2.905.074-2.028.465-3.709-.727-1.61-1.646 5.033-2.204 5.91-5.408 4.581-7.804-1.631-2.947-.609-3.88.399-3.217 1.164.766.879 2.814 4.295 1.653 1.948-.66 1.986.747.357 1.305z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(21.617 100.853)"
          >
            15
        </text>
          <circle
            cx="49.109"
            cy="100.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="e"
            cx="175.037"
            cy="-1611.048"
            r="15.906"
            className="bg"
            gradientTransform="matrix(.8971 .365 .3985 -.9795 543.843 -1563.057)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#e)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M47.355 70.822c-3.058 5.649-3.668 12.536-.188 15.137 3.479 2.601 5.748 3.039 10.54 4.084 5.71 1.245 11.765 1.153 15.34-1.516s3.655-9.921 1.539-13.048C72.47 72.35 62.753 64.138 56.811 64.762c-5.939.625-7.994 3.356-9.456 6.06z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M57.167 79.722c.475-2.618 4.018-5.731 6.484-7.057 1.391-.748.57-2.132-1.657-1.211-1.334.551-1.578-1.024-2.398-2.288-1.342-2.071-1.931-1.578-1.02 1.016 1.64 4.677-1.357 8.059-4.074 8.929-3.104.994-2.938 2.178-1.816 2.345 1.314.195 2.479-1.294 4.125 1.457.896 1.499 1.923.698 1.179-.594-.534-.924-1.031-1.444-.823-2.597z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(30.617 70.853)"
          >
            14
        </text>
          <circle
            cx="57.109"
            cy="77.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="f"
            cx="13.301"
            cy="-946.559"
            r="14.12"
            gradientTransform="matrix(.8287 .5014 .5257 -.8689 559.272 -773.962)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#f)"
            d="M63.732 48.288c-7.234 9.915-3.09 14.51.891 17.546s10.441 5.873 18.859 2.109c4.159-1.858 4.242-13.805 2.374-17.014-1.94-3.332-3.378-8.159-9.258-9.781-3.785-1.044-11.015 4.604-12.866 7.14z"
          ></path>
          <radialGradient
            id="g"
            cx="13.115"
            cy="-4009.512"
            r="8.423"
            fx="7.533"
            fy="-4009.257"
            gradientTransform="matrix(.8287 .5014 1.3325 -2.2023 5404.21 -8780.685)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#g)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M64.29 47.5c-7.234 9.915-3.648 15.297.333 18.333s10.441 5.873 18.859 2.109c4.159-1.858 3.83-15.162 1.807-18.276-3.112-4.792-3.287-7.033-9.167-8.655-3.784-1.043-9.981 3.953-11.832 6.489z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(47.617 46.852)"
          >
            13
        </text>
          <circle
            cx="73.109"
            cy="54.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="h"
            cx="-292.454"
            cy="-1034.256"
            r="10.434"
            gradientTransform="matrix(.3651 .9243 -1.1157 .6083 -954.905 939.185)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#h)"
            d="M103.396 41.936c-.018-4.993-.412-6.995-2.637-9.412-2.225-2.416-5.063-2.863-10.085-1.642-7.15 1.738-11.447 8.34-8.367 12.218 3.081 3.879 5.1 5.623 7.707 7.981 2.607 2.357 6.142 1.282 9.159-.177 3.017-1.458 4.242-3.976 4.223-8.968z"
          ></path>
          <radialGradient
            id="i"
            cx="-293.668"
            cy="-4058.499"
            r="6.025"
            fx="-297.661"
            fy="-4058.316"
            gradientTransform="matrix(.3651 .9243 -6.3415 3.4577 -25538.213 14343.434)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#i)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M103.403 41.944c-.018-4.993-.412-6.995-2.636-9.412-2.224-2.417-5.062-2.862-10.086-1.641-7.149 1.737-11.447 8.338-8.366 12.217 3.082 3.878 5.092 5.616 7.699 7.974 2.607 2.357 6.149 1.288 9.167-.17 3.018-1.459 4.24-3.975 4.222-8.968z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(73.617 27.852)"
          >
            12
        </text>
          <circle
            cx="92.109"
            cy="38.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="j"
            cx="-483.191"
            cy="-880.009"
            r="11.868"
            gradientTransform="matrix(.1117 1.0777 1.2906 -.0973 1305.593 466.225)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#j)"
            d="M105.265 40.576c-3.197-5.438-4.673-8.015-3.633-12.081 1.049-4.099 3.484-6.334 10.971-7.526 9.824-1.563 17.814 2.835 16.723 8.29-1.076 5.371-4.332 7.399-5.487 11.063-1.147 3.642-3.251 5.253-7.452 5.966-4.391.746-8.102-.574-11.122-5.712z"
          ></path>
          <radialGradient
            id="k"
            cx="-483.934"
            cy="-3971.559"
            r="6.779"
            fx="-488.426"
            fy="-3971.354"
            gradientTransform="matrix(.1117 1.0777 9.0441 -.6822 36089.258 -2157.888)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#k)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M105.26 40.588c-3.197-5.437-4.673-8.015-3.633-12.081 1.049-4.099 3.483-6.334 10.971-7.525 9.824-1.564 17.814 2.833 16.723 8.288-1.074 5.371-4.333 7.399-5.488 11.063-1.147 3.643-3.251 5.254-7.451 5.967-4.39.745-8.101-.573-11.122-5.712z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(104.836 17.498)"
          >
            11
        </text>
          <circle
            cx="115.109"
            cy="29.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="l"
            cx="-481.881"
            cy="-865.497"
            r="11.868"
            gradientTransform="matrix(-.1117 1.0777 -1.2906 -.0973 -1027.871 466.225)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#l)"
            d="M153.581 40.576c3.197-5.438 4.674-8.015 3.634-12.081-1.05-4.099-3.484-6.334-10.971-7.526-9.824-1.563-17.815 2.835-16.723 8.29 1.076 5.371 4.332 7.399 5.487 11.063 1.146 3.642 3.251 5.253 7.451 5.966 4.39.746 8.102-.574 11.122-5.712z"
          ></path>
          <radialGradient
            id="m"
            cx="-482.623"
            cy="-3963.37"
            r="6.779"
            fx="-487.115"
            fy="-3963.164"
            gradientTransform="matrix(-.1117 1.0777 -9.0441 -.6822 -35756.191 -2153.713)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#m)"
            stroke="#b4c1ce"
            strokeMiterlimit="10"
            d="M153.585 40.588c3.196-5.437 4.673-8.015 3.633-12.081-1.05-4.099-3.483-6.334-10.971-7.525-9.824-1.564-17.814 2.833-16.723 8.288 1.074 5.371 4.332 7.399 5.487 11.063 1.147 3.643 3.252 5.254 7.452 5.967 4.39.745 8.102-.573 11.122-5.712z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(145.357 17.498)"
          >
            21
        </text>
          <circle
            cx="144.109"
            cy="29.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="n"
            cx="-262.89"
            cy="-1079.182"
            r="10.435"
            gradientTransform="matrix(-.3651 .9243 1.1157 .6083 1275.438 939.185)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#n)"
            d="M156.22 41.936c.017-4.993.411-6.995 2.637-9.412 2.226-2.416 5.063-2.863 10.085-1.642 7.15 1.738 11.447 8.34 8.366 12.218-3.08 3.879-5.462 5.955-8.069 8.313-2.607 2.357-5.778.95-8.795-.508-3.018-1.459-4.242-3.977-4.224-8.969z"
          ></path>
          <radialGradient
            id="o"
            cx="-264.102"
            cy="-4083.852"
            r="6.025"
            fx="-268.094"
            fy="-4083.669"
            gradientTransform="matrix(-.3651 .9243 6.3415 3.4577 25969.402 14403.77)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#o)"
            stroke="#b4c1ce"
            strokeMiterlimit="10"
            d="M156.213 41.944c.017-4.993.411-6.995 2.636-9.412 2.224-2.417 5.062-2.862 10.086-1.641 7.149 1.737 11.447 8.338 8.366 12.217-3.081 3.878-5.092 5.616-7.699 7.974s-6.148 1.288-9.166-.17c-3.019-1.459-4.241-3.975-4.223-8.968z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(173.357 26.498)"
          >
            22
        </text>
          <circle
            cx="167.109"
            cy="38.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="p"
            cx="-10.418"
            cy="-961.634"
            r="13.994"
            gradientTransform="matrix(-.8287 .5014 -.5257 -.8689 -328.545 -773.962)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#p)"
            d="M194.39 49.5c7.233 9.915 1.926 15.343-2.056 18.379s-8.942 4.827-17.36 1.063c-4.159-1.858-4.087-14.231-2.219-17.44 1.94-3.332 3.698-7.868 9.578-9.49 3.786-1.044 10.207 4.952 12.057 7.488z"
          ></path>
          <radialGradient
            id="q"
            cx="-10.845"
            cy="-4017.965"
            r="8.423"
            fx="-16.427"
            fy="-4017.71"
            gradientTransform="matrix(-.8287 .5014 -1.3325 -2.2023 -5176.873 -8786.287)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#q)"
            stroke="#b4c1ce"
            strokeMiterlimit="10"
            d="M194.167 48.5c7.234 9.915 3.648 15.297-.333 18.333s-10.441 5.873-18.859 2.109c-4.159-1.858-3.83-15.162-1.808-18.276 3.112-4.792 3.287-7.033 9.167-8.655 3.785-1.043 9.982 3.953 11.833 6.489z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(201.357 46.498)"
          >
            23
        </text>
          <circle
            cx="186.109"
            cy="55.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="r"
            cx="166.494"
            cy="-1614.363"
            r="15.906"
            className="bg"
            gradientTransform="matrix(-.8971 .365 -.3879 -.9534 -277.014 -1521.18)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#r)"
            stroke="#b4c1ce"
            strokeMiterlimit="10"
            d="M211.37 70.822c3.058 5.649 3.668 12.536.188 15.137-3.479 2.601-5.747 3.039-10.539 4.084-5.711 1.245-11.766 1.153-15.341-1.516s-3.655-9.921-1.539-13.048c2.115-3.129 11.832-11.341 17.774-10.716 5.94.624 7.995 3.355 9.457 6.059z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M201.557 79.722c-.475-2.618-4.018-5.731-6.484-7.057-1.391-.748-.57-2.132 1.657-1.211 1.334.551 1.578-1.024 2.398-2.288 1.342-2.071 1.931-1.578 1.02 1.016-1.64 4.677 1.357 8.059 4.074 8.929 3.104.994 2.938 2.178 1.816 2.345-1.314.195-2.479-1.294-4.125 1.457-.896 1.499-1.923.698-1.179-.594.535-.924 1.031-1.444.823-2.597z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(217.357 70.498)"
          >
            24
        </text>
          <circle
            cx="202.109"
            cy="76.498"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="s"
            cx="139.673"
            cy="-1719.737"
            r="15.6"
            className="bg"
            gradientTransform="matrix(-.9582 .1409 -.148 -1.0067 88.41 -1649.664)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#s)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M222.64 98.083c1.084 6.331-.728 10.9-4.727 12.597-3.998 1.698-5.965.934-10.838 1.486-5.25.595-10.913-.213-13.75-3.657-2.838-3.443-1.627-8.229 1.172-10.763 2.8-2.535 14.389-10.679 20.245-9.497 3.786.765 7.202 5.78 7.898 9.834z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M206.156 97.797c1.138.391 1.91.476 2.654 1.512 1.591 2.215 1.345 6.239.65 8.276-.372 1.089 1.005 1.425 1.813-.153.507-.986 1.633-.217 2.905.074 2.028.465 3.709-.727 1.61-1.646-5.033-2.204-5.91-5.408-4.581-7.804 1.632-2.947.609-3.88-.398-3.217-1.164.766-.879 2.814-4.295 1.653-1.949-.66-1.987.747-.358 1.305z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(228.357 100.498)"
          >
            25
        </text>
          <circle
            cx="210.017"
            cy="101.635"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="t"
            cx="90.963"
            cy="-1021.294"
            r="18.681"
            className="bg"
            gradientTransform="matrix(-.9664 .0645 -.0787 -1.1807 220.256 -1079.517)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#t)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M222.134 145.664c-8.344 3.443-23.205 5.378-27.559-2.497-2.629-4.755-5.82-22.758-2.869-25.667 2.953-2.909 23.614-7.127 29.112-3.859 12.898 7.671 7.854 29.326 1.316 32.023z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M222.75 127.841c.444 1.275-2.161 1.485-3.367 2.091-2.543 1.276-3.375 3.997-2.688 7.272-.95-1.252-1.44-3.875-2.231-4.361-2.162-1.334-9.767 2.144-2.904-1.798 3.869-2.224.906-4.731 2.699-6.236 3.436 5.56 8.203 2.208 8.491 3.032z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(235.357 133.498)"
          >
            26
        </text>
          <circle
            cx="214.017"
            cy="129.635"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="u"
            cx="12.685"
            cy="-638.796"
            r="17.067"
            className="bg"
            gradientTransform="matrix(-.9992 -.0398 .0432 -1.0847 253.788 -526.355)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#u)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M221.743 179.833c-4.392 1.214-9.23.536-14.288.999-16.849 1.542-14.322-22.814-11.379-27.499 2.229-3.547 16.923-4.346 23.616-4.671 15.233-.739 9.049 29.237 2.051 31.171z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M217.77 162.051c-2.759.841-2.049 4.177 1.91 5.371 2.865.863 1.511 4.25.178 2.551-4.061-5.175-4.157 2.054-6.828 2.155-1.107.042-1.676-.651.787-3.219 1.816-1.895 1.686-5.521-2.501-5.905-1.771-.162-1.717-1.991.069-2.222 1.229-.158 2.693.202 2.793-1.162.217-2.936.729-3.436 2.161-.754.897 1.675 10.267.493 1.431 3.185z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(235.357 168.498)"
          >
            27
        </text>
          <circle
            cx="214.017"
            cy="163.635"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="v"
            cx="114.951"
            cy="-1701.001"
            r="14.449"
            className="bg"
            gradientTransform="matrix(-.9875 .1578 -.1963 -1.2283 -6.53 -1912.898)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#v)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M199.91 204.333c5.586 3.144 7.176 3.067 15.866 1.667 8.688-1.4 9.142-5.727 10.236-11.795 2.512-13.92-12.77-11.705-20.27-11.871-11.877-.265-12.17 18.434-5.832 21.999z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M218.632 188.333c-5.174 2.092-4.831 4.643-3.213 5.809 1.126.814 2.141-.225 3.307-.184.813.029 1.307.811.688 1.292-.624.487-2.271.772-2.404.927-.895 1.025.567 2.239 1.216 3.478.853 1.632-.286 2.714-1.43 1.537-1.979-2.033-1.497-4.209-3.996-1.852-3.902 3.683-6.691 1.288-2.734-.868 2.595-1.415 4.075-8.882-.406-8.72-1.383.05-1.843-1.105-1.301-1.87 1.156-1.626 3.415.82 5.14.654 1.341-.129 2.188-1.51 3.321-2.065 1.673-.817 3.855 1.037 1.812 1.862z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(235.357 198.498)"
          >
            28
        </text>
          <circle
            cx="214.017"
            cy="193.636"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="w"
            cx="55.323"
            cy="-1184.498"
            r="15.186"
            className="bg"
            gradientTransform="matrix(-.9804 -.1969 -.2464 1.2268 -27.688 1705.657)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#w)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M193.754 233c1.666-6.192 9.842-6.746 18.47-5 8.627 1.745 10.828 11.571 10.221 16.532-1.723 14.041-12.646 13.2-19.5 12.141-16.221-2.506-10.329-19.439-9.191-23.673z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M214.412 249.623c-5.085-2.297-4.646-4.829-2.98-5.932 1.16-.769 2.13.31 3.296.314.815.004 1.337-.757.741-1.263-.604-.513-2.236-.862-2.367-1.022-.852-1.061.656-2.215 1.354-3.427.917-1.597-.178-2.723-1.368-1.593-2.057 1.952-1.662 4.147-4.065 1.69-3.754-3.833-6.636-1.553-2.769.761 2.537 1.516 3.719 9.036-.752 8.696-1.379-.106-1.885 1.03-1.373 1.816 1.091 1.671 3.445-.685 5.16-.45 1.334.183 2.127 1.597 3.238 2.197 1.637.885 3.891-.881 1.885-1.787z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 230.125 248.322)"
          >
            38
        </text>
          <circle
            cx="209.661"
            cy="243.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="x"
            cx="77.552"
            cy="-47.89"
            r="17.786"
            className="bg"
            gradientTransform="matrix(-1 0 0 1.0853 287.392 327.557)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#x)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M217.028 261.167c-4.339-1.389-6.607-1.836-11.644-2.5-16.775-2.213-17.474 27.646-11.326 32.684 3.241 2.657 18.279 6.043 23.719 2.483 12.76-8.353 6.165-30.455-.749-32.667z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M209.697 279.932c-2.725-.948-1.88-4.253 2.123-5.289 2.896-.748 1.679-4.186.278-2.541-4.264 5.01-4.071-2.217-6.736-2.425-1.106-.086-1.7.584.658 3.247 1.74 1.967 1.465 5.584-2.735 5.8-1.774.092-1.792 1.923-.018 2.225 1.221.206 2.699-.096 2.745 1.272.098 2.94.59 3.461 2.129.84.962-1.64 10.278-.088 1.556-3.129z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 232.125 282.322)"
          >
            37
        </text>
          <circle
            cx="208.661"
            cy="277.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="y"
            cx="87.377"
            cy="-471.692"
            r="18.772"
            className="bg"
            gradientTransform="matrix(-.963 -.1029 -.1255 1.1745 232.345 876.42)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#y)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M214.599 297.833c-8.774-2.116-21.087-2.569-25.75 5.125-2.817 4.647-5.107 20.467-1.568 24.5 4.497 5.125 21.569 8.172 27.193 5.125 13.192-7.154 9.971-32.375.125-34.75z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M213.73 317.148c.494-1.256-2.101-1.57-3.281-2.225-2.491-1.376-3.213-4.127-2.398-7.374-.999 1.217-1.593 3.815-2.401 4.271-2.215 1.246-9.675-2.531-2.975 1.681 3.779 2.374.718 4.764 2.449 6.338 3.654-5.42 8.286-1.879 8.606-2.691z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 230.125 320.322)"
          >
            36
        </text>
          <circle
            cx="206.661"
            cy="314.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="z"
            cx="70.785"
            cy="-1082.48"
            r="15.157"
            className="bg"
            gradientTransform="matrix(-.9447 -.2135 -.2238 .9906 24.49 1433.59)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#z)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M211.487 352.513c1.564-6.229-1.638-10.18-3.455-12.259-2.858-3.271-3.711-5.898-8.59-6.369-5.151-.497-9.502.856-12.593 4.073s-4.818 10.799-2.649 13.89c4.524 6.446 12.645 8.274 18.572 7.542 3.832-.473 7.715-2.887 8.715-6.877z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M191.754 349.332c1.165-.305 1.941-.331 2.761-1.307 1.755-2.087 1.817-6.118 1.281-8.201-.288-1.116 1.108-1.346 1.794.288.431 1.024 1.612.343 2.903.148 2.057-.308 3.643 1.009 1.48 1.765-5.188 1.813-6.307 4.941-5.164 7.43 1.404 3.065.314 3.918-.642 3.18-1.103-.854-.66-2.873-4.155-1.977-1.992.509-1.924-.895-.258-1.326z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 218.125 355.322)"
          >
            35
        </text>
          <circle
            cx="197.661"
            cy="345.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="A"
            cx="31.794"
            cy="-975.93"
            r="15.287"
            className="bg"
            gradientTransform="matrix(-.8971 -.365 -.3827 .9407 -156.687 1299.987)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#A)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M199.099 377.958c3.057-5.647.392-10.123-1.531-14.02-1.719-3.48-2.739-3.072-7.057-5.397-4.319-2.324-10.962 1.875-14.537 4.542-3.577 2.668-6.438 5.975-4.322 9.104 2.114 3.129 11.757 12.646 17.697 12.021 5.942-.624 8.287-3.546 9.75-6.25z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M189.071 367.942c-.474 2.618-4.02 5.731-6.483 7.058-1.391.746-.57 2.133 1.656 1.211 1.332-.551 1.578 1.023 2.396 2.286 1.345 2.073 1.933 1.579 1.022-1.015-1.643-4.677 1.354-8.06 4.071-8.928 3.104-.995 2.94-2.179 1.816-2.346-1.314-.195-2.477 1.295-4.123-1.458-.896-1.498-1.923-.698-1.179.595.534.924 1.032 1.445.824 2.597z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 205.125 387.322)"
          >
            34
        </text>
          <circle
            cx="189.661"
            cy="371.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="B"
            cx="-59.385"
            cy="-845.729"
            r="14.602"
            gradientTransform="matrix(-.7803 -.5737 -.6016 .8182 -381.212 1049.002)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#B)"
            d="M182.688 400.504c7.927-9.033 2.622-13.958-.996-17.27-3.615-3.312-10.04-11.048-16.988-9.833-4.396.77-3.225 15.756-1.685 19.049 1.601 3.421 2.331 9.974 7.923 12.074 3.599 1.351 9.719-1.707 11.746-4.02z"
          ></path>
          <radialGradient
            id="C"
            cx="-59.266"
            cy="-3952.471"
            r="9.052"
            fx="-65.264"
            fy="-3952.197"
            gradientTransform="matrix(-.7803 -.5737 -1.6779 2.2821 -6503.678 9376.145)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#C)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M182.688 400.417c7.927-9.033 2.622-13.958-.996-17.27-3.615-3.312-12.194-11.577-16.988-9.745-3.417 1.307-3.188 9.931-2.354 15.816.53 3.739 3.001 13.118 8.593 15.219 3.598 1.351 9.718-1.708 11.745-4.02z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 189.46 410.108)"
          >
            33
        </text>
          <circle
            cx="175.661"
            cy="392.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="D"
            cx="-315.988"
            cy="-1137.956"
            r="11.219"
            gradientTransform="matrix(-.3403 -.9337 1.1315 -.5784 1336.993 -551.445)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#D)"
            d="M148.342 397.771c.4 5.514-1.133 10.604 1.258 13.344s2.492 2.262 8.09 1.059c7.964-1.712 12.19-7.529 8.896-11.912-3.297-4.386-7.183-8.104-9.821-10.966s-3.819-1.722-7.302-.433c-1.609.595-1.52 3.394-1.121 8.908z"
          ></path>
          <radialGradient
            id="E"
            cx="-316.965"
            cy="-4117.025"
            r="6.687"
            fx="-321.396"
            fy="-4116.822"
            gradientTransform="matrix(-.3403 -.9337 6.6632 -3.4059 27482.086 -13915.156)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#E)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M148.604 396.333c.4 5.514-.062 7.506.278 12.533.245 3.63 3.212 4.511 8.808 3.307 7.966-1.713 11.987-6.798 8.692-11.182-3.298-4.383-5.611-6.89-8.25-9.75-2.639-2.859-3.402-4.557-6.875-3.25-3.473 1.307-3.053 2.829-2.653 8.342z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 165.46 424.108)"
          >
            32
        </text>
          <circle
            cx="156.661"
            cy="402.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="F"
            cx="-545.824"
            cy="-785.707"
            r="9.152"
            gradientTransform="matrix(.0204 -1.2463 -1.2181 -.0766 -806.274 -334.76)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#F)"
            d="M143.789 398.669c2.195 5.316 5.331 9.961 4.377 13.078-.905 2.953-4.464 3.972-8.787 4.139-5.61.217-8.41-3.313-8.061-7.45.375-4.438 2.104-9.305 2.719-12.791.65-3.692 1.402-4.712 4.442-4.964 3.201-.265 3.019 2.442 5.31 7.988z"
          ></path>
          <radialGradient
            id="G"
            cx="-546.941"
            cy="-3918.508"
            r="5.414"
            fx="-550.528"
            fy="-3918.344"
            gradientTransform="matrix(.0204 -1.2463 -9.9756 -.6276 -38938.707 -2734.112)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#G)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M143.789 398.669c1.724 5.498 5.336 9.951 4.381 13.066-.904 2.954-4.466 3.974-8.788 4.144-5.611.215-8.411-3.313-8.061-7.456.375-4.434 2.104-9.3 2.718-12.789.649-3.693 1.403-4.714 4.443-4.966 3.201-.264 3.513 2.274 5.307 8.001z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="11.737"
            transform="matrix(1.0224 0 0 1 139.46 431.108)"
          >
            31
        </text>
          <circle
            cx="139.661"
            cy="407.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="H"
            cx="-540.758"
            cy="-868.026"
            r="9.152"
            gradientTransform="matrix(-.0204 -1.2463 1.2181 -.0766 1168.023 -334.76)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#H)"
            d="M117.583 398.664c-2.195 5.315-5.331 9.96-4.377 13.077.906 2.953 4.465 3.972 8.788 4.139 5.61.218 8.411-3.313 8.061-7.45-.375-4.438-2.105-9.305-2.72-12.791-.65-3.692-1.401-4.712-4.442-4.964-3.202-.266-3.018 2.441-5.31 7.989z"
          ></path>
          <radialGradient
            id="I"
            cx="-541.874"
            cy="-3964.964"
            r="5.414"
            fx="-545.462"
            fy="-3964.799"
            gradientTransform="matrix(-.0204 -1.2463 9.9756 -.6276 39663.605 -2756.959)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#I)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M117.583 398.664c-1.723 5.497-5.336 9.95-4.38 13.065.904 2.954 4.465 3.974 8.788 4.144 5.611.215 8.411-3.313 8.06-7.455-.375-4.435-2.104-9.301-2.718-12.79-.65-3.692-1.403-4.714-4.444-4.966-3.201-.264-3.512 2.273-5.306 8.002z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(113.793 431.334)"
          >
            41
        </text>
          <circle
            cx="121.661"
            cy="407.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="J"
            cx="-362.383"
            cy="-1063.352"
            r="11.233"
            gradientTransform="matrix(.3403 -.9337 -1.1315 -.5784 -975.244 -551.445)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#J)"
            d="M113.356 398.141c-.4 5.514.279 10.755-1.195 12.301-2.51 2.632-3.23 2.852-8.828 1.648-7.963-1.712-11.62-6.716-8.325-11.099 3.297-4.386 6.98-8.835 9.619-11.696s4.066-2.254 7.301-.433c2.168 1.221 1.828 3.765 1.428 9.279z"
          ></path>
          <radialGradient
            id="K"
            cx="-363.271"
            cy="-4074.829"
            r="6.692"
            fx="-367.705"
            fy="-4074.626"
            gradientTransform="matrix(.3403 -.9337 -6.6632 -3.4059 -26923.78 -13814.685)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#K)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M113.508 396.115c-.4 5.514-.66 7.725-1 12.752-.245 3.63-3.212 4.511-8.808 3.307-7.966-1.713-11.987-6.798-8.692-11.182 3.298-4.383 5.611-6.89 8.25-9.75 2.639-2.859 3.402-4.557 6.875-3.25 3.474 1.306 3.776 2.609 3.375 8.123z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(84.356 423.334)"
          >
            42
        </text>
          <circle
            cx="104.661"
            cy="402.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="L"
            cx="-143.781"
            cy="-904.741"
            r="14.602"
            gradientTransform="matrix(.7803 -.5737 .6016 .8182 742.96 1049.002)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#L)"
            d="M77.703 400.638c-7.928-9.033-2.622-13.958.995-17.27 3.616-3.312 10.041-11.048 16.989-9.833 4.396.77 3.225 15.756 1.685 19.049-1.601 3.421-2.331 9.974-7.923 12.074-3.599 1.351-9.72-1.707-11.746-4.02z"
          ></path>
          <radialGradient
            id="M"
            cx="-143.665"
            cy="-3985.779"
            r="9.052"
            fx="-149.663"
            fy="-3985.504"
            gradientTransform="matrix(.7803 -.5737 1.6779 2.2821 6885.81 9403.87)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.261" stopColor="#E7F2FB"></stop>
            <stop offset="0.302" stopColor="#E9F3FB"></stop>
            <stop offset="0.696" stopColor="#F9FCFE"></stop>
            <stop offset="1" stopColor="#FFF"></stop>
          </radialGradient>
          <path
            fill="url(#M)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M77.703 400.55c-7.928-9.033-2.622-13.958.995-17.27 3.616-3.312 12.195-11.577 16.989-9.745 3.417 1.307 3.188 9.931 2.354 15.816-.53 3.739-3 13.118-8.592 15.219-3.599 1.351-9.72-1.707-11.746-4.02z"
            className="regular stroke"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(60.69 410.334)"
          >
            43
        </text>
          <circle
            cx="86.661"
            cy="391.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="N"
            cx="-65.144"
            cy="-1013.543"
            r="15.288"
            className="bg"
            gradientTransform="matrix(.8971 -.365 .3827 .9407 518.435 1299.987)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#N)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M61.292 377.958c-3.057-5.647-.392-10.123 1.532-14.02 1.718-3.48 2.739-3.072 7.057-5.397 4.319-2.324 10.961 1.875 14.537 4.542 3.577 2.668 6.438 5.975 4.323 9.104-2.114 3.129-11.757 12.646-17.698 12.021-5.943-.624-8.289-3.546-9.751-6.25z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M71.32 367.942c.474 2.618 4.02 5.731 6.483 7.058 1.391.746.57 2.133-1.656 1.211-1.332-.551-1.578 1.023-2.396 2.286-1.345 2.073-1.933 1.579-1.022-1.015 1.643-4.677-1.354-8.06-4.071-8.928-3.104-.995-2.94-2.179-1.816-2.346 1.314-.195 2.477 1.295 4.123-1.458.896-1.498 1.923-.698 1.179.595-.534.924-1.032 1.445-.824 2.597z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(43.734 387.322)"
          >
            44
        </text>
          <circle
            cx="71.661"
            cy="371.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="O"
            cx="-31.297"
            cy="-1104.468"
            r="15.157"
            className="bg"
            gradientTransform="matrix(.9447 -.2135 .2238 .9906 337.258 1433.59)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#O)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M48.904 352.527c-1.564-6.229 1.637-10.181 3.455-12.26 2.858-3.271 3.71-5.898 8.59-6.369 5.151-.497 9.501.856 12.592 4.073s4.819 10.799 2.649 13.89c-4.524 6.446-12.644 8.274-18.572 7.542-3.831-.474-7.714-2.887-8.714-6.876z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M68.636 349.344c-1.165-.305-1.941-.331-2.761-1.307-1.755-2.087-1.817-6.118-1.281-8.201.288-1.116-1.108-1.346-1.794.288-.431 1.024-1.612.343-2.903.148-2.057-.308-3.643 1.009-1.48 1.765 5.188 1.813 6.307 4.941 5.164 7.431-1.404 3.064-.314 3.917.642 3.179 1.103-.854.66-2.873 4.155-1.977 1.993.51 1.924-.894.258-1.326z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(29.69 355.334)"
          >
            45
        </text>
          <circle
            cx="61.661"
            cy="346.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="P"
            cx="-16.686"
            cy="-480.809"
            r="18.772"
            className="bg"
            gradientTransform="matrix(.963 -.1029 .1255 1.1745 129.404 876.42)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#P)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M45.792 297.833c8.774-2.116 21.087-2.569 25.75 5.125 2.817 4.647 5.107 20.467 1.568 24.5-4.497 5.125-21.569 8.172-27.193 5.125-13.192-7.154-9.972-32.375-.125-34.75z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M46.661 317.148c-.494-1.256 2.101-1.57 3.281-2.225 2.491-1.376 3.213-4.127 2.398-7.374.999 1.217 1.593 3.815 2.401 4.271 2.215 1.246 9.675-2.531 2.975 1.681-3.779 2.374-.718 4.764-2.449 6.338-3.654-5.42-8.286-1.879-8.606-2.691z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(20.69 320.334)"
          >
            46
        </text>
          <circle
            cx="53.661"
            cy="315.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="Q"
            cx="-23.806"
            cy="-47.89"
            r="17.787"
            className="bg"
            gradientTransform="matrix(1 0 0 1.0853 74.356 327.557)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#Q)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M43.363 261.167c4.339-1.389 6.608-1.836 11.644-2.5 16.775-2.213 17.474 27.646 11.326 32.684-3.241 2.657-18.28 6.043-23.72 2.483-12.759-8.353-6.164-30.455.75-32.667z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M50.694 279.932c2.725-.948 1.88-4.253-2.123-5.289-2.896-.748-1.679-4.186-.278-2.541 4.264 5.01 4.071-2.217 6.736-2.425 1.106-.086 1.7.584-.658 3.247-1.74 1.967-1.465 5.584 2.735 5.8 1.774.092 1.792 1.923.018 2.225-1.221.206-2.699-.096-2.745 1.272-.098 2.94-.59 3.461-2.129.84-.962-1.64-10.279-.088-1.556-3.129z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(19.69 282.334)"
          >
            47
        </text>
          <circle
            cx="49.661"
            cy="277.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <g>
          <radialGradient
            id="R"
            cx="-44.05"
            cy="-1200.713"
            r="15.186"
            className="bg"
            gradientTransform="matrix(.9804 -.1969 .2464 1.2268 389.502 1705.983)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.708" stopColor="#FFFBFA"></stop>
            <stop offset="0.849" stopColor="#F6F8FA"></stop>
            <stop offset="1" stopColor="#E7F2FB"></stop>
          </radialGradient>
          <path
            fill="url(#R)"
            stroke="#B4C1CE"
            strokeMiterlimit="10"
            d="M66.636 233c-1.666-6.192-9.842-6.746-18.47-5-8.627 1.745-10.828 11.571-10.22 16.532 1.723 14.041 12.645 13.2 19.5 12.141 16.221-2.506 10.329-19.439 9.19-23.673z"
            className="stroke"
          ></path>
          <path
            fill="#E7F2FB"
            d="M45.979 249.623c5.085-2.297 4.646-4.829 2.981-5.932-1.161-.769-2.131.31-3.297.314-.814.004-1.336-.757-.74-1.263.604-.513 2.236-.862 2.367-1.022.852-1.061-.656-2.215-1.354-3.427-.917-1.597.178-2.723 1.368-1.593 2.057 1.952 1.662 4.147 4.065 1.69 3.753-3.833 6.636-1.553 2.769.761-2.537 1.516-3.719 9.036.752 8.696 1.379-.106 1.885 1.03 1.373 1.816-1.091 1.671-3.445-.685-5.16-.45-1.333.183-2.127 1.597-3.238 2.197-1.637.885-3.892-.881-1.886-1.787z"
            className="dent"
          ></path>
          <text
            fill="#ACB3BF"
            className="main-caption"
            fontSize="12"
            transform="translate(21.69 248.333)"
          >
            48
        </text>
          <circle
            cx="49.661"
            cy="243.978"
            r="4.442"
            fill="transparent"
            className="indication"
          ></circle>
        </g>
        <circle
          cx="67.94"
          cy="183.104"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="69.94"
          cy="149.604"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="73.94"
          cy="113.104"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="74.94"
          cy="96.604"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="82.94"
          cy="77.453"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="93.94"
          cy="60.104"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="107.94"
          cy="52.104"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="129.94"
          cy="45.104"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="151.939"
          cy="52.104"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="164.939"
          cy="60.104"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="176.319"
          cy="77.453"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="183.939"
          cy="96.604"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="186.939"
          cy="113.104"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="190.939"
          cy="149.604"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="192.706"
          cy="183.104"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="189.661"
          cy="258.399"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="187.058"
          cy="293.87"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="181.904"
          cy="332.786"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="175.661"
          cy="353.676"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="165.598"
          cy="366.51"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="154.598"
          cy="378.235"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="144.288"
          cy="383.063"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="131.288"
          cy="385.063"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="118.495"
          cy="383.063"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="107.553"
          cy="378.235"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="95.487"
          cy="366.51"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="83.448"
          cy="353.676"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="78.487"
          cy="332.786"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="72.58"
          cy="293.87"
          r="3.828"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
        <circle
          cx="70.276"
          cy="258.399"
          r="3.827"
          fill="transparent"
          stroke="transparent"
          strokeMiterlimit="10"
        ></circle>
      </svg>

    </Styled.TeethModel>
  );
}

export default TeethModel;


const Styled = {
  TeethModel: styled.div`
    &{
      .teeth_svg{
        border:1px solid #eee;
         path[stroke]:hover{
        }
      }
      circle.__teethModel__circle{
        cursor: pointer;
        /* stroke:orange; */
        &.on{
          fill:${color.blue}
        }
      }
      .__teethModel__in{
        cursor: pointer;
      }
      .__teethModel__outer{
        cursor: pointer;
        /* &:hover{
          stroke:${color.blue};
          stroke-width:2px;
        } */
        &.fixed{
          stroke:${color.blue};
          stroke-width:2px;
        }
        &.on{
          stroke:${color.blue};
          stroke-width:2px;
        }
      }
      .__teethModel__bridge{
        cursor: pointer;
        fill:#eee;
        &:hover{
          fill:${color.gray_border};
        }
        &.on{
          fill:${color.blue};
        }
      }
      
    }
  `
}





  // const dragStart = (e) => {
  //   this.dragged = e.currentTarget;
  //   e.dataTransfer.effectAllowed = 'move';
  //   e.dataTransfer.setData('text/html', this.dragged);
  // }
  // const dragEnd = (e) => {
  //   this.dragged.style.display = 'block';
  //   this.dragged.parentNode.removeChild(placeholder); // update state 
  //   var data = this.state.colors;
  //   var from = Number(this.dragged.dataset.id);
  //   var to = Number(this.over.dataset.id);
  //   if (from < to) to--;
  //   data.splice(to, 0, data.splice(from, 1)[0]);
  //   this.setState({
  //     colors: data
  //   });
  // }
  // const dragOver = (e) => {
  //   e.preventDefault();
  //   this.dragged.style.display = "none";
  //   if (e.target.className === 'placeholder') return;
  //   this.over = e.target;
  //   e.target.parentNode.insertBefore(placeholder, e.target);
  // }