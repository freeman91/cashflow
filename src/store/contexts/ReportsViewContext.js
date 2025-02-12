import { createContext, useState } from 'react';

const ReportsViewContext = createContext();

function ReportsViewProvider({ children }) {
  const [view, setView] = useState('month');
  const selectView = (view) => setView(view);

  return (
    <ReportsViewContext.Provider value={{ view, selectView }}>
      {children}
    </ReportsViewContext.Provider>
  );
}

export { ReportsViewContext };
export default ReportsViewProvider;
