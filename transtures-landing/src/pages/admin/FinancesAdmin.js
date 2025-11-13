import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const FinancesAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const { t } = useTranslation();

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
      <h1 className="mb-4">{t('finances_admin')}</h1>

      <div className="mb-4 d-flex justify-content-around">
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{t('total_expenses')}</Card.Title>
            <Card.Text className="fs-3 text-danger">${totalExpenses.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{t('total_incomes')}</Card.Title>
            <Card.Text className="fs-3 text-success">${totalIncomes.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="text-center shadow-sm" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{t('balance')}</Card.Title>
            <Card.Text className={`fs-3 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>${balance.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        {t('add_transaction')}
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>{t('type')}</th>
            <th>{t('description')}</th>
            <th>{t('amount')}</th>
            <th>{t('date')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{t(transaction.type)}</td>
              <td>{transaction.description}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{transaction.date.toDate().toLocaleString()}</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowModal(transaction)}>
                  {t('edit')}
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(transaction.id)}>
                  {t('delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{currentTransaction ? t('edit_transaction') : t('add_transaction')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('type')}</Form.Label>
              <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">{t('expense')}</option>
                <option value="income">{t('income')}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('description')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enter_description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('amount')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('enter_amount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {currentTransaction ? t('update') : t('add')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FinancesAdmin;
