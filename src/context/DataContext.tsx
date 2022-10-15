import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode"



const DataContext = createContext({})

export default DataContext

export function DataContextProvider({ children }: any) {

    const [user, setUser] = useState<any>({})
    const [Loader, setLoader] = useState<any>({
        createCareer: false,
        updateCareer: false,
        getCareer: false,
        deleteCareer: false,
        careerPage: false,
        getAllCandidates: false,
        fetchCandidates: false,
        deleteCandidate: false,
        approveCandidate: false,
        rejectCandidate: false,
        createMeeting: false,
        getMeeting: false,
        deleteMeeting: false,
        githubUsers: false
    })
    const [Error, setError] = useState<any>({
        getCareer: null,
        careerPage: null,
        candidateApplication: null,
        fetchCandidates: null,
        deleteCandidate: null,
        approveCandidate: null,
        rejectCandidate: null,
        createMeeting: null,
        getMeeting: null,
        deleteMeeting: null,
        githubUsers: null
    })
    const [Data, setData] = useState<any>({
        careers: [],
        meetings: [],
        careerPage: [],
        candidates: [],
        githubUsers: []
    })

    useEffect(() => {
        if (localStorage.getItem("meetvast") !== null) {
            const info = JSON.parse(localStorage.getItem("meetvast")!)
            setUser(info)
        }

    }, [])
    const isAuthenticated = isLoggedIn()

    const logout = () => {
        localStorage.clear()
        window.location.href = "/auth"
    }

    const ProviderParams= {
        logout,
        isAuthenticated,
        user,
        Loader,
        Data,
        Error,
        setError,
        setData,
        setLoader
    }

    return (
        <DataContext.Provider value={ProviderParams}>
            {children}
        </DataContext.Provider>
    )
}

function isLoggedIn() {

    const authToken = localStorage.getItem("authToken")
            
    if (authToken === null) {
        return false;
    }

    const token = JSON.parse(authToken);

    if (!token) {
        return false
    }

    try {
        // exp gives us date in miliseconds
        let { exp } : any = jwtDecode(token);

        // convert milliseconds -> seconds
        let date = new Date().getTime() / 1000;

        // check if exp date is < the present date
        if (exp < date) {
            return false;
        }
    } catch (e) {
        return false;
    }

    return true;

}