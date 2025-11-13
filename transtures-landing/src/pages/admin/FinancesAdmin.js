import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
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

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    const data = await getDocs(transactionsCollectionRef);
    setTransactions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

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
    <Container>
      <h1>Finances Admin</h1>
      <div className="mb-3">
        <h4>Total Expenses: ${totalExpenses.toFixed(2)}</h4>
        <h4>Total Incomes: ${totalIncomes.toFixed(2)}</h4>
        <h4>Balance: ${balance.toFixed(2)}</h4>
      </div>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Transaction
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
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
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(transaction)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(transaction.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
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
            <Button variant="primary" type="submit">
              {currentTransaction ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinancesAdmin;
