import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import App from '../App';
import Project from './Project';
import LandingPage from './LandingPage';
import Admin from './Admin';

const AppRouter = () => {
    return (
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/project/:id" element={<Project />}/>
                <Route path='/admin' element={<Admin/>} /> 
            </Routes>
    )
}


export default AppRouter;