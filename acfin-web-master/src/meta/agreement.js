const agreement = {
  firstAgreement: `I/We hereby certify that all data and statements in this application are correct and complete, and
  are made for the purpose of obtaining credit and the signatures appearing hereon are genuine.
  I/We authorize you to obtain such information as you may require concerning the statements made in this
  application and that the sources from which you may verify are authorized to provide any information relative
  to this application. I agree that the application may remain your property whether the credit is granted or not.`,
  secondAgreement: (company) => {
    return `I hereby give full consent to ${company} (the "Company"), its authorized
    representatives, dealerships, and agents to collect, record, organize, store, update, share, use,
    consolidate, block, erase, or otherwise process information, whether personal, sensitive, or
    privileged, pertaining to myself and the transactions subject hereof pursuant to the provisions of
    the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.`
  },
  purpose: [
    'Quality Assurance, including callouts for products and service satisfaction purposes;',
    'Warranty, including notices for recalls and service campaigns;',
    'Research, including update of records, invitation to focus group discussions, surveys, satisfaction, indexing, and similar studies; and,',
    'Marketing, including promotional offers for services, parts, and new vehicle introductions.'
  ]
}
export default agreement
