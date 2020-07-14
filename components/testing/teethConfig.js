
export const basicToothTemplate = {
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


export const parameterList = [{
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


