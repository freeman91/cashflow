import { Route, Routes, Navigate } from 'react-router-dom';

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
        <Route path='*'>
          <Route index element={<Navigate to={'/app'} />} />
        </Route>
      </Routes>
    );
  };

  return (
    <>
      <ReduxLoader />
      <ReduxToastr
        timeOut={10000}
        position='bottom-right'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
        closeOnToastrClick
      />
      <div className='App'>{renderRoutes()}</div>
    </>
  );
}

export default App;
