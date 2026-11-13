// Volunteer and Membership registration forms (recreated from the IHRC-USA Google Forms).
// Block types: info | text | textarea | date | email | tel | radio | select | agree | file
//   req: required, showIf: {id, eq} show only when another answer matches,
//   other: radio option that also takes typed text, mustAgree: "I disagree" blocks submission,
//   file: {kinds:['image'|'pdf'|'document'], maxMB, note}

const YN = ['Yes', 'No'];
const AGREE = ['I agree', 'I disagree'];
const marital = ['Single', 'Married', 'Divorced', 'Widow', 'Widower'];
const education = ['Primary school', 'High school', 'Student', 'Licentiate', 'Holder of university degree', 'Doctor (Non-honorary degree)', 'Professor (Non-honorary degree)', 'Honorary Doctorate'];
const interests = ['Human Rights Activities', 'Peace & Conflict Prevention', 'Education', 'Research & Policy Advocacy', 'Journalist', 'Environmental Protection', 'Investigation', 'Reports', 'Programmes', 'Organizing', 'Promoting Awareness', 'Child Rights', 'Women’s Rights', 'Climate Justice', 'Anti-Trafficking', 'Humanitarian Assistance', 'Youth Development', 'Justice & Rule of Law', 'Other'];
const language = ['English', 'Mother tongue', 'Other'];
const photoNotes = ['AI-modified photos will not be accepted.', 'Photos must be uploaded with a white or light blue background.', 'Failure to comply with the above requirements will result in the automatic invalidation of your application.'];
const checklist = ['1. Photograph: Must be passport-sized (35x45mm or 3.5x4cm).', '2. National Identity Card or Passport: Original copy (must be clear).', '3. Questions in the form: Provide clear and complete answers to all questions.', '4. Curriculum Vitae: Signature and date are essential.', '5. If the form is not fully completed, the application will be considered invalid.'];
const declaration = ['I confirm that the information provided in this application is true and accurate to the best of my knowledge.', 'I agree to respect the applicable Constitution, policies, Code of Conduct, safeguarding principles, and ethical standards of IHRC-USA.', 'I understand that submitting this application does not automatically guarantee membership, appointment, or any official position.'];
const consent = 'I consent to IHRC-USA using the information provided in this application for legitimate membership, communication, administrative, documentation, and organizational purposes, subject to applicable privacy and data-protection requirements.';
const checklistBlock = { t: 'radio', id: 'checklist', label: 'Essential Checklist for Completing Your Application', lines: checklist, opts: ['I Agree'], req: 1, mustAgree: 'I Agree' };

const intro = (kind) => [
  'Thank you for your interest in joining the International Human Rights Council – USA (IHRC-USA). Please complete this application accurately. The information provided will be used for ' + (kind === 'membership' ? 'membership assessment' : 'assessment') + ', communication, documentation, and legitimate organizational purposes.',
  'IHRC-USA is an independent, Non Governmental, ' + (kind === 'membership' ? 'human rights organization' : 'International Human Rights Council') + ' and is not a branch or agency of the United Nations.',
];

export const volunteerForm = {
  key: 'volunteer',
  name: 'Volunteer Registration',
  title: 'IHRC-USA Volunteer Registration Form',
  intro: intro('volunteer'),
  sections: [
    { title: '', blocks: [
      { t: 'date', id: 'date', label: 'Date', req: 1 },
      checklistBlock,
    ] },
    { title: 'Personal Information', blocks: [
      { t: 'text', id: 'fullName', n: 1, label: 'Full Name', req: 1 },
      { t: 'date', id: 'dob', n: 2, label: 'Date of Birth', req: 1 },
      { t: 'text', id: 'gender', n: 3, label: 'Gender', req: 1 },
      { t: 'text', id: 'nationality', n: 4, label: 'Nationality', req: 1 },
      { t: 'text', id: 'country', n: 5, label: 'Country of Residence', req: 1 },
      { t: 'text', id: 'city', n: 6, label: 'City/Town', req: 1 },
      { t: 'radio', id: 'marital', n: 7, label: 'Marital Status', opts: marital, req: 1 },
      { t: 'tel', id: 'whatsapp', n: 8, label: 'WhatsApp/Mobile Number', hint: 'Country code with mobile number (+)', req: 1 },
      { t: 'text', id: 'address', n: 9, label: 'Address', req: 1 },
      { t: 'radio', id: 'language', n: 10, label: 'Preferred Language', opts: language, other: 'Other', req: 1 },
    ] },
    { title: 'Education & Profession', blocks: [
      { t: 'radio', id: 'education', n: 11, label: 'Educational Background (For each degree, please specify the following data)', opts: education },
      { t: 'text', id: 'profession', n: 12, label: 'Profession / Occupation', req: 1 },
      { t: 'text', id: 'organization', n: 13, label: 'Organization / Institution', req: 1 },
      { t: 'textarea', id: 'experience', n: 14, label: 'Professional Experience', hint: '(Please explain)', req: 1 },
    ] },
    { title: 'Human Rights Experience', blocks: [
      { t: 'radio', id: 'hrExp', n: 15, label: 'Previous Human Rights Experience?', opts: YN },
      { t: 'textarea', id: 'hrExpDetails', n: 16, label: 'Experience Details', req: 1, showIf: { id: 'hrExp', eq: 'Yes' } },
      { t: 'radio', id: 'interest', n: 17, label: 'Areas of Interest', opts: interests, req: 1 },
    ] },
    { title: 'Membership Category', blocks: [
      { t: 'radio', id: 'title', n: 18, label: 'Select Membership Title', opts: ['Volunteer', 'Other (Subject to membership fees)'] },
      { t: 'textarea', id: 'why', n: 19, label: 'Why do you want to join IHRC-USA?', req: 1 },
      { t: 'textarea', id: 'contribute', n: 20, label: 'How can you contribute?', req: 1 },
    ] },
    { title: 'Documents & Photograph', blocks: [
      { t: 'file', id: 'photo', n: 21, label: 'Photograph (35x45mm or 3.5x4cm)', notes: photoNotes, req: 1, file: { kinds: ['pdf', 'image'], maxMB: 1 } },
      { t: 'file', id: 'idDoc', n: 22, label: 'Identification Document', hint: '(National Identity card or Passport)', req: 1, file: { kinds: ['pdf', 'image'], maxMB: 10 } },
      { t: 'file', id: 'cv', n: 23, label: 'CV/Resume', req: 1, file: { kinds: ['pdf', 'document'], maxMB: 100 } },
    ] },
    { title: 'Members Restrictions & Regulations', blocks: [
      { t: 'select', id: 'restrictions', n: 24, label: 'Members Restrictions & Regulations', opts: AGREE, req: 1, mustAgree: 'I agree' },
    ] },
    { title: 'Declaration & Agreement', blocks: [
      { t: 'agree', id: 'declaration', n: 25, label: 'Declaration & Agreement', items: declaration, req: 1 },
    ] },
    { title: 'Consent', blocks: [
      { t: 'agree', id: 'consent', n: 26, label: 'Privacy & Data Consent', items: [consent], req: 1 },
    ] },
    { title: 'Final Confirmation', blocks: [
      { t: 'agree', id: 'final', n: 27, label: 'Applicant Confirmation', items: ['I Agree'], req: 1 },
    ] },
  ],
};

const rules = [
  '1. No Financial Fundraising: Members are strictly prohibited from collecting or soliciting financial donations under the IHRC-USA name without explicit, written authorization from the SLK Headquarters.',
  '2. No Official Representation: No Members may act, speak, or issue statements to the media as an official international representative of the IHRC-USA without a formal mandate.',
  '3. Non-Compensated Service: All Members positions are strictly unpaid. The IHRC-USA does not provide salaries, and the headquarters is not responsible for personal expenses incurred during Members work.',
  '4. IHRC-USA ID Card Policy: Issued digital or physical Members cards remain the intellectual property of the organization. Misuse, forgery, or public leaks of these documents will lead to immediate termination.',
  '5. Strict Neutrality: In compliance with non-profit standards, Members must remain completely non-partisan. You cannot endorse political parties or candidates using the IHRC-USA affiliation.',
  '6. Content Monitoring: All content posted by Members on the organization’s network is heavily monitored. Individual accounts will be suspended if posts conflict with the core values of the IHRC-USA Headquarters.',
];

export const membershipForm = {
  key: 'membership',
  name: 'Membership Registration',
  title: 'IHRC-USA Membership Registration Form',
  intro: intro('membership'),
  sections: [
    { title: '', blocks: [checklistBlock] },
    { title: 'Personal Information', blocks: [
      { t: 'text', id: 'fullName', n: 1, label: 'Full Name', req: 1 },
      { t: 'date', id: 'dob', n: 2, label: 'Date of Birth', req: 1 },
      { t: 'radio', id: 'gender', n: 3, label: 'Gender', opts: ['Male', 'Female', 'Other'], req: 1 },
      { t: 'radio', id: 'marital', n: 4, label: 'Marital Status', opts: marital, req: 1 },
      { t: 'text', id: 'nationality', n: 5, label: 'Nationality', req: 1 },
      { t: 'text', id: 'country', n: 6, label: 'Country of Residence', req: 1 },
      { t: 'text', id: 'province', n: 7, label: 'Province', req: 1 },
      { t: 'text', id: 'city', n: 8, label: 'City/Town', req: 1 },
      { t: 'text', id: 'address', n: 9, label: 'Home address (Write the full address)', req: 1 },
      { t: 'text', id: 'blood', n: 10, label: 'Blood Group', req: 1 },
    ] },
    { title: 'Contact Information', blocks: [
      { t: 'email', id: 'email', n: 11, label: 'Email Address', req: 1 },
      { t: 'tel', id: 'mobile', n: 12, label: 'Mobile Number', req: 1 },
      { t: 'tel', id: 'whatsapp', n: 13, label: 'WhatsApp Number', hint: '(Country code with mobile number)', req: 1 },
      { t: 'radio', id: 'language', n: 14, label: 'Preferred Language', opts: ['English', 'Mother tongue', 'Other'], other: 'Other', req: 1 },
    ] },
    { title: 'Education & Profession', blocks: [
      { t: 'radio', id: 'education', n: 15, label: 'Educational Background (For each degree, please specify the following data)', opts: education },
      { t: 'text', id: 'profession', n: 16, label: 'Profession / Occupation', req: 1 },
      { t: 'text', id: 'organization', n: 17, label: 'Organization / Institution' },
      { t: 'textarea', id: 'experience', n: 18, label: 'Professional Experience' },
      { t: 'textarea', id: 'background', n: 19, label: 'Personal Background and Interest (What is your self-introduction?)', req: 1 },
    ] },
    { title: 'Human Rights Experience', blocks: [
      { t: 'radio', id: 'hrExp', n: 20, label: 'Previous Human Rights Experience?', opts: YN },
      { t: 'textarea', id: 'hrExpDetails', n: 21, label: 'If yes, Experience Details', req: 1, showIf: { id: 'hrExp', eq: 'Yes' } },
      { t: 'radio', id: 'interest', n: 22, label: 'Areas of Interest', opts: interests, req: 1 },
    ] },
    { title: 'Membership Category', note: '(There is a membership fee)', blocks: [
      { t: 'radio', id: 'title', n: 23, label: 'Select Membership Title', opts: ['General Member', 'Coordinator', 'HR Officer', 'Director', 'Ambassador', 'Youth Member', 'Professional Member', 'Youth Ambassador', 'Peace Ambassador', 'Secretary', 'Chief Investigation Officer', 'Commissioner', 'Other'], other: 'Other', req: 1 },
      { t: 'textarea', id: 'reason', n: 24, label: 'What is the reason for your interest in the human rights field?', req: 1 },
      { t: 'textarea', id: 'why', n: 25, label: 'Why do you want to join IHRC-USA?' },
      { t: 'textarea', id: 'contribute', n: 26, label: 'How can you contribute?', req: 1 },
    ] },
    { title: 'Social Perspective and Understanding', blocks: [
      { t: 'textarea', id: 'perspective', n: 27, label: 'What are human rights in your perspective?' },
      { t: 'textarea', id: 'violation', n: 28, label: 'What is a major human rights violation that you face or observe in the current environment?', req: 1 },
      { t: 'textarea', id: 'help', n: 29, label: 'How do you think you can help affected people?', req: 1 },
      { t: 'radio', id: 'socialExp', n: 30, label: 'Do you have any previous experience working in other social services or organizations? (Experience and Skills)', opts: YN },
      { t: 'textarea', id: 'skills', n: 31, label: 'What special skills do you have (writing skill, legal knowledge, field work, computer knowledge, media relations)?' },
    ] },
    { title: 'Dedication and Discipline', blocks: [
      { t: 'radio', id: 'hours', n: 32, label: 'How much time per week can you dedicate to this organization?', opts: ['15hrs', '20hrs', '25hrs', '35hrs', '40hrs'] },
      { t: 'radio', id: 'conduct', n: 33, label: 'Do you agree to follow the Code of Conduct, Rules and Confidentiality of the organization?', opts: YN, req: 1 },
      { t: 'radio', id: 'honest', n: 34, label: 'Will you act honestly and impartially in any difficult situation?', opts: YN, req: 1 },
    ] },
    { title: 'Background Check', blocks: [
      { t: 'radio', id: 'convicted', n: 35, label: 'Have you ever been convicted of a crime?', opts: YN },
      { t: 'radio', id: 'pending', n: 36, label: 'Are there any pending criminal cases against you?', opts: YN, req: 1 },
      { t: 'radio', id: 'political', n: 37, label: 'Are you associated with any political parties or extremist movements?', opts: YN, req: 1 },
      { t: 'text', id: 'politicalRole', n: 38, label: 'If yes, what is your role?', req: 1, showIf: { id: 'political', eq: 'Yes' } },
      { t: 'textarea', id: 'responsibility', n: 39, label: 'Explain your responsibility:', showIf: { id: 'political', eq: 'Yes' } },
    ] },
    { title: 'Security and Compliance', blocks: [
      { t: 'radio', id: 'security', n: 40, label: 'Security Risks: Are there any security threats to you in your country for holding a human rights identity card?', opts: YN },
      { t: 'textarea', id: 'securityDetails', n: 41, label: 'If Yes, Explain:', showIf: { id: 'security', eq: 'Yes' } },
      { t: 'radio', id: 'compliance', n: 42, label: 'Compliance with Regulations: Do you agree to fully follow the organization’s constitution, confidentiality, and humanitarian rules without any profit motive?', opts: YN, req: 1 },
      { t: 'textarea', id: 'role', n: 43, label: 'How do you see your role in IHRC-USA volunteer work?', req: 1 },
      { t: 'radio', id: 'health', n: 44, label: 'Issues or health problems that may affect your work?', opts: YN, req: 1 },
    ] },
    { title: 'Documents & Photograph', blocks: [
      { t: 'file', id: 'photo', n: 45, label: 'Photograph (35x45mm or 3.5x4cm)', notes: photoNotes, req: 1, file: { kinds: ['pdf', 'image'], maxMB: 1 } },
      { t: 'file', id: 'idDoc', n: 46, label: 'Identification Document', hint: '(National Identity card or Passport)', req: 1, file: { kinds: ['pdf', 'image'], maxMB: 10 } },
      { t: 'file', id: 'cv', n: 47, label: 'CV/Resume', req: 1, file: { kinds: ['pdf', 'document'], maxMB: 10 } },
      { t: 'file', id: 'police', n: 48, label: 'Police Verification: Can you submit a certificate confirming that you have no criminal background to verify your background?', req: 1, file: { kinds: ['pdf', 'document', 'image'], maxMB: 10 } },
      { t: 'file', id: 'eduCert', n: 49, label: 'Please upload all Educational Certificate', req: 1, file: { kinds: ['pdf'], maxMB: 100 } },
      { t: 'file', id: 'honoraryCert', n: 50, label: 'Please upload all Honorary Degree Certificate', hint: 'Only if you hold an honorary degree.', file: { kinds: ['pdf'], maxMB: 10 } },
      { t: 'textarea', id: 'recommenders', n: 51, label: 'Two people who can recommend you:', hint: '(Name, Address, contact number)' },
      { t: 'file', id: 'recLetter', n: 52, label: 'Two people who can recommend you:', hint: '( Please Upload Recommendation Letter)', req: 1, file: { kinds: ['pdf'], maxMB: 10 } },
    ] },
    { title: 'Members Restrictions & Regulations', blocks: [
      { t: 'radio', id: 'restrictions', n: 53, label: 'Members Restrictions & Regulations', lines: rules, opts: AGREE, req: 1, mustAgree: 'I agree' },
    ] },
    { title: 'Declaration & Agreement', blocks: [
      { t: 'radio', id: 'declaration', n: 54, label: 'Declaration & Agreement', lines: [
        '1. ' + declaration[0], '2. ' + declaration[1], '3. ' + declaration[2],
        '4. Although an IHRC-USA Member is authorized to work as part of IHRC-USA coalition projects, he/she is not authorized to represent or collect donations without the personal authorization of the headquarters.',
      ], opts: AGREE, req: 1, mustAgree: 'I agree' },
    ] },
    { title: 'Consent & Final Confirmation', blocks: [
      { t: 'radio', id: 'consent', n: 55, label: 'Privacy/Data Consent & Applicant Confirmation', lines: ['1. ' + consent], opts: AGREE, req: 1, mustAgree: 'I agree' },
    ] },
    { title: '', blocks: [
      { t: 'info', lines: ['If you have any questions or require additional information, please contact us at the following email address: globalihrc@gmail.com'] },
      { t: 'tel', id: 'emergency', n: '', label: 'Please provide an emergency phone number.' },
      { t: 'file', id: 'receipt', label: 'Please Upload Payment Receipt', req: 1, file: { kinds: ['pdf', 'image'], maxMB: 10 } },
    ] },
  ],
};
