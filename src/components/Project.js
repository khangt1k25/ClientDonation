import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom"
import Store from '../contracts/Store.json';
import CampaignNFT from '../contracts/CampaignNFT.json';
import { HYGGE_TOKEN_ADDRESS, STORE_ADDRESS } from '../config';
import Web3 from 'web3';
import { Row, Col, Container, Button, Form} from 'react-bootstrap';
import '../css/table.css';

function Project ()  {
    const { id } = useParams()
    const [Account, setAccount] = useState('0x0')
    const [Name, setName] = useState('')
    const [Creator, setCreator] = useState('0x0')
    const [Wallet, setWallet] = useState('0x0')
    const [Current, setCurrent] = useState(0)
    const [Slot, setSlot] = useState(0)
    const [Price, setPrice] = useState(0)
    const [DonorCount, setDonorCount] = useState(0)
    const [DoneeCount, setDoneeCount] = useState(0)
    const [Donors, setDonors] = useState([])
    const [Donees, setDonees] = useState([])
    const [imageURL, setimageURL] = useState('')

    
    const [nftURI, setnftURI] = useState('')
    const [AmountDonate, setAmountDonate] = useState(0)
    const [doneeID, setdoneeID] = useState(0)
    const [AmountDistribute, setAmountDistribute] = useState(0)
    
    const [isDonor, setisDonor] = useState(false)
    const [isDonee, setisDonee] = useState(false)

    async function loadBlockchainData(){
    
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        // console.log(accounts[0])
        setAccount(accounts[0])

        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)

        const c = await store.methods.campaigns(id).call()
        const campwallet = c.wallet

        setName(c.name)
        setCreator(c.creator)
        setWallet(c.wallet)
        
        const campaignNFT = new web3.eth.Contract(CampaignNFT.abi, campwallet)
        
        const idonor = await campaignNFT.methods.isDonor().call()
        setisDonor(idonor)
        // console.log(isdonor)
        const idonee = await campaignNFT.methods.isDonee().call()
        setisDonee(idonee)

        const n = await campaignNFT.methods.current().call()
        const s = await campaignNFT.methods.slot().call()
        const p = await campaignNFT.methods.price().call()
        setCurrent(n)
        setSlot(s)
        setPrice(p)

        const donorCount = await campaignNFT.methods.donorsCount().call()
        setDonorCount(donorCount)
        const allDonors = []
        for (let i = 1; i <= donorCount; i++) {
            const c = await campaignNFT.methods.donors(i).call()
            allDonors.push({'id':i, 'value':c})
        }
        setDonors(allDonors)

        const doneeCount = await campaignNFT.methods.doneesCount().call()
        setDoneeCount(doneeCount)
        const alldonees = []
        for (let i = 1; i <= doneeCount; i++) {
            const c = await campaignNFT.methods.donees(i).call()
            alldonees.push({'id':i, 'value':c})
        }
        setDonees(alldonees)
        
    }
    async function donate (){
        console.log('donate')   
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const campaignNFT = new web3.eth.Contract(CampaignNFT.abi, Wallet)
        let don
        if (!nftURI){
            don  = await campaignNFT.methods.donate().send({from: Account, value: AmountDonate})
        }else{
            don  = await campaignNFT.methods.mint(nftURI).send({from: Account, value: AmountDonate})
        }
        window.location.reload();
    }
    async function apply(){
        console.log('apply')   
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const campaignNFT = new web3.eth.Contract(CampaignNFT.abi, Wallet)
        const ap  = await campaignNFT.methods.applyToDonee().send({from: Account})
        window.location.reload();
    }
    async function distribute (){
        console.log('distribute')   
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const campaignNFT = new web3.eth.Contract(CampaignNFT.abi, Wallet)
        let dis
        dis  = await campaignNFT.methods.distribute(doneeID, AmountDistribute).send({from: Account})
        window.location.reload();
    }
    useEffect(() => {
        loadBlockchainData()
    }, [])
    let decided
    if (Account==Creator){
        decided = <div clasName="formCreator" style={{marginLeft:300, marginRight:300}}>
            <Form>
                <Form.Group className="mb-4 p-4" controlId="formBasicEmail">
                    <Form.Label>Donee ID</Form.Label>
                    <Form.Control  value={doneeID} onChange={e=>setdoneeID(e.target.value)} type="number" placeholder="Enter ID" />
                    <Form.Label>Amount (ETH)</Form.Label>
                    <Form.Control  value={AmountDistribute} onChange={e=>setAmountDistribute(e.target.value)} type="number" placeholder= "Enter amount ETH "/>
                </Form.Group>
                <Button onClick={distribute}>Distribute</Button>
            </Form>
        </div>
        
    } else if (isDonor || isDonee) {
        decided = <div clasName="formDonor" style={{marginLeft:300, marginRight:300}}>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>NFT URI</Form.Label>
                    <Form.Control value={nftURI} onChange={e=>setnftURI(e.target.value)} type="text" placeholder="Enter nftURI" />
                    <Form.Label>Amount (ETH)</Form.Label>
                    <Form.Control value={AmountDonate} onChange={e=>setAmountDonate(e.target.value)} type="number" placeholder= {"Minimum "+ Price} />
                </Form.Group>
                <Button onClick={donate}>Donate</Button>
            </Form>
        </div>
    
    } else{
        decided = <div clasName="formDonor" style={{marginLeft:200, marginRight:200}}>
            <Container>
                <Row>
                    <Col>
                    <Form>
                        <Form.Group className="donate mb-3" controlId="formBasicEmail">
                                <Form.Label>NFT URI</Form.Label>
                                <Form.Control value={nftURI} onChange={e=>setnftURI(e.target.value)} type="text" placeholder="Enter nftURI" />
                                <Form.Label>Amount (ETH)</Form.Label>
                                <Form.Control value={AmountDonate} onChange={e=>setAmountDonate(e.target.value)} type="number" placeholder= {"Minimum "+ Price} />
                            </Form.Group>
                            <Button onClick={donate}>Donate</Button>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Group className="apply mb-3" controlId="formBasicEmail">
                                    <Form.Label>Link your scripts</Form.Label>
                                    <Form.Control type="linkscript" placeholder="Link to scripts" />
                                    <Form.Label>Short description</Form.Label>
                                    <Form.Control type="description" placeholder= "Description" />
                            </Form.Group>
                            <Button onClick={apply}>Apply</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            
            <hr/>
            

        </div>
        
    }
    return (
        <div className='Project'>
            <Container>
     
                 
                <div className="description" style={{marginTop: 20}}>
                    <hr/>
                    <p>We were moved by the number of children, women suffering from complications of
pregnancy, accident victims, who mostly require blood transfusions as well as ordinary
citizens who were impacted in our hospitals by the lack of adequate blood supply for
the most basic operations and medical procedures. We knew we had to take action so
that no We were moved by the number of children, women suffering from
complications of pregnancy, accident victims, who mostly require blood transfusions
as well as ordinary citizens who were impacted in our hospitals by the lack of
8adequate blood supply for the most basic operations and medical procedures. We
knew we had to take action so that no more lives could be unnecessary lost.</p>
                    
                </div>

                <Row style={{marginTop: 30}}>
                    <hr/>
                    <Col>
                        <h3>Project: {id}</h3>
                        <p>Name: {Name}</p>
                        <p>Creator: {Creator}</p>
                        <p>Wallet: {Wallet}</p>
                    </Col>
                    <Col>
                        <h3>Information</h3>
                        <p>Total received: {Current} ETH</p>
                        <p>Remain NFT Slot: {Slot}</p>
                        <p>Min Price: {Price} ETH</p>
                    </Col>
                </Row>
                
                <div className='decided' style={{marginTop:20, padding: 50}}>
                    {decided}
                </div>
                <Row style={{marginTop: 30, paddingBottom: 40}}>
                    <hr/>
                    <h3>Donors and Donees</h3>
                    <Col>
                        <h4>Donors</h4>
                        <table className="donorTable">
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Address</th>
                                <th>Amount(ETH)</th>
                            </tr>
                            {Donors.map(
                                (donor)=>{
                                    return (
                                        <tr key={donor.id}>
                                            <td>{donor.id}</td>
                                            <td>{donor.value.wallet}</td>
                                            <td>{donor.value.amount}</td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                        </table>
                    </Col>
                    <Col>
                        <h4>Donees</h4>
                        <table className="donorTable">
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Address</th>
                                    <th>Amount(ETH)</th>
                                </tr>
                                {Donees.map(
                                    (donee)=>{
                                        return (
                                            <tr key={donee.id}>
                                                <td>{donee.id}</td>
                                                <td>{donee.value.wallet}</td>
                                                <td>{donee.value.amount}</td>
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>
                       
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
    
}

export default Project;