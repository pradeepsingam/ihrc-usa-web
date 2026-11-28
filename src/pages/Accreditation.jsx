import ManagedForm from '../components/ManagedForm';
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
          <ManagedForm slug="accreditation"/>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>{editableCopy["text-disclaimer"]}</strong>{" "+editableCopy["text-ihrc-usa-accreditation-is-a-private-institutional-recognition-it-"]}</div>

      </div>
    </Page>
  );
}
