// Source of truth for the NGO partnership (CSO status) questionnaire.
// Used by the online form (src/pages/PartnershipApplication.jsx).

export const partnershipMeta = {
  org: 'International Human Rights Council – USA (IHRC-USA)',
  tagline: 'Equal Justice for Everyone & Everywhere',
  title: 'Questionnaire for NGO Partnership',
  subtitle:
    'Questionnaire to be completed by non-governmental organizations applying for CSO Status with the Department of Social Affairs and Partnerships (DSAP), International Human Rights Council-USA',
  email: 'globalihrc@gmail.com',
};

// type: text | email | tel | url | date | textarea
// parts: several short inputs for one question (A, B, C ...)
// attach: a file the applicant must send with the email (files cannot be uploaded from the web page)
export const partnershipSections = [
  {
    title: 'A. Organization Details',
    items: [
      { id: 'applicantEmail', n: '', label: 'Email', type: 'email', req: 1, hint: 'The e-mail address used for all future communications.' },
      { id: 'ngoName', n: 1, label: 'Name of the non-governmental organization (NGO)', type: 'text', req: 1, hint: 'Must match the certificate of registration exactly. Please do not use all capital letters.' },
      { id: 'ngoAcronym', n: 2, label: 'Acronym of the non-governmental organization (NGO)', type: 'text', req: 1, hint: 'Capital letters are allowed for acronyms only. Spell the acronym out the first time it appears.' },
      { id: 'submitDate', n: 3, label: 'Date of submission of the application', type: 'date', req: 1, hint: 'Example: January 7, 2019' },
      { id: 'hqAddress', n: 4, label: 'Address of headquarters', type: 'textarea', hint: 'A valid physical address (PO Boxes are not accepted).' },
      {
        id: 'org', n: 5, label: 'Organization', req: 1,
        parts: [
          { id: 'orgTel', label: 'A. Telephone', type: 'tel' },
          { id: 'orgFax', label: 'B. Fax', type: 'text' },
          { id: 'orgEmail', label: 'C. Email', type: 'email' },
          { id: 'orgWeb', label: 'D. Website', type: 'url' },
        ],
      },
      { id: 'branches', n: 6, label: 'Address of all branches or regional headquarters', type: 'textarea', req: 1, hint: 'Including names and contact information, telephone, fax, email and website.' },
      {
        id: 'contact', n: 7, label: 'Name and contact details of a point of contact for the purposes of the application', req: 1,
        parts: [
          { id: 'contactName', label: 'A. Name', type: 'text', req: 1 },
          { id: 'contactEmail', label: 'B. Email', type: 'email', req: 1 },
          { id: 'contactWhatsapp', label: 'C. WhatsApp Number', type: 'tel', req: 1 },
        ],
      },
    ],
  },
  {
    title: 'B. Aims, History and Relevance',
    items: [
      { id: 'aims', n: 8, label: 'Aims and purposes of the NGO', type: 'textarea', req: 1, hint: 'As set forth in its constitution, statutes or by-laws, including its strategy.', attach: 'Constitution, statutes or by-laws (if available)' },
      { id: 'history', n: 9, label: 'History of the NGO, including the length of time the NGO has been in existence and relevant previous activities/events.', type: 'textarea', req: 1 },
      { id: 'relevance', n: 10, label: 'Descriptive statement of the extent to which the purposes of the NGO relate to those of IHRC-USA, in particular what contribution the NGO can make to the work of IHRC-USA, including its technical cooperation programme.', type: 'textarea', req: 1 },
      { id: 'structure', n: 11, label: 'Organizational structure and officers’ names and titles', type: 'textarea', req: 1 },
    ],
  },
  {
    title: 'C. Membership and Cooperation',
    items: [
      { id: 'membership', n: 12, label: 'Membership', type: 'textarea', req: 1, hint: 'Nature of membership, name of members and country where their main offices are based.' },
      { id: 'affiliation', n: 13, label: 'Indicate whether the NGO is a member of, affiliated to or otherwise associated with another NGO which enjoys consultative status or has other forms of association with IHRC-USA.', type: 'textarea', req: 1 },
      { id: 'expertise', n: 14, label: 'Indicate how the NGO can contribute new expertise to IHRC-USA by describing which work outputs, as described in the Strategic Plan for the Organization, that they would be interested in contributing to in the next biennium?', type: 'textarea', req: 1 },
      { id: 'un', n: 15, label: 'Relations with the United Nations system and other intergovernmental organizations?', type: 'textarea', req: 1 },
      { id: 'participate', n: 16, label: 'Indicate by what means IHRC-USA could participate in the NGO’s activities', type: 'textarea', req: 1 },
      { id: 'promote', n: 17, label: 'Indicate by what means the NGO will promote and disseminate the principles and work of IHRC-USA?', type: 'textarea', req: 1 },
    ],
  },
  {
    title: 'D. Funding, Publications and Additional Information',
    items: [
      { id: 'funding', n: 18, label: 'Indicate source of funding and provide evidence of financial sustainability', type: 'textarea', req: 1, hint: 'Three years.' },
      { id: 'publications', n: 19, label: 'List of publications and/or other relevant documentation', type: 'textarea', req: 1, attach: 'Publications or other relevant documentation' },
      { id: 'additional', n: 20, label: 'Additional information which the NGO may wish to provide', type: 'textarea', req: 1 },
      { id: 'provide', n: 21, label: 'What would that non-governmental organization (NGO) like to provide to IHRC-USA?', type: 'textarea', req: 1, hint: 'Please provide it clearly written, with the office seal and signature.', attach: 'Signed and sealed statement (if prepared as a separate document)' },
    ],
  },
  {
    title: 'E. Required Documents',
    items: [
      { id: 'letter', n: 22, label: 'Partnership Request Letter', req: 1, hint: 'Please provide it clearly written, with the office seal and signature.', fileOnly: true, attach: 'Partnership request letter with office seal and signature' },
      { id: 'logoReg', n: 23, label: 'Upload Organization Logo and Registration copy', req: 1, fileOnly: true, attach: 'Organization logo and registration certificate copy' },
    ],
  },
];

export const formattingRules = [
  'Please make sure all questions are thoroughly answered. Any unanswered or partially answered question may differ the review and consideration of your application.',
  'Please note that all the information provided as part of your application (including supporting documents) must be consistent with the information presented in the organization’s website.',
  'Throughout the application form, in the supporting documents provided and on the organization’s website, IHRC-USA terminology must be respected.',
  'Please ensure that the principles of the IHRC-USA Charter are respected throughout the application form, in the supporting documents and on the organization’s website.',
  'Please have clear and concise text.',
  'Please do not use CAPS (or UPPER CASE) in the name of the organization or when filling out the form. CAPS (or UPPER CASE) can be used only for acronyms as long as they are spelled out the first time it appears.',
  'Please be careful when copying and pasting text from other documents that it does not get altered with unwanted symbols.',
  '“-” and numbering (1., 2.,.) can be used for clarity.',
  'The organization’s name on the profile must match the certificate of registration exactly.',
  'The permanent address must be a valid physical address (PO Boxes are not accepted).',
  'Keep the e-mail address up to date at all times - it will be used for all future communications.',
  'Ensure any website provided is active at all times.',
  'All applications, including the required documents, must be submitted using the email method accessible at globalihrc@gmail.com.',
];

export const allQuestionItems = partnershipSections.flatMap(s => s.items);
