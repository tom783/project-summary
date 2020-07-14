function Setting(config){
  
  const teethData = config.data;
  if(teethData){
    if(teethData.teeth == null){
      config.data.teeth = [];
    }
    if(teethData.bridge == null){
      config.data.bridge = [];
    }
  }else{
    config.data = {
      bridge :[],
      teeth:[]
    };
  }
  
  this.setting = {
    bridge: {
      color: {
        default: `#c6cbde50`,
        selected: `#596CB9`
      }
    },
    teethModelname: {
      bridge: 'teeth_bridge',
      tooth: 'teeth_tooth',
      outer: 'teeth_outer'
    },
    dataDefaultPreset: 'data-teeth-id',
    keyword: {
      bridge: 'b',
      tooth: 't',
      outer: "o"
    }
  }

  this.store = {
    type: 'fdi',
    dim: true,
    model: {
      tooth: [],
      bridge: [],
    },
    parameter: [],
    teeth: [],
    bridge: [],
    selectTeeth: [],
    selectBridge: [],
    current: {
      tooth: null
    },
    indication: {
      keysElm: [],
      valuesElm: []
    },
    copyBox: {},
    copyInfo:{},
    stepBox:{},
    saveIndex:0,
    tmpCurrent:null
  }
  this.store.type = this.config.teethModelType;

  this.vars = {};

  // set teeth type
  this.vars.FDI_TEETH_NUM = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48];
  this.vars.UNIVERSAL_TEETH_NUM = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  this.vars.PALMER_TEETH_NUM = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8];
  this.vars.NUMBERING_CONFIG = {
    palmer: this.vars.PALMER_TEETH_NUM,
    fdi: this.vars.FDI_TEETH_NUM,
    universal: this.vars.UNIVERSAL_TEETH_NUM
  };
  this.vars.basicToothTemplate = {
    number: null,
    color: null,
    indication: {
      group: null,
      value: null
    },
    parameter: {
      implant_number: 0,
      scan_a_pre_op_model: 0,
      scan_gingiva_separatly: 0,
      design_virtual_gingiva: 0
    },
    advanced: {
      minimul_thickness: null,
      gap_thickness_cement: null,
      beginning_cement_gap: null,
      end_cement_gap: null,
      add_spacing_axial: null,
      add_spacing_radial: null,
      horizontal_crown_margin: null,
      angled_crown_margin: null,
      angle: null,
      vertical_crown_margin: null,
      donot_block_out: null,
      add_occlusal_min_thickness: null,
      distance_to_antagonist: null,
      distance_to_neighbor: null,
      thickness_gingiva: null,
      cross_section_connector: null,
      color: null
    },
    front: {
      elm: null,
    }
  }

  this.vars.indicationList = [{
      id: "crown_copings",
      name: "Crowns/Copings",
      list: [{
          seq: 1,
          name: "Anatomic crown",
          color: "#9F00A7",
        },
        {
          seq: 2,
          name: "Coping",
          color: "#33756B",
        },
        {
          seq: 3,
          name: "Pressed crown",
          color: "#ABA900",
        },
        {
          seq: 4,
          name: "Offset coping",
          color: "#008000",
        },
        {
          seq: 5,
          name: "Eggshell crown <br>(Provisional)",
          color: "#6E04FF",
        }
      ]
    },
    {
      id: "pontics",
      name: "Pontics",
      list: [{
          seq: 6,
          name: "Anatomic crown",
          color: "#72001E",
        },
        {
          seq: 7,
          name: "Reduced pontic",
          color: "#B51B44",
        },
        {
          seq: 8,
          name: "Pressed pontic",
          color: "#52A0D9",
        },
        {
          seq: 9,
          name: "Eggshell pontic <br>(Provisional)",
          color: "#B871A8",
        },
      ]
    },
    {
      id: "venners",
      name: "Inlays, onlays and veneers",
      list: [{
          seq: 10,
          name: "Inlay/Onlay",
          color: "#335C15",
        },
        {
          seq: 11,
          name: "Offset inlay",
          color: "#0A54BD",
        },
        {
          seq: 12,
          name: "Veneer",
          color: "#25879A",
        },
      ]
    },
    {
      id: "milling",
      name: "Digital copy milling",
      list: [{
          seq: 13,
          name: "Anotomic waxup",
          color: "#1FC173",
        },
        {
          seq: 14,
          name: "Reduced waxup",
          color: "#494949",
        },
        {
          seq: 15,
          name: "Pontic waxup",
          color: "#3F3993",
        },
      ]
    },
    {
      id: "units",
      name: "Primary units",
      list: [{
          seq: 16,
          name: "Bar pillar",
          color: "#664E0D",
        },
        {
          seq: 17,
          id: "__value_bar_segment",
          name: "Bar segment",
          color: "#5C009C",
        },
        {
          seq: 18,
          name: "Attachment",
          color: "#002E3D",
        },
        {
          seq: 19,
          name: "Telescopic crown",
          color: "#B87471",
        },
      ]
    },
    {
      id: "removable",
      name: "Appliances & Removables",
      list: [{
          seq: 20,
          name: "Bite splint",
          color: "#445274",
        },
        {
          seq: 21,
          name: "Bite splint <br>(missing tooth)",
          color: "#009BAD",
        },
        {
          seq: 22,
          name: "Full denture",
          color: "#63BCC7",
        },
        {
          seq: 23,
          name: "Partial framework",
          color: "#C0AD81",
        },
      ]
    },
    {
      id: "dentition",
      name: "Residual dentition",
      list: [{
          seq: 24,
          name: "Antagonist",
          color: "#F06400",
        },
        {
          seq: 25,
          name: "Adjacent tooth",
          color: "#FCAE1B",
        },
        {
          seq: 26,
          name: "Missing tooth",
          color: "#FF1010",
        },
      ]
    },
  ];

  this.vars.parameterList = [{
      id: 0,
      name: "implant_number",
      content: "Implant-based?",
      list: [{
          value: 0,
          content: "No Implant"
        },
        {
          value: 1,
          content: "1"
        },
        {
          value: 2,
          content: "2"
        }
      ]
    },
    {
      id: 1,
      name: "scan_a_pre_op_model",
      content: "Scan a pre-op model?",
      list: [{
          value: 0,
          content: "No"
        },
        {
          value: 1,
          content: "Yes"
        }
      ]
    },
    {
      id: 2,
      name: "scan_gingiva_separatly",
      content: "Scan gingiva separately?",
      list: [{
          value: 0,
          content: "No"
        },
        {
          value: 1,
          content: "Yes"
        }
      ]
    },
    {
      id: 3,
      name: "design_virtual_gingiva",
      content: "Design Virtual Gingiva?",
      list: [{
          value: 0,
          content: "No"
        },
        {
          value: 1,
          content: "Yes"
        }
      ]
    },


  ];
}