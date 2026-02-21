import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { WheelPicker, WheelPickerWrapper } from '@ncdai/react-wheel-picker';

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
  zIndex: 1,
}));

const WheelPickerDrawer = ({
  open,
  onClose,
  options = [],
  selectedValue,
  onSelect,
  height = '50%',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showButtons = true,
}) => {
  const [tempValue, setTempValue] = useState(selectedValue);

  // Update tempValue when selectedValue changes
  useEffect(() => {
    setTempValue(selectedValue);
  }, [selectedValue]);

  const handleConfirm = () => {
    onSelect(tempValue);
    onClose();
  };

  const handleCancel = () => {
    setTempValue(selectedValue); // Reset to original value
    onClose();
  };

  const handleValueChange = (value) => {
    setTempValue(value);
  };

  // Convert options to the format expected by the wheel picker
  const wheelPickerOptions = options.map((option) => ({
    label: option.value,
    value: option.value,
  }));

  // Don't render if no options
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onOpen={() => {}} // Prevent opening on swipe up
      onClose={handleCancel}
      sx={{
        zIndex: 1400,
        '& .MuiDrawer-paper': {
          height,
          overflow: 'visible',
          backgroundColor: (theme) => theme.palette.surface[200],
          backgroundImage: 'unset',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Puller />

      {/* Wheel Picker Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: '200px',
          }}
        >
          <WheelPickerWrapper>
            <WheelPicker
              options={wheelPickerOptions}
              value={tempValue}
              onValueChange={handleValueChange}
              optionItemHeight={35}
            />
          </WheelPickerWrapper>
        </Box>
      </Box>

      {/* Action Buttons */}
      {showButtons && (
        <Box
          sx={{
            px: 2,
            pb: 2,
            display: 'flex',
            gap: 2,
            backgroundColor: (theme) => theme.palette.surface[200],
          }}
        >
          <Button variant='outlined' onClick={handleCancel} sx={{ flex: 1 }}>
            {cancelText}
          </Button>
          <Button variant='contained' onClick={handleConfirm} sx={{ flex: 1 }}>
            {confirmText}
          </Button>
        </Box>
      )}
    </SwipeableDrawer>
  );
};

WheelPickerDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  height: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  showButtons: PropTypes.bool,
};

export default WheelPickerDrawer;
