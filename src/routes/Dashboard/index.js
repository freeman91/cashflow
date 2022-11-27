import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Toolbar from './Toolbar';
import Month from '../../components/Calendar/Month';
import Year from '../../components/Calendar/Year';
import dayjs from 'dayjs';
import Ledger from './Ledger';

export default function Dashboard() {
  const user = useSelector((state) => state.user);

  const [view, setView] = useState('Calendar');
  const [day, setDay] = useState(dayjs());
  const [showExpenses, setShowExpenses] = useState(true);
  const [showIncomes, setShowIncomes] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    if (user.expense_types) {
      setSelectedTypes(user.expense_types);
    }
  }, [user]);

  useEffect(() => {
    if (view === 'Year') {
      setDay(dayjs());
    }
  }, [view]);

  const renderView = () => {
    switch (view) {
      case 'Calendar':
        return (
          <Month
            day={day}
            showExpenses={showExpenses}
            showIncomes={showIncomes}
            selectedTypes={selectedTypes}
          />
        );

      case 'Ledger':
        return (
          <Ledger
            day={day}
            showExpenses={showExpenses}
            showIncomes={showIncomes}
            selectedTypes={selectedTypes}
          />
        );

      case 'Year':
        return (
          <Year
            day={day}
            showExpenses={showExpenses}
            showIncomes={showIncomes}
            selectedTypes={selectedTypes}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toolbar
        view={view}
        setView={setView}
        day={day}
        setDay={setDay}
        showExpenses={showExpenses}
        setShowExpenses={setShowExpenses}
        showIncomes={showIncomes}
        setShowIncomes={setShowIncomes}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
      {renderView()}
    </>
  );
}
