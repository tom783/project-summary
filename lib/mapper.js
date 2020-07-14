
//NOTE: 공통으로 사용하는 변수값 관리
export const mapper = {
  companyName: 'companyName',
  sender: "Owner",
  receiver: "Partner",
  localStorage: {
    worksCurrentCode: "worksCurrentCode",
    worksCurrenctOnlyChecked: "worksCurrenctOnlyChecked"
  },
  pageUrl: {
    index: "/",
    login: '/auth/signin',
    signUp: '/auth/signup',
    resetPassword: "/auth/reset/password",
    logout: '/auth/logout'
  },
  casePage: {
    memo: {
      flag: {
        complete: 5
      }
    }
  },
  worksPage: {
    password:"",
    worksFlag: {
      create: 0,
      working: 1,
      upload: 2,
      read: 3,
      download: 4,
      complete: 5,
    }
  },
  EVENT:{
    email:{
      index:'email',
      view:"Email"
    },
  },
  HANDLEEVENTTYPE: {
    sendEmail: 'sendEmail',
    authCodeCheck: 'authCodeCheck',
    resetPassword: 'resetPassword',
    eyeIcon: 'eyeIcon',
    allSelect: 'allSelect',
    singleSelect: 'singleSelect',
    deleteMessage: 'deleteMessage',
    readMessage: 'readMessage',
    acceptProject: 'acceptProject',
    denyProject: 'denyProject',
    refresh: 'refresh',
    link: 'link',
    workHidden: 'workHidden',
    changePartner: 'changePartner',
    getPartner: 'getPartner',
    getMyPartner: 'getMyPartner',
    addPartner: 'addPartner',
    defaultPartner: 'defaultPartner',
    passwordChange: 'passwordChange',
    deletePartner: 'deletePartner',
    storeType: 'storeType',
    profile: 'profile',
    licence: 'licence',
    isPublicCheck: 'isPublicCheck',
    storeNameTxt: 'storeNameTxt',
    managerTxt: 'managerTxt',
    licenceTxt: 'licenceTxt',
    phoneTxt: 'phoneTxt',
    addressTxt: 'addressTxt',
    businessLicence: 'businessLicence',
    fileDelete: 'fileDelete',
    searchCheckbox: 'searchCheckbox',
    modalGetInfo: 'modalGetInfo',
    dim: 'dim',
    selected: 'selected',
    search: 'search',
    workspaceModal: 'workspaceModal',
    updateWorkSpace: 'updateWorkSpace',
    sync: 'sync',
  },
  MESSAGETYPE: {
    link: 9,
    decision: 5,
  },
  BRAND: {
    logo: {
      index: 'logo',
      text: 'DOF Sync',
    }
  },
  WORKSSEARCHTYPE: {
    filter: {
      filterTopStatusList: [
        {
          id: 0,
          value: "create",
          text: "Create",
        },
        {
          id: 1,
          value: "working",
          text: "Working",
        },
        {
          id: 2,
          value: "upload",
          text: "Upload",
        },
        {
          id: 3,
          value: "read",
          text: "Read",
        },
        {
          id: 4,
          value: "Downloaded",
          text: "Downloaded",
        },
        {
          id: 5,
          value: "completed",
          text: "Completed",
        },
      ],

      filterTypeBtnList: [
        {
          id: 1,
          value: "owner",
          text: "Owner"
        },
        {
          id: 2,
          value: "partner",
          text: "Partner"
        },
      ],

      filterSortBtnList: [
        {
          id: 0,
          value: "Not Include a hidden list",
          text: "Not Include a hidden list"
        },
        {
          id: 1,
          value: "only Hidden",
          text: "Only Hidden"
        },
        {
          id: 2,
          value: "include a hidden list",
          text: "Include a hidden list"
        },
      ],
      
    },
    search: {
      base: {
        id: "0",
        text: 'All'
      },
      patient: {
        id: "1",
        text: "Patient's Name"
      },
      owner: {
        id: "2",
        text: "Owner's Name"
      },
      partner: {
        id: "3",
        text: "Partner's Name"
      },
      caseId: {
        id: "4",
        text: "Case Id"
      }
    }
  },
  PARTNERSEARCHTYPE: {
    search: {
      base: {
        id: "1",
        text: '고유번호'
      },
      company: {
        id: "2",
        text: '업체명(대표자)'
      },
      name: {
        id: "3",
        text: '이름'
      },
    },
    typeList : {
      base: {
        id: 0,
        text: "All",
      },
      clinic: {
        id: 1,
        text: "클리닉",
      },
      lab: {
        id: 2,
        text: "기공소",
      },
    }
  }
}