import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import Store from '../contracts/Store.json';
import { STORE_ADDRESS } from '../config';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const Admin = () => {
    const [account, setaccount] = useState('0x0000000000000000000000000000000000000000')
    const [address, setaddress] = useState('0x0000000000000000000000000000000000000000')
    const [isAdmin, setisAdmin] = useState(false)
    
    async function loadBlockchainData(){
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        setaccount(accounts[0])
        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)
        const owner = await store.methods.owner().call();
        if(owner==account){
            setisAdmin(true)
        }
    }
    async function add () {
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)
        const e = await store.methods.addWhitelister(address).send({"from": account})
        console.log(e)
    }
    async function remove () {
        const web3 = new Web3(Web3.givenProvider||"http://127.0.0.1:7545")
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const store = new web3.eth.Contract(Store.abi, STORE_ADDRESS)
        const e = await store.methods.removeWhitelister(address).send({"from": account})
        console.log(e)
    }
    useEffect(() => {
        loadBlockchainData()
    }, [account, isAdmin])

    if(isAdmin){
        return (
            <div className='admin'>
                <Container>
                    <Row className='adminRow' style={{marginTop:100, marginLeft:300, marginRight:300}}>
                            <h3>Whitelist manage</h3>
                            <Form style={{paddingTop: 50}}>
                                <Form.Group className="mb-3" controlId="adminAdd">
                                    <Form.Label>Enter address</Form.Label>
                                    <Form.Control value={address} onChange={e=>setaddress(e.target.value)} type="text" placeholder="0x0" />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Button onClick={add}>Add</Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={remove}>Remove</Button>
                                    </Col>
                                </Row>
                            </Form>               
                    </Row>
                </Container>
            </div>
        )
    } else{
        return (
            <div style={{marginTop:100}}>
                You are not the admin
            </div>
        )
    }
    
}
export default Admin;