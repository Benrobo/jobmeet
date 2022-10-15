import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import "./App.css"
import ProtectedRoute from './components/ProtectedRoute'
import { DataContextProvider } from './context/DataContext'
import Authentication from './pages/Auth/auth'
import CareerAuthorPage from './pages/Career/author'
import CandidateCareerPage from './pages/Career/candidate'
import CandidateDocument from './pages/Career/candidateDoc'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/Home'
import JobApplications from './pages/JobApplication/jobApplication'
import Meet from './pages/Meet'



function App() {

  return (
    <DataContextProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/dashboard' element={
            <ProtectedRoute children={<Dashboard />} />
          } />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/job/applications' element={
            <ProtectedRoute children={<JobApplications />} />
          } />
          <Route path='/career' element={
            <ProtectedRoute children={<CareerAuthorPage />} />
          } />
          <Route path='/meet/:meetId' element={
            <ProtectedRoute children={<Meet />} />
          } />
          <Route path='/career/:career_id' element={<CandidateCareerPage />} />
          <Route path='/candidate/:candidateId' element={<CandidateDocument />} />
        </Routes>
      </Router>
    </div>
    </DataContextProvider>
  )
}

export default App
