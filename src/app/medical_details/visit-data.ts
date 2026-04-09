export type VisitStatus = "upcoming" | "past";

export type Visit = {
    id: string;
    status: VisitStatus;
    date: string;
    doctor: string;
    specialty: string;
    location: string;
    summary: string;
};

export const visitHistory: Visit[] = [
    {
        id: "visit-11",
        status: "upcoming",
        date: "22 Apr 2026",
        doctor: "Dr. Anna Keller",
        specialty: "General Practice",
        location: "Munich City Center",
        summary: "Annual check-up and blood pressure review.",
    },
    {
        id: "visit-12",
        status: "upcoming",
        date: "06 May 2026",
        doctor: "Dr. Mehmet Yilmaz",
        specialty: "Cardiology",
        location: "Schwabing",
        summary: "Repeat ECG follow-up to confirm palpitations have settled.",
    },
    {
        id: "visit-01",
        status: "past",
        date: "08 Apr 2026",
        doctor: "Dr. Anna Keller",
        specialty: "General Practice",
        location: "Munich City Center",
        summary: "Annual check-up and blood pressure review.",
    },
    {
        id: "visit-02",
        status: "past",
        date: "14 Feb 2026",
        doctor: "Dr. Mehmet Yilmaz",
        specialty: "Cardiology",
        location: "Schwabing",
        summary: "Follow-up for palpitations and ECG discussion.",
    },
    {
        id: "visit-03",
        status: "past",
        date: "03 Dec 2025",
        doctor: "Dr. Sophie Brandt",
        specialty: "Dermatology",
        location: "Maxvorstadt",
        summary: "Skin screening and mole monitoring.",
    },
    {
        id: "visit-04",
        status: "past",
        date: "21 Oct 2025",
        doctor: "Dr. Lukas Werner",
        specialty: "Orthopedics",
        location: "Bogenhausen",
        summary: "Knee pain assessment after running injury.",
    },
    {
        id: "visit-05",
        status: "past",
        date: "12 Aug 2025",
        doctor: "Dr. Clara Neumann",
        specialty: "Gynecology",
        location: "Haidhausen",
        summary: "Routine preventive exam and lab referral.",
    },
    {
        id: "visit-06",
        status: "past",
        date: "25 Jun 2025",
        doctor: "Dr. Jonas Beck",
        specialty: "ENT",
        location: "Neuhausen",
        summary: "Recurring sinus pressure and allergy symptoms.",
    },
    {
        id: "visit-07",
        status: "past",
        date: "09 Apr 2025",
        doctor: "Dr. Eva Schmitt",
        specialty: "Neurology",
        location: "Glockenbachviertel",
        summary: "Migraine consultation and medication adjustment.",
    },
    {
        id: "visit-08",
        status: "past",
        date: "17 Jan 2025",
        doctor: "Dr. David Roth",
        specialty: "Gastroenterology",
        location: "Sendling",
        summary: "Digestive complaints and nutrition advice.",
    },
    {
        id: "visit-09",
        status: "past",
        date: "04 Nov 2024",
        doctor: "Dr. Miriam Vogel",
        specialty: "Ophthalmology",
        location: "Lehel",
        summary: "Vision check and dry eye treatment plan.",
    },
    {
        id: "visit-10",
        status: "past",
        date: "28 Aug 2024",
        doctor: "Dr. Felix Braun",
        specialty: "Endocrinology",
        location: "Isarvorstadt",
        summary: "Thyroid lab review and long-term monitoring.",
    },
];

export const futureAppointmentProposals = [
    {
        id: "proposal-01",
        timeframe: "Suggested for May 2026",
        doctor: "Dr. Mehmet Yilmaz",
        specialty: "Cardiology",
        reason: "Repeat ECG and check whether the palpitations have fully settled.",
    },
];

export function getVisitById(visitId: string) {
    return visitHistory.find((visit) => visit.id === visitId);
}