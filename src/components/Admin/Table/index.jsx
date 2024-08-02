import { Card } from "react-bootstrap";

const Table = (prods) => {
    return (
        <Card
            style={{
                backgroundColor: prods.isOccupied ? 'lightcoral' : 'lightgreen',
                padding: '10px',
                margin: '5px',
                border: '1px solid black',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
            onClick={() => prods.onClick(prods.id)}
        >
            <Card.Body>
                {`Bàn ${prods.number} (${prods.seats} ghế)`}
            </Card.Body>
        </Card>
    );
}

export default Table;