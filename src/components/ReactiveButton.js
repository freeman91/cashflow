import React, { forwardRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

const ReactiveButton = forwardRef((props, ref) => {
  const { label, handleClick, Icon, ...restProps } = props;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <IconButton
        ref={ref}
        onClick={handleClick}
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          ...restProps.sx,
        }}
        {...restProps}
      >
        <Icon sx={{ color: 'background.paper' }} />
      </IconButton>
    );
  } else {
    return (
      <Button
        ref={ref}
        variant='contained'
        startIcon={<Icon />}
        onClick={handleClick}
        {...restProps}
      >
        {label}
      </Button>
    );
  }
});

export default ReactiveButton;
