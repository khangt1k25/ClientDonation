import React from "react";
import {Card, Button} from "react-bootstrap";
import {useNavigate} from 'react-router-dom'

const CampaignCard = ({camp}) => {
    let navigate = useNavigate();
    const direct = () => {
        const id = camp.id
        console.log(id)
        navigate(`/project/${id}`)
    }
    return (
        <div style={{alignContent: "center"}}>
            <Card border="secondary" >
                <Card.Header>{camp.name}</Card.Header>
                <Card.Body>
                    <Card.Text>
                    <p>Creator: {camp.creator}</p>
                    <p>Wallet: {camp.wallet}</p>
                    </Card.Text>
                    <Button onClick={direct}>View</Button>
                </Card.Body>
            </Card>
        </div>
    )

}
export default CampaignCard;