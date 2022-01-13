import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import Store from './contracts/Store.json';
import CampaignNFT from './contracts/CampaignNFT.json';
import {STORE_ADDRESS } from './config';
import AppRouter from './components/AppRouter';
import Header from './components/Header';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [account, setaccount] = useState('0x0000000000000000000000000000000000000000')                              
  const [balance, setbalance] = useState(0)
  // const [nocampaign, setnoCampaign] = useState(0)
  // const [campaigns, setcampaigns] = useState([])

 
  async function loadBlockchainData(){
    
    const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
    const network = await web3.eth.net.getNetworkType()
    const accounts = await web3.eth.getAccounts()
    setaccount(accounts[0])
    const amount = await web3.eth.getBalance(account)
    setbalance(amount)
  }
  
  useEffect(() => {
    loadBlockchainData()
  }, [])
  return (
   
    <div className='App'>
       <BrowserRouter>
        <Header account={account} balance={balance} />
        <AppRouter/>
      </BrowserRouter>
  
    </div>
    
    
  );
  
}

export default App;