import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
// import {
//   BoxSeam, // Icon for 'Commandes Totales'
//   ClockHistory, // Icon for 'En cours'
//   CheckCircle, // Icon for 'Terminées'
//   ExclamationCircle // Icon for 'Échecs'
// } from 'react-bootstrap-icons';

// Define a type for the card data for better structure
type StatusCardProps = {
  title: string;
  value: number;
  change: string;
  changeColor: string; // e.g., 'text-success' or 'text-danger'
  icon: string;
};

// Placeholder data - replace with actual data fetching and calculation logic
const cardData: StatusCardProps[] = [
  {
    title: 'Commandes Totales',
    value: 6,
    change: '', // No change shown for total
    changeColor: '',
    icon: 'box-3'
  },
  {
    title: 'En cours',
    value: 2,
    change: '+12% since yesterday',
    changeColor: 'text-success',
    icon: 'loader-4',
  },
  {
    title: 'Terminées',
    value: 2,
    change: '+8% since yesterday',
    changeColor: 'text-success',
    icon: 'checkbox-circle',
  },
  {
    title: 'Échecs',
    value: 1,
    change: '-3% since yesterday',
    changeColor: 'text-danger',
    icon: 'error-warning',
  },
];

const StatusCard: React.FC<StatusCardProps> = ({ title, value, change, changeColor, icon }) => (
  <Card className="h-100 shadow-sm">
    <Card.Body className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <Card.Title as="h6" className="text-muted mb-0">{title}</Card.Title>
        {/* <Icon size={20} className="text-muted" /> */}
        <i className={`ri-${icon}-line fs-5 text-muted`}></i>
      </div>
      <div className="mt-auto">
        <h3 className="fw-bold mb-1">{value}</h3>
        {change && <small className={changeColor}>{change}</small>}
      </div>
    </Card.Body>
  </Card>
);

export default function Dashboard() {
  return (
    <Container fluid className="p-3 p-lg-4">
      {/* <h3 className="text-secondary mb-4">Tableau de Bord</h3> Removed generic title for now */}
      <Row xs={1} sm={2} lg={4} className="g-3">
        {cardData.map((data, index) => (
          <Col key={index}>
            <StatusCard {...data} />
          </Col>
        ))}
      </Row>

      {/* Placeholder for future charts or tables */}
      {/* <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">Statuts des Factures (Détail)</Card.Header>
            <Card.Body>
              {/* Detailed status breakdown or chart */}
            {/* </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header as="h5">Statuts des Connaissements (Détail)</Card.Header>
            <Card.Body>
              {/* Detailed status breakdown or chart */}
            {/* </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </Container>
  );
} 