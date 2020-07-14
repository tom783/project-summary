
import { handleActions } from 'redux-actions';
import * as actions from 'store/actions';
import produce from 'immer';


let initialState = {
  landing: true,
  error: {
    loading: false,
    message: null
  },
  isNetworkConnect: true,
  wsConnect: false,
  blocking: false,
  socket: null,
  language: "en",
  scrollbars: {
    action: {
      name: "",
      value: ""
    }
  },
  indication: {
    pending: null,
    success: null,
    failure: null,
    indicationFormat: {}
  },
}




console.log(actions.BASE_NETWORK_CONNECT);
export default handleActions({
  [actions.BASE_EXIT_LANDING]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.landing = false;
    })
  },
  [actions.BASE_ENTER_LANDING]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.landing = true;
    })
  },
  // NETWORK
  [actions.BASE_NETWORK_CONNECT]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.isNetworkConnect = diff.value;
    })
  },

  //MESSAGE GET
  [actions.BASE_MESSAGE_GET]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.error.message = diff.value;
    })
  },

  // NOTE: LANGUAGE CHANGE
  [actions.BASE_LANGUAGE_CHANGE]: (state, { payload: diff }) => {
    return produce(state, draft => {
      console.log(`BASE_LANGUAGE_CHANGE `, diff);
      draft.language = diff;
    })
  },

  // NOTE: LANGUAGE CHANGE
  [actions.BASE_SCROLLBARS_CONTROL]: (state, { payload: diff }) => {
    return produce(state, draft => {
      let { payload, type, name } = diff;
      if (type === 'update') {
        if (name === 'reset') {
          payload = { name: 'scrollTop', value: '0' }
        }
        draft.scrollbars.action = payload;
      }
    })
  },



  // NOTE: Get Indication Format
  [actions.GET_INDICATION_FORMAT.INIT]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.indication.indicationFormat = initialState.indication.indicationFormat;
    })
  },
  [actions.GET_INDICATION_FORMAT.PENDING]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.indication.pending = true;
      draft.indication.success = false;
      draft.indication.failure = false;
    })
  },
  [actions.GET_INDICATION_FORMAT.SUCCESS]: (state, { payload: diff }) => {
    return produce(state, draft => {
      // console.log(diff, '@^@^');
      draft.indication.pending = false;
      draft.indication.success = true;
      draft.indication.failure = false;
      draft.indication.indicationFormat = diff.indicationFormat
    })
  },
  [actions.GET_INDICATION_FORMAT.FAILURE]: (state, { payload: diff }) => {
    return produce(state, draft => {
      draft.indication.pending = false;
      draft.indication.success = false;
      draft.indication.failure = true;
    });
  },

// NOTE: Get Indication Format
[actions.BASE_INDICATION_ADD.INIT]: (state, { payload: diff }) => {
  return produce(state, draft => {
    // draft.indication.indicationFormat = initialState.indication.indicationFormat;
  })
},
[actions.BASE_INDICATION_ADD.PENDING]: (state, { payload: diff }) => {
  return produce(state, draft => {
    // draft.indication.pending = true;
    // draft.indication.success = false;
    // draft.indication.failure = false;
  })
},
[actions.BASE_INDICATION_ADD.SUCCESS]: (state, { payload: diff }) => {
  return produce(state, draft => {
    // console.log(diff, '@^@^');
    // draft.indication.pending = false;
    // draft.indication.success = true;
    // draft.indication.failure = false;
    // draft.indication.indicationFormat = diff.indicationFormat
  })
},
[actions.BASE_INDICATION_ADD.FAILURE]: (state, { payload: diff }) => {
  return produce(state, draft => {
    // draft.indication.pending = false;
    // draft.indication.success = false;
    // draft.indication.failure = true;
  });
},
  


  // [actions.WS_CONNECTED]:(state,{payload:diff})=>{
  //   return produce(state,draft=>{
  //     console.log('\n/** WS_CONNECTED');
  //     draft.wsConnect = true;
  //     draft.socket = diff;
  //   })
  // },
  // [actions.WS_BLOCKING]:(state,{payload:diff})=>{
  //   return produce(state,draft=>{
  //     console.log('\n/** WS_BLOCKING');
  //     draft.blocking = true;
  //   })
  // },
  // [actions.WS_UNBLOCKING]:(state,{payload:diff})=>{
  //   return produce(state,draft=>{
  //     console.log('\n/** WS_UNBLOCKING');
  //     draft.blocking = false;
  //   })
  // },
  // [actions.WS_DISCONNECTED]:(state,{payload:diff})=>{
  //   return produce(state,draft=>{
  //     console.log('\n/** WS_DISCONNECTED');
  //     draft.wsConnect =false;
  //     draft.blocking = true;
  //   })
  // },
  // [actions.WS_ERRORED]:(state,{payload:diff})=>{
  //   return produce(state,draft=>{
  //     console.log('\n/** WS_ERRORED');
  //     draft.wsConnect =false;
  //     draft.blocking = true;
  //     draft.error = true;
  //   })
  // },

}, initialState)




const testIndicationFormat = {
  "indicationFormat": {
    "indication": [
      {
        "seq": 1,
        "name": "크라운",
        "list": [
          {
            "seq": 11,
            "name": "풀 크라운",
            "color": "#9F00A7",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 12,
            "name": "Cut-back 코핑",
            "color": "#33756B",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 13,
            "name": "프레스 크라운",
            "color": "#ABA900",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11
            ]
          },
          {
            "seq": 14,
            "name": "단순 코핑",
            "color": "#008000",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              8,
              9,
              10,
              11
            ]
          },
          {
            "seq": 15,
            "name": "Preform 크라운",
            "color": "#E01976",
            "meterialList": [
              0
            ]
          },
          {
            "seq": 16,
            "name": "Provisional 크라운",
            "color": "#6E04FF",
            "meterialList": [
              6,
              7,
              12
            ]
          }
        ]
      },
      {
        "seq": 2,
        "name": "폰틱",
        "list": [
          {
            "seq": 21,
            "name": "아나토믹 폰틱",
            "color": "#72001E",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              9,
              12
            ]
          },
          {
            "seq": 22,
            "name": "Cut-back 폰틱",
            "color": "#B51B44",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              9,
              12
            ]
          },
          {
            "seq": 23,
            "name": "프레스 폰틱",
            "color": "#52A0D9",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              9
            ]
          },
          {
            "seq": 24,
            "name": "Provisional 폰틱",
            "color": "#B871A8",
            "meterialList": [
              6,
              7,
              12
            ]
          }
        ]
      },
      {
        "seq": 3,
        "name": "인레이",
        "list": [
          {
            "seq": 31,
            "name": "인레이/온레이",
            "color": "#335C15",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 32,
            "name": "단순 인레이",
            "color": "#0A54BD",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 33,
            "name": "비니어",
            "color": "#25879A",
            "meterialList": [
              6,
              12
            ]
          }
        ]
      },
      {
        "seq": 4,
        "name": "고급보철",
        "list": [
          {
            "seq": 41,
            "name": "바 기둥",
            "color": "#664E0D",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              12,
              13
            ]
          },
          {
            "seq": 42,
            "name": "바 연결부분",
            "color": "#5C009C",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              13
            ]
          },
          {
            "seq": 43,
            "name": "어태지먼트",
            "color": "#002E3D",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              13
            ]
          },
          {
            "seq": 44,
            "name": "이중관(내관)",
            "color": "#B87471",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              13
            ]
          }
        ]
      },
      {
        "seq": 5,
        "name": "왁스업",
        "list": [
          {
            "seq": 51,
            "name": "아나토믹 왁스업",
            "color": "#1FC173",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 52,
            "name": "Cut-back 왁스업",
            "color": "#494949",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12
            ]
          },
          {
            "seq": 53,
            "name": "왁스업 폰틱",
            "color": "#3F3993",
            "meterialList": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              12
            ]
          }
        ]
      },
      {
        "seq": 6,
        "name": "Appliances & Removables",
        "list": [
          {
            "seq": 61,
            "name": "풀덴쳐",
            "color": "#445274",
            "meterialList": [
              5,
              6,
              12
            ]
          },
          {
            "seq": 62,
            "name": "Partial framework",
            "color": "#445274",
            "meterialList": [
              5,
              6,
              12
            ]
          },
          {
            "seq": 63,
            "name": "바이트 스플린트",
            "color": "#445274",
            "meterialList": [
              6,
              12
            ]
          },
          {
            "seq": 64,
            "name": "바이트 스플린트(결손치)",
            "color": "#009BAD",
            "meterialList": [
              6,
              12
            ]
          }
        ]
      },
      {
        "seq": 7,
        "name": "기타",
        "list": [
          {
            "seq": 71,
            "name": "결손치",
            "color": "#FF1010",
            "meterialList": [
              0
            ]
          },
          {
            "seq": 72,
            "name": "인접치",
            "color": "#FCAE1B",
            "meterialList": [
              0
            ]
          },
          {
            "seq": 73,
            "name": "대합치",
            "color": "#F06400",
            "meterialList": [
              0
            ]
          }
        ]
      }
    ],
      "materialList": [
        {
          "idx": 0,
          "id": "0000",
          "code": "NULL",
          "name": "NULL"
        },
        {
          "idx": 1,
          "id": "1101",
          "code": "ZI",
          "name": "Zirconia"
        },
        {
          "idx": 2,
          "id": "1102",
          "code": "MLZI",
          "name": "Zirconia Multilayer"
        },
        {
          "idx": 3,
          "id": "1103",
          "code": "NP",
          "name": "NP Metal"
        },
        {
          "idx": 4,
          "id": "1104",
          "code": "NP_L",
          "name": "NP Metal (Laser)"
        },
        {
          "idx": 5,
          "id": "1105",
          "code": "WAX",
          "name": "Wax"
        },
        {
          "idx": 6,
          "id": "1106",
          "code": "PMMA",
          "name": "Acrylic/PMMA"
        },
        {
          "idx": 7,
          "id": "1107",
          "code": "COMP",
          "name": "Composite"
        },
        {
          "idx": 8,
          "id": "1108",
          "code": "HC",
          "name": "Hybrid Ceramic"
        },
        {
          "idx": 9,
          "id": "1109",
          "code": "LS2",
          "name": "Lithium Disilicate"
        },
        {
          "idx": 10,
          "id": "1110",
          "code": "GCER",
          "name": "Glass Ceramic"
        },
        {
          "idx": 11,
          "id": "1111",
          "code": "FSP",
          "name": "Feldspar"
        },
        {
          "idx": 12,
          "id": "1112",
          "code": "PROV_AD",
          "name": "3D Print"
        },
        {
          "idx": 13,
          "id": "1113",
          "code": "PEEK",
          "name": "PEEK"
        }
      ],
        "toothShadeList": [
          {
            "id": "A",
            "list": [
              {
                "seq": 1,
                "name": "A1"
              },
              {
                "seq": 2,
                "name": "A2"
              },
              {
                "seq": 3,
                "name": "A3"
              },
              {
                "seq": 4,
                "name": "A3.5"
              },
              {
                "seq": 5,
                "name": "A4"
              }
            ]
          },
          {
            "id": "B",
            "list": [
              {
                "seq": 6,
                "name": "B1"
              },
              {
                "seq": 7,
                "name": "B2"
              },
              {
                "seq": 8,
                "name": "B3"
              },
              {
                "seq": 9,
                "name": "B4"
              }
            ]
          },
          {
            "id": "C",
            "list": [
              {
                "seq": 10,
                "name": "C1"
              },
              {
                "seq": 11,
                "name": "C2"
              },
              {
                "seq": 12,
                "name": "C3"
              },
              {
                "seq": 13,
                "name": "C4"
              }
            ]
          },
          {
            "id": "D",
            "list": [
              {
                "seq": 14,
                "name": "D1"
              },
              {
                "seq": 15,
                "name": "D2"
              },
              {
                "seq": 16,
                "name": "D3"
              },
              {
                "seq": 17,
                "name": "D4"
              }
            ]
          }
        ],
          "implantList": [
            {
              "idx": 1,
              "type": "None"
            },
            {
              "idx": 2,
              "type": "SubstructureScan"
            },
            {
              "idx": 3,
              "type": "WithoutAbutmentManual"
            },
            {
              "idx": 4,
              "type": "WithoutAbutment"
            },
            {
              "idx": 5,
              "type": "CustomAbutmentManual"
            },
            {
              "idx": 6,
              "type": "CustomAbutment"
            }
          ]
  }
}