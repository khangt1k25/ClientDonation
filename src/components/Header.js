import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRouter from "./AppRouter";

const Header = ({account, balance}) => {
    return (
        <nav className="navbar navbar-light" style={{backgroundColor: "#e3f2fd"}} >
            <div className="container">
                <a className="navbar-brand" href="/">World Donation</a>
                <div>
                    <p>Address: {account}</p>
                    <p>Balance: {balance}</p>
                </div>
            </div>
        </nav>
    )
}
export default Header;