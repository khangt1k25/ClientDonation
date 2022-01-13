import React from "react";
import {Card, Button, Form} from "react-bootstrap";
import {Route} from "react-dom";
import { useState, useEffect} from "react";
import CampaignCard from "./CampaignCard";
import Web3 from "web3";
import Store from '../contracts/Store.json';
import CampaignNFT from '../contracts/CampaignNFT.json';
import {STORE_ADDRESS } from '../config';
import Slider from 'react-slick';
import don from '../donate.png';

const LandingPage = () => {
    const [campaigns, setcampaigns] = useState([])
    const [nocampaign, setnocampaign] = useState(0)
    const [account, setaccount] = useState("0x0000000000000000000000000000000000000000")
    const [isCreate, setisCreate] = useState(false)
    
    const [namecampaign, setnamecampaign] = useState('')
    const [slot, setslot] = useState(0)
    const [price, setprice] = useState(0)
    
    const createTemplate = <div className='create' style={{marginTop:100, marginLeft:400, marginRight:400, marginBottom:50}}>
            <hr/>
            <h3>Create your own campaign</h3>
            <Form>
                <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control  value={namecampaign} onChange={e=>setnamecampaign(e.target.value)} type="text" placeholder="Enter name" />
                    <Form.Label>Slot</Form.Label>
                    <Form.Control  value={slot} onChange={e=>setslot(e.target.value)} type="number" placeholder= "Enter slot "/>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control  value={price} onChange={e=>setprice(e.target.value)} type="number" placeholder= "Enter minimum price "/>
                </Form.Group>
                <Button onClick={createCampaign}>Create</Button>
            </Form>
    </div>
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        rows: 1
        
    };
    async function loadBlockchainData(){
        console.log(isCreate)
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()

        setaccount(accounts[0])

        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)

        const isWhitelister = await store.methods.isWhitelister(accounts[0]).call()
        setisCreate(isWhitelister)


        const numbers = await store.methods._campaign_count().call()
        setnocampaign(numbers)
        const alls = []
        for (let i = 0; i < numbers; i++) {
            const c = await store.methods.campaigns(i).call()
            alls.push({'id':i, 'value':c})
        }
        setcampaigns(alls)
    }
    async function createCampaign() {

        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)
        let crt
        crt = await store.methods.createCampaign(namecampaign, slot, price).send({from: account})
        window.location.reload();
    }
    useEffect(() => {
        loadBlockchainData()
    }, [])

    return (
        <div className='landingPage' >
            <div className='viewbg'>
                <img src={don} style={{height:350, width:400}} alt="donate" />
            </div>
            
            <div className='viewSystem' style={{marginTop:30, marginLeft:100, marginRight:100, marginBottom:50}}>
                <hr/>
                <h3>Total Campaigns: {nocampaign}</h3>
                <Slider {...settings}>
                    {campaigns.map(
                        (camp)=> {
                        return <CampaignCard key={camp.id} camp={camp.value}/>
                        }
                    )} 
                </Slider>
            </div>

            {isCreate?createTemplate:<div></div>}
          
        </div>
    )


}
export default LandingPage;