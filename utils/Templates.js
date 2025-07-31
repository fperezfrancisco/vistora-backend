const payerTemplates = {
    "Blue Cross Blue Shield": {
      header:
        "Blue Cross Blue Shield Appeals Department\n1234 Insurance Way\nChicago, IL 60601\nPhone: (800) 262-2583\nFax: (555) 123-4567",
      greeting: "Dear Appeals Review Team,",
      footer:
        "Thank you for your prompt consideration of this appeal. Please contact me at [Provider Phone] if you require any additional information.\n\nSincerely,\n\n[Provider Name], MD\n[Provider Title]\nNPI: [Provider NPI]\nTax ID: [Provider Tax ID]",
      submissionMethod: "Fax: (555) 123-4567 or Online Portal",
    },
    Aetna: {
      header:
        "Aetna Medical Affairs\nAppeals and Grievances Department\n151 Farmington Avenue\nHartford, CT 06156\nPhone: (800) 872-3862\nFax: (860) 273-0123",
      greeting: "To the Medical Review Committee:",
      footer:
        "I appreciate your time and consideration in reviewing this appeal. Should you need additional clinical information, please do not hesitate to contact our office.\n\nRespectfully submitted,\n\n[Provider Name], MD\n[Provider Credentials]\nNPI: [Provider NPI]",
      submissionMethod: "Fax: (860) 273-0123 or Aetna Provider Portal",
    },
    Cigna: {
      header:
        "Cigna Healthcare\nAppeals and Grievances Department\n900 Cottage Grove Rd\nBloomfield, CT 06002\nPhone: (800) 882-4462\nFax: (860) 226-6741",
      greeting: "Dear Medical Review Team,",
      footer:
        "I appreciate your prompt attention to this matter and look forward to a favorable reconsideration of this claim.\n\nSincerely,\n\n[Provider Name], MD\n[License Number]\nNPI: [Provider NPI]",
      submissionMethod: "Fax: (860) 226-6741 or CignaForHCP.com",
    },
    UnitedHealthcare: {
      header:
        "UnitedHealthcare\nAppeals Department\n9900 Bren Road East\nMinnetonka, MN 55343\nPhone: (877) 842-3210\nFax: (888) 463-4128",
      greeting: "Dear Appeals Review Committee,",
      footer:
        "Please contact our office if additional documentation is needed to support this appeal.\n\nSincerely,\n\n[Provider Name], MD\n[Provider Title]\nNPI: [Provider NPI]",
      submissionMethod: "Fax: (888) 463-4128 or UHCprovider.com",
    },
    Humana: {
      header:
        "Humana Inc.\nProvider Appeals Department\n500 West Main Street\nLouisville, KY 40202\nPhone: (800) 457-4708\nFax: (502) 580-1234",
      greeting: "To Whom It May Concern:",
      footer:
        "Thank you for your consideration. I am available to discuss this case further if needed.\n\nRespectfully,\n\n[Provider Name], MD\nNPI: [Provider NPI]\nProvider ID: [Provider ID]",
      submissionMethod: "Fax: (502) 580-1234 or Humana Provider Portal",
    },
    Medicare: {
      header:
        "Medicare Appeals Department\n7500 Security Boulevard\nBaltimore, MD 21244\nPhone: (800) 633-4227\nFax: (410) 786-2580",
      greeting: "Dear Medicare Review Committee,",
      footer:
        "Thank you for your consideration of this appeal. Please contact our office if additional information is required.\n\nRespectfully,\n\n[Provider Name], MD\nNPI: [Provider NPI]\nMedicare Provider Number: [Provider Number]",
      submissionMethod: "Fax: (410) 786-2580 or Medicare Portal",
    },
    Medicaid: {
      header:
        "State Medicaid Appeals Department\n[State Address]\nPhone: [State Phone]\nFax: [State Fax]",
      greeting: "Dear Medicaid Review Committee,",
      footer:
        "Thank you for your consideration. Please contact our office if you need additional documentation.\n\nSincerely,\n\n[Provider Name], MD\nNPI: [Provider NPI]\nMedicaid Provider ID: [Provider ID]",
      submissionMethod: "State Medicaid Portal or Fax",
    },
  }

const appealTemplates = {
    99211: {
      "Medical necessity not established": {
        justification:
          "This Level 1 E/M service was medically necessary as the patient required evaluation by a qualified healthcare professional. The service involved assessment of the patient's condition, review of symptoms, and clinical decision-making that could not be performed by nursing staff alone.",
        medicalNecessity:
          "The patient presented with symptoms requiring professional medical evaluation. Clinical assessment was necessary to determine appropriate treatment and ensure patient safety. This service met the requirements for 99211 as it involved a problem-focused encounter requiring physician oversight.",
      },
      "Services not covered": {
        justification:
          "The 99211 service provided was a covered benefit under the patient's plan. This was a necessary follow-up visit for ongoing medical management, not a routine or preventive service. The patient required professional medical evaluation that falls within covered services.",
        medicalNecessity:
          "This visit was medically necessary for continued care management. The patient's condition required professional assessment and monitoring that could not be deferred or provided through alternative means.",
      },
      "Prior authorization required": {
        justification:
          "Level 1 E/M services (99211) typically do not require prior authorization as they represent basic evaluation and management services. This was an established patient visit for ongoing care management, which is generally a covered service without pre-authorization requirements.",
        medicalNecessity:
          "The medical necessity for this visit was clearly established by the patient's ongoing condition requiring professional medical oversight and evaluation.",
      },
    },
    99212: {
      "Medical necessity not established": {
        justification:
          "This Level 2 E/M service was medically necessary due to the complexity of the patient's presentation. The encounter required a problem-focused history, examination, and straightforward medical decision-making that was appropriate for the patient's condition and symptoms.",
        medicalNecessity:
          "The patient presented with symptoms requiring a comprehensive evaluation that included detailed history-taking, physical examination, and medical decision-making. The level of service was appropriate for the complexity of the case and the time spent with the patient.",
      },
      "Services not covered": {
        justification:
          "The 99212 service represents a standard office visit for an established patient, which is a covered benefit under most insurance plans. This was not a routine physical or preventive service, but rather a problem-focused visit addressing specific medical concerns.",
        medicalNecessity:
          "The medical necessity is demonstrated by the patient's presenting symptoms and the need for professional medical evaluation and management that required face-to-face physician time and clinical decision-making.",
      },
      "Insufficient documentation": {
        justification:
          "The documentation provided supports the 99212 level of service. The medical record includes appropriate history, examination findings, assessment, and plan that justify this level of evaluation and management service.",
        medicalNecessity:
          "The encounter met all requirements for 99212 including problem-focused history, problem-focused examination, and straightforward medical decision-making as documented in the patient's medical record.",
      },
    },
    99213: {
      "Medical necessity not established": {
        justification:
          "This Level 3 E/M service was medically necessary due to the patient's complex medical presentation requiring detailed evaluation and management. The encounter involved expanded problem-focused history, examination, and medical decision-making of low complexity, which was appropriate for the patient's condition.",
        medicalNecessity:
          "The patient presented with symptoms requiring comprehensive evaluation including detailed history-taking, examination, and medical decision-making. The complexity of the patient's condition and the time required for proper assessment and treatment planning justified this level of service.",
      },
      "Duplicate procedure codes": {
        justification:
          "This 99213 service was a distinct and separate encounter from any other services provided. The medical record clearly documents that this was an independent evaluation and management service that was not bundled with or duplicative of any other procedures performed.",
        medicalNecessity:
          "Each 99213 service provided represented a separate and necessary medical encounter. The documentation supports that these were distinct visits addressing different medical issues or follow-up care that required separate evaluation and management.",
      },
      "Insufficient documentation": {
        justification:
          "The medical record contains comprehensive documentation supporting the 99213 level of service. The documentation includes detailed history, examination findings, medical decision-making, and treatment plan that clearly justify this level of evaluation and management.",
        medicalNecessity:
          "The documentation demonstrates medical necessity through detailed recording of the patient's symptoms, clinical findings, diagnostic considerations, and treatment decisions that required this level of evaluation and management service.",
      },
      "Coding error - incorrect CPT code used": {
        justification:
          "The CPT code 99213 was appropriately selected based on the complexity of the patient encounter. The service provided met all criteria for a Level 3 evaluation and management visit including expanded problem-focused history, detailed examination, and medical decision-making of low complexity.",
        medicalNecessity:
          "The medical record clearly supports the use of 99213 with comprehensive documentation of the patient's condition, examination findings, and treatment planning that required this level of professional evaluation and management.",
      },
    },
    99214: {
      "Medical necessity not established": {
        justification:
          "This Level 4 E/M service was medically necessary due to the complexity of the patient's condition requiring detailed history, comprehensive examination, and medical decision-making of moderate complexity. The patient's presentation warranted this higher level of evaluation and management.",
        medicalNecessity:
          "The patient presented with a complex medical condition requiring extensive evaluation including comprehensive history-taking, detailed examination, and moderate complexity medical decision-making. The severity and complexity of the case justified the time and resources required for this level of service.",
      },
      "Duplicate procedure codes": {
        justification:
          "Each 99214 service provided was a distinct and separate evaluation and management encounter. The medical records clearly document that these were independent visits addressing different aspects of the patient's care or separate medical issues requiring individual assessment.",
        medicalNecessity:
          "The medical necessity for each encounter is well-documented, showing that each 99214 service addressed separate medical needs or different stages of treatment that required individual evaluation and management.",
      },
      "Insufficient documentation": {
        justification:
          "The medical record provides comprehensive documentation supporting the 99214 level of service, including detailed history, comprehensive examination, assessment, and plan that demonstrate the complexity and necessity of this level of care.",
        medicalNecessity:
          "The documentation clearly establishes medical necessity through detailed recording of patient history, comprehensive physical examination findings, complex medical decision-making, and treatment planning that justified this level of evaluation and management.",
      },
      "Medical necessity not established - requires additional documentation": {
        justification:
          "The medical necessity for this Level 4 E/M service is clearly established in the comprehensive medical record. The patient's complex presentation required detailed evaluation, comprehensive examination, and moderate complexity medical decision-making that warranted this level of service.",
        medicalNecessity:
          "The patient's condition necessitated extensive clinical evaluation and complex medical decision-making. The comprehensive documentation provided demonstrates the medical necessity and appropriateness of the 99214 service level based on the patient's clinical presentation and treatment requirements.",
      },
    },
    99215: {
      "Medical necessity not established": {
        justification:
          "This Level 5 E/M service was medically necessary due to the high complexity of the patient's condition requiring comprehensive history, comprehensive examination, and medical decision-making of high complexity. The patient's presentation involved multiple comorbidities and complex diagnostic considerations.",
        medicalNecessity:
          "The patient presented with a highly complex medical situation involving multiple systems, significant comorbidities, and high-risk decision-making. The comprehensive evaluation required extensive time, detailed assessment, and complex medical decision-making that justified this highest level of evaluation and management service.",
      },
      "Insufficient documentation": {
        justification:
          "The medical record contains extensive documentation supporting the 99215 level of service, including comprehensive history, detailed examination, complex assessment, and sophisticated treatment planning that demonstrates the high level of medical decision-making involved.",
        medicalNecessity:
          "The documentation clearly supports the medical necessity through comprehensive recording of the patient's complex medical history, detailed physical examination, sophisticated diagnostic reasoning, and complex treatment decisions that required this highest level of evaluation and management.",
      },
      "Services not covered": {
        justification:
          "The 99215 service represents the highest level of office-based evaluation and management, which is a covered benefit when medically necessary. This was not a routine service but rather a complex medical encounter requiring the highest level of physician expertise and time.",
        medicalNecessity:
          "The medical necessity is clearly established by the complexity of the patient's condition, the extensive evaluation required, and the high-level medical decision-making involved in the patient's care management.",
      },
      "Duplicate claim - previous claim already processed": {
        justification:
          "This 99215 service represents a distinct and separate evaluation and management encounter that was not previously processed. The medical record clearly documents this was an independent visit with unique medical decision-making and treatment planning.",
        medicalNecessity:
          "Each encounter represents a separate medical necessity with distinct evaluation, examination, and treatment planning. The comprehensive documentation supports that this was not a duplicate service but rather a medically necessary independent evaluation.",
      },
    },
  }

function getPayerTemplate(payerName){
  return payerTemplates[payerName] || null;
}

function getAppealTemplate(cptCode, denialReason) {
  const codeTemplates = appealTemplates[cptCode];
  if (!codeTemplates) return null;

  return codeTemplates[denialReason] || null;
}

module.exports = { getPayerTemplate, getAppealTemplate }