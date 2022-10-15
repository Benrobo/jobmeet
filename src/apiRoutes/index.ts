import { BASE_URL } from "../config";

const APIROUTES = {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    createCareer: `${BASE_URL}/career/create`,
    updateCareer: `${BASE_URL}/career/update`,
    deleteCareer: `${BASE_URL}/career/delete`,
    careerById: `${BASE_URL}/career/byId`,
    careerByUserId: `${BASE_URL}/career/byUserId`,
    addCandidate: `${BASE_URL}/candidate/add`,
    deleteCandidate: `${BASE_URL}/candidate/delete`,
    allCandidate: `${BASE_URL}/candidate/getAll`,
    candidateByOrgId: `${BASE_URL}/candidate`,
    updateCandidateStatus: `${BASE_URL}/candidate/update`,
    createMeeting: `${BASE_URL}/meeting/create`,
    meetingByUserId: `${BASE_URL}/meeting/byUserId`,
    meetingById: `${BASE_URL}/meeting`,
    deleteMeeting: `${BASE_URL}/meeting/delete`,
}

export default APIROUTES;