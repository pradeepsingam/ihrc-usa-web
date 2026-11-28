export const accreditationFields=[
  /* PART A – APPLICATION CATEGORY */
  {n:'recognition_sought', label:'A1. Recognition sought', req:1,
    opts:['Human Rights Organization','Educational Institution / Programme','Professional Development Programme','Individual Profile','Project / Initiative','Award / Honorary Recognition','Other']},
  {n:'application_type', label:'A2. Application type', req:1,
    opts:['New','Renewal','Scope Extension','Reassessment']},
  {n:'title_category', label:'A3. Exact title, category and scope requested', req:1, type:'textarea',
    hint:'State the precise recognition or category you are applying for.'},
  {n:'countries_operation', label:'A4. Countries, states and locations of operation', req:1},
  {n:'previous_applications', label:'A5. Previous applications to IHRC-USA or other bodies (dates & outcomes)', type:'textarea',
    hint:'Write N/A if none.'},

  /* PART B – APPLICANT / ORGANIZATION PROFILE */
  {n:'legal_name', label:'B1. Full legal name', req:1},
  {n:'trading_name', label:'B2. Trading name, acronym or former name',
    hint:'Write N/A if none.'},
  {n:'entity_type', label:'B3. Entity type', req:1,
    opts:['Nonprofit / NGO','Corporation','Association','School / Educational Institution','Individual','Community-Based Organization','Other']},
  {n:'country_state', label:'B4. Country / state of formation or residence', req:1},
  {n:'reg_number', label:'B5. Registration / incorporation number and date'},
  {n:'reg_address', label:'B6. Registered address', req:1},
  {n:'operating_address', label:'B7. Principal operating address'},
  {n:'website', label:'B8. Website and official social media links'},
  {n:'telephone', label:'B9. Telephone', type:'tel'},
  {n:'official_email', label:'B9. Official email', type:'email', req:1},
  {n:'primary_contact', label:'B10. Primary contact – name, position and contact details', req:1},
  {n:'operations_started', label:'B11. Date operations commenced and number of branches'},
  {n:'staff_count', label:'B12. Staff, volunteers, members and annual beneficiaries (numbers)'},

  /* PART C – LEGAL STATUS & GOVERNANCE */
  {n:'governing_law', label:'C1. Governing law and jurisdiction'},
  {n:'governing_docs', label:'C2. Articles, bylaws, constitution, trust deed and adoption dates', type:'textarea'},
  {n:'directors', label:'C3. Names, roles and terms of directors / trustees / office bearers', type:'textarea'},
  {n:'board_appointment', label:'C4. How board members are appointed, elected, removed and replaced', type:'textarea'},
  {n:'meeting_frequency', label:'C5. Meeting frequency and minutes-keeping procedure'},
  {n:'delegated_authority', label:'C6. Documented powers, delegated authority and reporting lines', type:'textarea'},
  {n:'related_entities', label:'C7. Related entities, affiliates, subsidiaries or controlling persons',
    hint:'Write N/A if none.'},
  {n:'regulatory_actions', label:'C8. Regulatory actions, litigation, insolvency or investigations involving applicant / senior officers',
    hint:'Write N/A if none.'},

  /* PART D – MISSION, HUMAN RIGHTS & ACTIVITIES */
  {n:'mission_vision', label:'D1. Mission, vision and principal objectives', req:1, type:'textarea'},
  {n:'hr_themes', label:'D2. Human rights themes and groups served', req:1, type:'textarea'},
  {n:'activities', label:'D3. Description of main activities and programmes (last 3 years)', req:1, type:'textarea'},
  {n:'geographic_reach', label:'D4. Geographic reach and target communities', type:'textarea'},
  {n:'outcomes', label:'D5. Key outcomes and impact (evidence-based)', type:'textarea'},
  {n:'partners', label:'D6. Key partners, funders and networks', type:'textarea'},

  /* PART E – FINANCES */
  {n:'annual_budget', label:'E1. Annual operating budget (USD approximate)'},
  {n:'funding_sources', label:'E2. Main sources of funding', type:'textarea'},
  {n:'financial_audit', label:'E3. Financial statements audited / reviewed?',
    opts:['Yes – independently audited','Yes – internally reviewed','No','Not applicable']},

  /* PART F – SAFEGUARDING & ETHICS */
  {n:'safeguarding_policy', label:'F1. Does the organization have a safeguarding / child-protection policy?',
    opts:['Yes','No','In development']},
  {n:'complaints_mechanism', label:'F2. Complaints and grievance mechanism in place?',
    opts:['Yes','No','In development']},
  {n:'conflict_interest', label:'F3. Conflict-of-interest policy in place?',
    opts:['Yes','No','In development']},

  /* PART G – INDIVIDUAL PROFILE (if applicable) */
  {n:'individual_name', label:'G1. Full name (individual applicants only)',
    hint:'Write N/A if applying as an organization.'},
  {n:'individual_qualifications', label:'G2. Qualifications, credentials and professional memberships',
    hint:'Write N/A if applying as an organization.', type:'textarea'},
  {n:'individual_experience', label:'G3. Human rights experience and notable contributions',
    hint:'Write N/A if applying as an organization.', type:'textarea'},

  /* PART J – DECLARATIONS */
  {n:'declaration', label:'J. Declarations & Consents', req:1,
    opts:[
      'I confirm all information and documents are true and complete, and I understand that submission does not guarantee approval.',
    ],
    hint:'Select to confirm all declarations in Parts J1–J6 of the application form.'},

  /* APPLICANT DETAILS */
  {n:'authorised_name', label:'Authorised applicant full name', req:1},
  {n:'authorised_position', label:'Position / title', req:1},
  {n:'submission_date', label:'Date', type:'date', req:1},
  {n:'notes', label:'Additional notes or supporting information', type:'textarea',
    hint:'Use this field for any information not covered above.'},
];
