export const DONATE_URL = '';

// ---- Backend connection -------------------------------------------------
// Put your backend URL here (example: 'https://api.yourdomain.com/forms').
// Every form on the site (Membership, Volunteer, Contact, Partnership request,
// NGO Partnership Application) will POST to this URL.
//   Forms without files  -> JSON: { form, subject, submittedAt, data: { "<question>": "<answer>", ... } }
//   Forms with uploads (Volunteer, Membership) -> multipart/form-data with the parts:
//     form, subject, submittedAt, data (a JSON string of the answers),
//     and one file part per upload named photo, idDoc, cv, police, eduCert, honoraryCert, recLetter, receipt
// A 2xx response means success. While this is empty, forms fall back to opening
// the visitor's email app (mailto) so nothing breaks before the backend is ready.
export const FORM_ENDPOINT = '';
