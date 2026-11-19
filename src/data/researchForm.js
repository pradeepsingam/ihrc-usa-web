// Researchers Application Form (from RESEARCH.docx). Uses the same renderer as the Volunteer / Membership forms.
// Block types: info | text | textarea | date | email | tel | radio | select | multi (several tick boxes) | table (rows x columns) | agree | file

const YN = ['Yes', 'No'];
const lang = ['1 - Basic', '2', '3', '4', '5 - Excellent'];

const interestGroups = [
  ['Human Rights & Protection', ['International Criminal Justice & Transitional Justice', 'Fair Trial Rights & Trial Monitoring', 'Child Organ Trafficking', 'Anti-Human Trafficking & Victim Protection']],
  ['Refugees, Migration & Humanitarian Action', ['Refugee Rights & Resettlement', 'Unaccompanied Minors & Immigration Detention', 'Humanitarian Emergency Services (IDPs, Refugees)']],
  ['Gender, Equality & Non-Discrimination', ['Gender & Racial Discrimination (Women, LGBTQ+)', 'Equal Access to Water & Sanitation', 'Gender-Based Violence in Armed Conflict']],
  ['SDGs & Socio-Economic Rights', ['Poverty & Hunger Eradication (SDG 1, 2)', 'Healthcare Access (SDG 3)', 'Human Rights Education (SDG 4)', 'Climate & Environmental Rights (SDG 13)', 'Labour Rights (SDG 8)']],
  ['IT, Digital Rights & Communications', ['AI & Big Data in Human Rights Monitoring', 'Social Media & Countering Misinformation', 'Digital Complaints & Redress Mechanisms']],
];

const declaration = [
  'All information provided in this application is true, complete and accurate.',
  'My research will fully comply with research ethics standards and data protection regulations.',
  'In working with victims, children and vulnerable groups, I will adhere to the “Do No Harm” principle and safeguarding policies.',
  'I will abide by the IHRC-USA Code of Conduct and Confidentiality Undertaking.',
  'I will comply with IHRC-USA policies on the publication rights of research findings.',
  'There is no pending disciplinary action or criminal case against me.',
  'If selected, I agree to submit the required documents and undergo eligibility verification.',
];

export const researchForm = {
  key: 'research',
  name: 'Researchers Application',
  title: 'IHRC-USA Researchers Application Form',
  intro: [
    'Complete all sections. Attach your CV, a one-page research proposal abstract, and copies of certificates. Incomplete applications will not be considered.',
    'Provision of false information will result in cancellation of selection or termination of engagement.',
  ],
  sections: [
    { title: 'Section A — Personal Details', blocks: [
      { t: 'date', id: 'date', label: 'Date of Application', req: 1 },
      { t: 'text', id: 'fullName', label: 'Full Name (English)', req: 1 },
      { t: 'text', id: 'nativeName', label: 'Full Name (in national language, if applicable)' },
      { t: 'text', id: 'idNo', label: 'National Identity Card / Passport No.', req: 1 },
      { t: 'text', id: 'dob', label: 'Date of Birth / Age', req: 1 },
      { t: 'radio', id: 'gender', label: 'Gender', opts: ['Male', 'Female', 'Other', 'Prefer not to say'], req: 1 },
      { t: 'text', id: 'nationality', label: 'Nationality', req: 1 },
      { t: 'textarea', id: 'permAddress', label: 'Permanent Address', req: 1 },
      { t: 'textarea', id: 'currAddress', label: 'Current Address' },
      { t: 'tel', id: 'phone', label: 'Mobile / Telephone', hint: 'Include the country code.', req: 1 },
      { t: 'email', id: 'email', label: 'Email', req: 1 },
      { t: 'text', id: 'scholar', label: 'Website / ORCID / Google Scholar / ResearchGate' },
      { t: 'text', id: 'social', label: 'LinkedIn / Social Media Handle' },
    ] },
    { title: 'Section B — Educational Qualifications', note: '(Most recent first)', blocks: [
      { t: 'table', id: 'edu', label: 'Educational Qualifications', cols: ['Degree', 'Subject', 'Institution / University', 'Year', 'Class / Grade'], rows: 3, req: 1 },
      { t: 'radio', id: 'highest', label: 'Highest Qualification', opts: ['Master’s', 'M.Phil', 'Ph.D', 'Post-Doctoral', 'Other'], other: 'Other', req: 1 },
      { t: 'radio', id: 'eduCertsAttached', label: 'Educational certificates attached', opts: YN, req: 1 },
    ] },
    { title: 'Section C — Research Experience', blocks: [
      { t: 'text', id: 'expYears', label: 'Total research experience (years)', req: 1 },
      { t: 'text', id: 'employer', label: 'Current employer / institution' },
      { t: 'text', id: 'designation', label: 'Current designation' },
      { t: 'textarea', id: 'prevPositions', label: 'Previous research positions held' },
      { t: 'table', id: 'prevProjects', label: 'Previous Research Projects', cols: ['Project Title', 'Institution / Funder', 'Role', 'Duration'], rows: 3 },
      { t: 'multi', id: 'methods', label: 'Research Methodologies Known (select all that apply)', opts: ['Quantitative', 'Qualitative', 'Mixed Methods', 'Field Research', 'Case Study', 'Policy Analysis', 'Legal Analysis', 'Comparative Analysis', 'Statistical Analysis (SPSS/STATA/R)', 'NVivo/Atlas.ti', 'GIS', 'Other'] },
      { t: 'text', id: 'methodsOther', label: 'Other methodologies (if any)' },
    ] },
    { title: 'Section D — Research Interest Areas', note: '(Select all that apply)', blocks: [
      ...interestGroups.map(([g, opts], i) => ({ t: 'multi', id: 'interest' + (i + 1), label: (i + 1) + '. ' + g, opts })),
      { t: 'textarea', id: 'interestOther', label: 'Other research interests' },
    ] },
    { title: 'Section E — Publications & Presentations', blocks: [
      { t: 'table', id: 'publications', label: 'Five Most Recent Publications', cols: ['Title', 'Journal / Publisher', 'Year', 'DOI / Link'], rows: 5 },
      { t: 'table', id: 'pubCounts', label: 'Publication totals', rowHead: 'Item', rowLabels: ['Total peer-reviewed journal articles', 'Books / Book chapters', 'Research reports', 'Conference presentations', 'Newspaper / media articles'], cols: ['Number'] },
      { t: 'radio', id: 'pubListAttached', label: 'Full publication list attached', opts: YN },
    ] },
    { title: 'Section F — Language Proficiency', note: '(1 = Basic, 5 = Excellent)', blocks: [
      { t: 'table', id: 'languages', label: 'Language Proficiency', rowHead: 'Language', rowLabels: ['English', 'Tamil', 'Sinhala', 'Other'], cols: ['Speaking (1–5)', 'Writing (1–5)', 'Reading (1–5)'], cellOpts: lang },
      { t: 'text', id: 'langOther', label: 'If “Other”, which language?' },
    ] },
    { title: 'Section G — Technical & Other Skills', blocks: [
      { t: 'multi', id: 'skills', label: 'Skills (select all that apply)', opts: ['Data analysis (SPSS / STATA / R / Python)', 'Data visualization (Tableau / Power BI)', 'Field research & conducting interviews', 'Stakeholder engagement & networking', 'Grant / proposal writing', 'Training delivery / lecturing', 'Translation ', 'Other'] },
      { t: 'text', id: 'skillsOther', label: 'Other skills (if any)' },
    ] },
    { title: 'Section H — Preferred Mode of Contribution', blocks: [
      { t: 'multi', id: 'mode', label: 'Preferred Mode of Contribution', opts: ['Full-time Researcher', 'Part-time Researcher', 'Contract-based (specific assignments)', 'Volunteer Researcher', 'Consultant', 'Trainer'], req: 1 },
      { t: 'radio', id: 'hours', label: 'Availability per week', opts: ['5 hrs', '10 hrs', '20 hrs', '40 hrs'], req: 1 },
      { t: 'radio', id: 'travel', label: 'Willing to travel internationally', opts: YN, req: 1 },
      { t: 'radio', id: 'field', label: 'Available for field research', opts: YN, req: 1 },
    ] },
    { title: 'Section I — Research Proposal Abstract', note: '(Maximum 300 words — attach on a separate sheet)', blocks: [
      { t: 'text', id: 'propTitle', label: 'Proposed Title', req: 1 },
      { t: 'textarea', id: 'propQuestion', label: 'Research Question', req: 1 },
      { t: 'textarea', id: 'propSignificance', label: 'Significance' },
      { t: 'textarea', id: 'propMethod', label: 'Methodology' },
      { t: 'textarea', id: 'propOutput', label: 'Expected Output' },
      { t: 'text', id: 'propDuration', label: 'Duration' },
      { t: 'radio', id: 'abstractAttached', label: 'Abstract attached', opts: YN, req: 1 },
    ] },
    { title: 'Section J — References', blocks: [
      { t: 'table', id: 'ref1', label: 'Reference 1', rowHead: 'Field', rowLabels: ['Name & Designation', 'Institution', 'Telephone / Email', 'Relationship'], cols: ['Complete'] },
      { t: 'table', id: 'ref2', label: 'Reference 2', rowHead: 'Field', rowLabels: ['Name & Designation', 'Institution', 'Telephone / Email', 'Relationship'], cols: ['Complete'] },
    ] },
    { title: 'Section K — Declaration & Undertaking', blocks: [
      { t: 'agree', id: 'declaration', label: 'I hereby declare and undertake that:', items: declaration, req: 1 },
    ] },
    { title: 'Section L — Signature', blocks: [
      { t: 'text', id: 'signature', label: 'Applicant Signature', hint: 'Type your full name as your signature.', req: 1 },
      { t: 'text', id: 'place', label: 'Place' },
    ] },
    { title: 'Section M — Attachments', note: 'Attach these documents to the email that opens after you submit.', blocks: [
      { t: 'file', id: 'cv', label: 'Curriculum Vitae (CV) — maximum 4 pages', req: 1, file: { kinds: ['pdf', 'document'], maxMB: 10 } },
      { t: 'file', id: 'abstract', label: 'Research Proposal Abstract (1 page)', req: 1, file: { kinds: ['pdf', 'document'], maxMB: 10 } },
      { t: 'file', id: 'eduCert', label: 'Self-attested copies of educational certificates', req: 1, file: { kinds: ['pdf'], maxMB: 50 } },
      { t: 'file', id: 'pubList', label: 'Full publication list', file: { kinds: ['pdf', 'document'], maxMB: 10 } },
      { t: 'file', id: 'idDoc', label: 'Copy of National Identity Card / Passport', req: 1, file: { kinds: ['pdf', 'image'], maxMB: 10 } },
      { t: 'file', id: 'photo', label: 'Recent passport-size photograph (1)', req: 1, file: { kinds: ['image', 'pdf'], maxMB: 5 } },
      { t: 'info', lines: ['Reference letters are required only if you are shortlisted.'] },
    ] },
  ],
};
