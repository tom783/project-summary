// import React, { useEffect, useRef, useCallback } from 'react';
// import jsonTeeth from './teethConfig.json';
// import styled from 'styled-components';
// import { color } from 'styles/__utils';
// import _ from 'lodash';
// import { useImmer } from 'use-immer';
// import cx from 'classnames';
// import uuid from 'react-uuid';
// import { useDrag } from 'react-dnd';
// import { useDrop } from 'react-dnd';

// import { 
//   log, 
//   findParent, 
//   convertObjectKeyToCamelCase, 
//   fixedNumbering ,
//   NUMBERING_CONFIG
// } from 'lib/library';


// function removeObjectAttrChildrenElement(obj) {
//   return _.omit(obj, ['children', 'element'])
// }
// // function hasClass(element, className) {
// //   return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
// // }



// console.warn = () => { };

// const toothIdName = "data-tooth-id";
// const JsonTeethModelState = {
//   clickedIdx: 0,
//   selected: {
//     id: null,
//     element: null,
//     g: null,
//     type: null,
//   },
//   viewSelectedId: null,
//   bridge: [],
//   items: [],
//   numberingType: 'fdi',
// }



// const isFixedItem = (info, targetId) => info.submitItems.some(item => item.teeth === targetId);

// const JsonTeethModel = React.memo(function JsonTeethModel(props) {
//   const [values, setValues] = useImmer(JsonTeethModelState);
//   const {
//     toothClick = () => { },
//     bridgeClick = () => { },
//     onClick = () => { },
//     svgId = uuid(),
//     info = {},
//     onlyView = false
//   } = props;
//   const svgRef = useRef(null);
//   const obj = jsonTeeth;
//   const Svg = obj.element;
//   const numberingType = values.numberingType;


//   const handleClick = config => {
//     const { e, type, value } = config;
//     const isToothType = type === 'tooth';
//     const isBridgeType = type === 'bridge';
//     const isNumberingType = type === 'numbering';
//     const isTypeViewIndication = type === 'viewIndicationPanel';
//     const target = e.target;
//     const targetInStroke = ['circle', 'path'].indexOf(target.nodeName) !== -1;

//     if (isNumberingType) {
//       setValues(draft => {
//         draft.numberingType = value;
//       })
//     }
//     if (isToothType && targetInStroke) { // tooth click
//       log('어쩃든 치아 클릭');
//       const findParentGtag = findParent(target, { "data-name": "tooth" });
//       const gTagDataToothId = findParentGtag.getAttribute(toothIdName);

//       if (values.selected.id !== +gTagDataToothId) {
//         // 클릭했을때 현재  tooth가 아니면
//         setValues(draft => {
//           draft.selected.id = +gTagDataToothId;
//           draft.selected.element = target;
//           draft.selected.g = findParentGtag;
//           draft.selected.type = 'tooth';
//         });
//       } else {
//         // 클릭 했을때 현재 tooth와 같을때          
//         setValues(draft => {
//           draft.selected.id = null;
//           draft.selected.element = null;
//           draft.selected.g = null;
//           draft.selected.type = null;
//         });
//       }
//     }
//     if (isBridgeType) { // bridge click
//       const bridgeId = e.target.getAttribute('data-bridge-id');
//       const hasBridge = values.bridge.indexOf(bridgeId) !== -1;
//       setValues(draft => {
//         draft.bridge = hasBridge
//           ? _.filter(values.bridge, item => item !== bridgeId)
//           : values.bridge.concat(bridgeId);
//       });
//     }
//     // 오직 뷰일때 패널 동기화
//     if (isTypeViewIndication) {
//       const findParentGtag = findParent(target, { "data-name": "tooth" });
//       const gTagDataToothId = findParentGtag.getAttribute(toothIdName);
//       setValues(draft => {
//         draft.viewSelectedId = +gTagDataToothId;
//         draft.selected.type = "view";
//       });
//     }
//     setValues(draft => {
//       draft.clickedIdx = values.clickedIdx + 1;
//     })
//   }

  
//   // Convert Bridge
//   let bridgeIdx = 0;
//   const bridgeList = _.map(obj.children, (item, idx) => {
//     if (item.element === 'circle') {
//       const Circle = item.element;
//       bridgeIdx += 1;
//       const bridgeId = `${fixedNumbering(bridgeIdx,2)}${fixedNumbering(bridgeIdx+1,2)}`;
//       const hasBridge = values.bridge.indexOf(bridgeId) !== -1;
//       return <Circle
//         {...removeObjectAttrChildrenElement(item)}
//         key={idx}
//         className={cx("__teethModel__bridge", { on: hasBridge })}
//         onClick={(e) => !onlyView && handleClick({ e, type: "bridge" })}
//         data-bridge-id={bridgeId}
//       />
//     }
//   });


//   const new_teeth_lower_list = _.map(info.teeth, item => {
//     return convertObjectKeyToCamelCase(item);
//   });
  
//   console.log(new_teeth_lower_list, 'new_teeth_lower_list');

//   // Convert Tooth
//   const toothList = _.map(obj.children, (item, idx) => {
//     const gTagToothId = +idx + 1;
//     const hasFixedItem = isFixedItem(info, gTagToothId);
//     let findItem = _.find(info.submitItems, item => item.teeth === gTagToothId);
//     if (onlyView === true) {
//       const findObject = _.find(new_teeth_lower_list, item => +item.number === gTagToothId);
//       if (findObject) {
//         findItem = {
//           custom: {
//             indication: {
//               seq: findObject.number,
//               color: findObject.color
//             }
//           }
//         }
//       }
//     }
//     if (item.element === 'g') {
//       const GTag = item.element;
//       const gChildren = item.children;
//       const hasCustomColorItem = findItem && findItem.custom.indication.color;
//       const GChildrenElements = _.map(gChildren, (gChildren_item, idx) => {
//         const radialGradient = gChildren_item.children;
//         if (radialGradient) {
//           const tmpInList = _.map(radialGradient, (radialGradient_item, idx) => {
//             const StopTag = radialGradient_item.element;
//             return (
//               <StopTag
//                 key={idx}
//                 {...removeObjectAttrChildrenElement(radialGradient_item)}
//               />
//             )
//           });
//           const TmpElement = gChildren_item.element;
//           return (
//             <TmpElement
//               {...removeObjectAttrChildrenElement(gChildren_item)}
//               key={idx}
//             >
//               {tmpInList}
//             </TmpElement>
//           )
//         } else {

//           // console.log(gChildren_item);
//           const TmpElement = gChildren_item.element;
//           const textContent = TmpElement === 'text' && gChildren_item.text;
//           const isOuterPath = gChildren_item.stroke;
//           const isInnerPath = !isOuterPath && TmpElement === 'path';
//           const isInnerCircle = TmpElement === 'circle';
//           // DEBUG: info 데이터로 색상 찍어보기
//           // const isCircleDot


//           return (
//             <TmpElement
//               {...removeObjectAttrChildrenElement(gChildren_item)}
//               key={idx}
//               children={textContent}
//               onClick={(e) => {
//                 if (hasCustomColorItem && onlyView) {
//                   return handleClick({ e, type: "viewIndicationPanel", value: item })
//                 } else {
//                   return !onlyView && handleClick({ e, type: "tooth" })
//                 }
//               }}
//               className={cx({
//                 __teethModel__outer: isOuterPath,
//                 __teethModel__inner: isInnerPath,
//                 __teethModel__inner_circle: isInnerCircle,
//                 opacity: findItem,
//                 cursor: hasCustomColorItem,
//               })}
//               style={{
//                 fill: hasCustomColorItem,
//               }}
//             />
//           )
//         }
//       });


//       return (
//         <GTag
//           key={idx}
//           data-tooth-id={gTagToothId}
//           data-name="tooth"
//           className={cx("__teeth__g", { fixed: hasFixedItem })}
//         >
//           {GChildrenElements}
//         </GTag>
//       )
//     }
//   });

//   // NOTE: init styled tooth click
//   useEffect(() => {
//     if (values.clickedIdx > 0) {
//       if (svgRef.current) {
//         _.map(svgRef.current.querySelectorAll('g'), item => {
//           const isNotCurrentGtag = +item.getAttribute(toothIdName) !== +values.selected.id;
//           if (isNotCurrentGtag) {
//             item.classList.remove('on');
//             // item.classList.remove('fixed');
//           } else {
//             item.classList.add('on');
//           }
//         })
//       }

//       if (values.selected.type === 'view') {
//         onClick && onClick({
//           type: "viewTeeth",
//           viewSelectedId: values.viewSelectedId,
//           numbering: numberingType
//         })
//       } else {
//         onClick && onClick({
//           type: "teeth",
//           tooth: values.selected,
//           bridge: values.bridge,
//           numbering: numberingType
//         })
//       }

//     }
//   }, [values.clickedIdx]);

//   // NOTE: type numbering
//   useEffect(() => {
//     if (numberingType) {
//       _.map(svgRef.current.querySelectorAll('text'), (item, idx) => {
//         item.textContent = NUMBERING_CONFIG[numberingType][idx]
//       });
//     }
//   }, [svgRef, numberingType]);

//   // NOTE: submitItem 변화 시 , 삭제했을때 현재 selected 을 날려줌
//   useEffect(() => {
//     const findSubmitItem = _.find(info.submitItems, item => item.teeth === values.selected.id);
//     if (!findSubmitItem) {
//       setValues(draft => {
//         draft.selected = JsonTeethModelState.selected;
//       })
//     }
//   }, [info.submitItems])


//   useEffect(() => {
//     setValues(draft => {
//       draft.bridge = info.bridge;
//     });
//   }, [info.bridge]);

//   // indication init
//   useEffect(() => {
//     setValues(draft => {
//       draft.numberingType = info.numberingType;
//     })
//   }, [])




//   // console.log(info.submitItems,'info.submitItems');
//   return (
//     <Styled.TeethModel onlyView={onlyView}>
//       {!onlyView &&
//         <div>
//           <button onClick={(e) => handleClick({ type: "numbering", value: "fdi", e })}>fdi</button>
//           <button onClick={(e) => handleClick({ type: "numbering", value: "palmer", e })}>palmer</button>
//           <button onClick={(e) => handleClick({ type: "numbering", value: "universal", e })}>universal</button>
//         </div>
//       }

//       {/* <div style={{ height: 750 }}> */}
//       <Svg {..._.omit(obj, ['children', 'element'])} id={svgId} ref={svgRef}>
//         {toothList}
//         {bridgeList}
//       </Svg>
//       {/* </div> */}
//     </Styled.TeethModel>
//   );
// });



// export default JsonTeethModel;


// const Styled = {
//   TeethModel: styled.div`
//     &{
//       position: relative;
//       border:1px solid #eee;
//       padding:25px;
//         ${({ onlyView }) => onlyView && `
//           -webkit-user-select: none;
//           -khtml-user-select: none;
//           -moz-user-select: none;
//           -o-user-select: none;
//           user-select: none;
//         ;`}
//       .teeth_svg{
//          path[stroke]:hover{
//         }
//       }
//       .cursor{
//         cursor: pointer;
//       }
//       text{
//         fill:#ACB3BF !important;
//       }
//       .__teethModel__inner_circle{
//         ${({ onlyView }) => !onlyView && `cursor: pointer;`}
//         &.on{
//           fill:${color.blue}
//         }
//         &.opacity{
//           fill-opacity:0;
//         }
//       }
//       .__teethModel__inner{
//         ${({ onlyView }) => !onlyView && `cursor: pointer;`}
//         &.opacity{
//           fill-opacity:0.2;
//         }
//       }
//       .__teethModel__outer{
//         ${({ onlyView }) => !onlyView && `cursor: pointer;`}
//         &.fixed{
//           stroke:${color.blue};
//           stroke-width:2px;
//         }
//         &.on{
//           stroke:${color.blue};
//           stroke-width:2px;
//         }
//         &.opacity{
//           fill-opacity:.3;
//         }

//       }
//       .__teeth__g{
//         &.fixed path[stroke]{
//           stroke:${color.blue};
//           stroke-width:2px;
//         }
//         &.on path[stroke]{
//           stroke:${color.blue};
//           stroke-width:2px;
//         }
//       }
//       .__teethModel__bridge{
//         ${({ onlyView }) => !onlyView && `fill:#eee;cursor: pointer;`}
//         &:hover{
//           /* fill:${color.gray_border}; */
//           ${({ onlyView }) => !onlyView && `fill:${color.gray_border}`}
//         }
//         &.on{
//           fill:${color.blue};
//         }
//       }
      
//     }
//   `
// }




// // const ItemTypes = {
// //   BOX: 'box',
// // }
// // const style = {
// //   border: '1px dashed gray',
// //   backgroundColor: 'white',
// //   padding: '0.5rem 1rem',
// //   marginRight: '1.5rem',
// //   marginBottom: '1.5rem',
// //   cursor: 'move',
// //   float: 'left',
// // }

// // const opacity = isDragging ? 0.4 : 1;
// // style={{ ...style, opacity }}
// // drag(drop(ref))
//   // let name="test"
//   // const [{ isDragging }, drag] = useDrag({
//   //   item: { name, type: ItemTypes.BOX },
//   //   end: (item, monitor) => {
//   //     const dropResult = monitor.getDropResult()
//   //     if (item && dropResult) {
//   //       log(`You dropped ${item.name} into ${dropResult.name}!`)
//   //     }
//   //   },
//   //   collect: (monitor) => ({
//   //     isDragging: monitor.isDragging(),
//   //   }),
//   // });

//   // const [{ canDrop, isOver }, drop] = useDrop({
//   //   accept: ItemTypes.BOX,
//   //   drop: () => ({ name: 'Dustbin1' }),
//   //   collect: (monitor) => ({
//   //     // isOver: monitor.isOver(),
//   //     // canDrop: monitor.canDrop(),
//   //   }),
//   // });
