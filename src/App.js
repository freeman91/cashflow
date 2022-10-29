import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes, Navigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';
import ReduxToastr from 'react-redux-toastr';
import LoadingBar from 'react-redux-loading-bar';

import { styled } from '@mui/styles';

import './styles/App.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import Layout from './routes/Layout';

const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[500],
  height: '3px',
  position: 'absolute',
  zIndex: 99999,
  top: 0,
}));

function App() {
  const renderRoutes = () => {
    return (
      <Routes>
        <Route path='/app' element={<Layout />}>
          <Route exact path='*'>
            <Route element={<Layout />} />
          </Route>
        </Route>
        <Route exact path='*'>
          <Route index element={<Navigate to={'/app'} />} />
        </Route>
      </Routes>
    );
  };

  return (
    <>
      <ReduxLoader />
      <Helmet key={uuidv4()}>
        <title>cashflow</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position='bottom-right'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
        progressBar
        closeOnToastrClick
      />
      <div className='App'>{renderRoutes()}</div>
    </>
  );
}

export default App;
