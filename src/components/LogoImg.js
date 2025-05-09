import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

const LogoImg = () => {
  const dispatch = useDispatch();

  return (
    <img
      src='/apple-touch-icon.png'
      alt='logo'
      width={30}
      height={30}
      onClick={() => dispatch(push('/dashboard'))}
    />
  );
};

export default LogoImg;
