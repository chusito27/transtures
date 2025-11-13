import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const FinancesAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const transactionsCollectionRef = collection(db, 'finances');

  const getTransactions = useCallback(async () => {
    const data = await getDocs(transactionsCollectionRef);
    setTransactions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [transactionsCollectionRef]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const handleShowModal = (transaction = null) => {
    setCurrentTransaction(transaction);
    setType(transaction ? transaction.type : 'expense');
    setDescription(transaction ? transaction.description : '');
    setAmount(transaction ? transaction.amount : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTransaction(null);
    setType('expense');
    setDescription('');
    setAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentTransaction) {
      const transactionDoc = doc(db, 'finances', currentTransaction.id);
      await updateDoc(transactionDoc, { type, description, amount: parseFloat(amount) });
    } else {
      await addDoc(transactionsCollectionRef, { type, description, amount: parseFloat(amount), date: new Date() });
    }
    getTransactions();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const transactionDoc = doc(db, 'finances', id);
    await deleteDoc(transactionDoc);
    getTransactions();
  };

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomes = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncomes - totalExpenses;

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Finances Admin</h1>

      <div className="mb-4 d-flex justify-content-around">
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Total Expenses</Card.Title>
            <Card.Text className="fs-3 text-danger">${totalExpenses.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Total Incomes</Card.Title>
            <Card.Text className="fs-3 text-success">${totalIncomes.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Balance</Card.Title>
            <Card.Text className={`fs-3 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>${balance.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        Add Transaction
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.date.toDate().toLocaleString()}</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowModal(transaction)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(transaction.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{currentTransaction ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {currentTransaction ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinancesAdmin;
