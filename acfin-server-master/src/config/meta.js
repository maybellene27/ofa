/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */
/* eslint-disable require-unicode-regexp */
/* eslint-disable prefer-named-capture-group */

module.exports = {
    // eslint-disable-next-line security/detect-unsafe-regex
    usernameRegex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    passwordRegex: new RegExp('.{10,}'),
    padDates: false,
    padTimes: false,
    guestUserTemplate: {
        firstName: 'Guest',
        middleName: '',
        lastName: 'User',
        suffix: '',
        email: 'devops@maroonstudios.com',
        userRole: [ 'guest' ],
        userType: 'Internal',
        password: 'maroon12345',
        createdBy: null,
        updatedBy: null
    },
    adminUserTemplate: {
        firstName: 'Admin',
        middleName: '',
        lastName: 'User',
        suffix: '',
        userType: 'Internal',
        userRole: [ 'admin' ],
        password: 'maroon12345',
        createdBy: null,
        updatedBy: null
    },
    usernamePath: {
        default: `email`,
        admin: `email`,
        guest: `email`,
        customer: `email`
    },
    salutations: [
        '',
        "Mr.",
        "Mrs.",
        "Miss",
        "Dr.",
        "Ms.",
        "Prof.",
        "Rev.",
        "Lady",
        "Sir",
        "Capt.",
        "Major",
        "Lt.-Col.",
        "Col.",
        "Lady",
        "Lt.-Cmdr.",
        "The Hon.",
        "Cmdr.",
        "Flt. Lt.",
        "Brgdr.",
        "Judge",
        "Lord",
        "The Hon. Mrs",
        "Wng. Cmdr.",
        "Group Capt.",
        "Rt. Hon. Lord",
        "Revd. Father",
        "Revd Canon",
        "Maj.-Gen.",
        "Air Cdre.",
        "Viscount",
        "Dame",
        "Rear Admrl.",
        "Dir.",
        "Hon."
    ],
    researcherType: [
        "Farmer",
        "Government Employee",
        "Business by Private Sector",
        "Professional",
        "Researcher",
        "Student",
        "Policy Maker",
        "Others"
    ],
    researchTypes: [
        "Technology Commercialization",
        "Institutional Development",
        "Socio-economic",
        "Basic/strategic and applied"
    ],
    daLevelIndicators: [
        "Production-related R&D activities",
        "Postharvest-related R&D activities",
        "Market-related R&D activities",
        "Extension-related R&D activities",
        "Policy-related R&D activities",
        "Upgrading Research Facilities",
        "Not Applicable"
    ],
    da12KeyStrategies: [
        "Farm Clustering/Bayanihan Agri Clusters (BACs)",
        "Province-Led Agriculture and Fisheries Extension System (PAFES)",
        "Agri-Industrial Business Corridors (ABCs)",
        "Infrastructure Investments",
        "Post-Harvest, Processing Logistics, & Marketing Support",
        "Digital Agriculture",
        "Climate Change Adaptation & Mitigation Measures",
        "Mobilization & Empowerment of Partners to Attain Scale",
        "Global Trade, Export Development, & Promotion",
        "Food Safety & Regulations",
        "Ease of Doing Business & Transparent Procurement",
        "Strategic Communication Support",
        "Not Applicable"
    ],
    barR4DStrategies: [
        "Innovative Production & Postproduction Technologies w/ Farm-level & Industry Application",
        "Development of Sustainable Robust & Technology-based Agri-enterprises",
        "Responsive Technology-based Support Services & other enabling Systems/Services",
        "Not Applicable"
    ],
    potentialIPR: [
        "Patent",
        "Utility Model",
        "Trademark",
        "Not Applicable"
    ],
    resourceRequirements: [
        "Firm Infrastructure (Facilities)",
        "Equipment",
        "Human Resource",
        "Inputs",
        "Operations",
        "Outbound logistics - include all the activities required to collect, store,and distribute the output",
        "Marketing &Sales - activities inform buyers about products and services, induce buyers to purchase them, and facilitate their purchase.",
        "Services and Trainings"
    ],
    programs: [
        "Rice",
        "Climate Change",
        "Corn",
        "High Value",
        "Organic Agriculture",
        "Biotechnology",
        "Institutional Development",
        "Technology Commercialization",
        "ACEF",
        "Livestock and Poultry",
        "AFMA"
    ],
    collaboratorType: [
        "Farmer Cooperative/Association",
        "State University/College",
        "National/Regional Government Agency/Institution",
        "Private Sector/Business Sector",
        "NGO/CSO"
    ],
    commodity: [
        "Corn Industry",
        "Cassava Industry",
        "Adlay Industry",
        "Crop Industry",
        "Biofuel Industry",
        "Vegetables, Leguems, and Rootcrops Industry",
        "Fruit Industry",
        "Poultry and Livestock Industry",
        "Apiculture Industry",
        "Aquaculture Industry",
        "Capture Fisheries Industry"
    ],
    actions: [
        'Recommend',
        'Approve',
        'Endorse',
        'Validate' 
    ],
    discriminatorKeys: [
        'proposalApprove',
        'proposalEndorse',
        'proposalRecommend',
        'dv',
        'ors',
        'lddap',
        'progressReport',
        'completion',
        'proposalUpdate' 
    ]
}