import {managed} from '../lib/managedContent';
import {Page,Card,Form,Accordion,Heading} from '../components/UI';
const editableCopy=managed("copy.Accreditation","Accreditation — headings and text","Page text",{
 "page-title-accreditation-recognition": "Accreditation & Recognition",
 "page-introduction-apply-for-ihrc-usa-accreditation-or-recognition-form-no-ihrc-usa-": "Apply for IHRC-USA accreditation or recognition — Form No. IHRC-USA/ACC/001",
 "text-accreditations": "Accreditations",
 "text-important-notice-instructions": "Important Notice & Instructions",
 "text-supporting-documents-required": "Supporting Documents Required",
 "text-attach-copies-not-originals-unless-specifically-requested-upload-": "Attach copies (not originals) unless specifically requested. Upload instructions will be provided after initial review.",
 "text-application-form": "Application Form",
 "text-complete-all-applicable-fields-write": "Complete all applicable fields. Write",
 "text-where-a-field-does-not-apply-fields-marked": "where a field does not apply. Fields marked",
 "text-are-required": "are required.",
 "text-disclaimer": "Disclaimer:",
 "text-ihrc-usa-accreditation-is-a-private-institutional-recognition-it-": "IHRC-USA accreditation is a private institutional recognition. It does not constitute a government licence, statutory accreditation, recognized academic qualification, professional licensure or authorization to practise any regulated profession. IHRC-USA may request clarification, further evidence or an interview and may approve, condition, defer or decline any application."
});


const intro=managed("Accreditation.intro","Accreditation introduction",'Website content','The International Human Rights Council – USA (IHRC-USA) has developed a structured framework for granting accreditations and recognitions to individuals, community leaders, non-governmental organizations, and community-based organizations working in the fields of human rights, social justice, education, the protection of women and children, human dignity, and community development.\n\nIHRC-USA firmly believes that accreditation should be more than merely awarding a medal, certificate, or honorary title. It should represent a formal recognition of an individual’s or organization’s service, qualifications, experience, contributions to society, and credibility. All recognitions should be granted through a fair, transparent, and systematic evaluation process based on established criteria and standards.');

const notice=managed("Accreditation.notice","Accreditation notice",'Website content',[
  ['Important Notice & Instructions',
    'This form is for applicants seeking a private recognition, programme review or service expressly offered by IHRC-USA. Submission does not guarantee approval.\n\nUnless separately authorized and documented, IHRC-USA recognition is not a government licence, statutory approval, recognized academic accreditation, professional license or authorization to practice a regulated profession.\n\nComplete all applicable fields; write N/A where not applicable; attach copies (not originals) unless specifically requested.'],
  ['Legal & International Recognition Distinction',
    "IHRC-USA grants its own institutional accreditations, recognitions and honorary titles in accordance with its organizational policies and established procedures.\n\nFurthermore, ECOSOC Consultative Status with the United Nations is a separate formal status that requires an independent application, review and assessment process by the relevant UN authorities. IHRC-USA\u2019s institutional accreditations do not automatically confer, represent or imply UN ECOSOC Consultative Status."],
  ['Our Commitment',
    'IHRC-USA is committed to maintaining transparency, credibility, accountability and international standards in all its accreditation and recognition activities.'],
]);

const docChecklist=managed("Accreditation.docChecklist","Accreditation document checklist",'Website content',[
  'Certificate of incorporation / registration',
  'Articles, bylaws or constitution',
  'Current directors / trustees / office-bearers list',
  'Organizational chart and staff profiles',
  'Strategic plan, annual and programme reports',
  'Human rights, safeguarding, complaints and ethics policies',
  'Financial statements and audit / review report (last 4 years)',
  'Curriculum, learning outcomes and assessment tools (if applicable)',
  'Evidence of activities, outcomes and impact',
  'Applicable licences, permissions and insurance',
  'Conflict-of-interest declarations',
  'Other supporting documents',
]);

const fields=[
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

export default function Accreditation(){
  return (
    <Page
      title={editableCopy["page-title-accreditation-recognition"]}
      sub={editableCopy["page-introduction-apply-for-ihrc-usa-accreditation-or-recognition-form-no-ihrc-usa-"]}
    >
      <div className="space-y-8">
        {/* Accreditations intro */}
        <Card>
          <h2 className="mb-2 font-serif text-xl font-bold text-navy">{editableCopy["text-accreditations"]}</h2>
          <p className="whitespace-pre-line text-slate-700">{intro}</p>
        </Card>


        {/* Notice accordion */}
        <Card>
          <h2 className="mb-4 font-serif text-xl font-bold text-navy">{editableCopy["text-important-notice-instructions"]}</h2>
          <Accordion items={notice}/>
        </Card>

        {/* Supporting documents checklist */}
        <Card>
          <Heading>{editableCopy["text-supporting-documents-required"]}</Heading>
          <ul className="grid gap-2 sm:grid-cols-2">
            {docChecklist.map(d=>(
              <li key={d} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-0.5 shrink-0 text-brand">✓</span>{d}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">{editableCopy["text-attach-copies-not-originals-unless-specifically-requested-upload-"]}</p>
        </Card>

        {/* Application form */}
        <Card>
          <h2 className="mb-1 font-serif text-xl font-bold text-navy">{editableCopy["text-application-form"]}</h2>
          <p className="mb-6 text-sm text-slate-600">{editableCopy["text-complete-all-applicable-fields-write"]+" "}<strong>N/A</strong>{" "+editableCopy["text-where-a-field-does-not-apply-fields-marked"]+" "}<strong>*</strong>{" "+editableCopy["text-are-required"]}</p>
          <Form
            fields={fields}
            button="Submit Application"
            subject="IHRC-USA Accreditation & Recognition Application — Form IHRC-USA/ACC/001"
          />
        </Card>

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>{editableCopy["text-disclaimer"]}</strong>{" "+editableCopy["text-ihrc-usa-accreditation-is-a-private-institutional-recognition-it-"]}</div>

      </div>
    </Page>
  );
}
