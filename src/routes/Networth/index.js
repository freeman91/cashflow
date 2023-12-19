import React from 'react';
// import { filter, get, map, reduce, sortBy } from 'lodash';

import { useTheme } from '@mui/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

export default function Networth() {
  // const dispatch = useDispatch();
  const theme = useTheme();
  // const allNetworths = useSelector((state) => state.networths.data);

  // const [networths, setNetworths] = useState({});

  // useEffect(() => {
  // setNetworths(allNetworths);
  // }, [allNetworths]);

  // console.log('networths: ', networths);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Card
          raised
          sx={{
            width: '100%',
          }}
        >
          <CardHeader
            title='over time'
            action={
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
                <IconButton onClick={() => {}}>
                  <CalendarMonthIcon />
                </IconButton>
                <IconButton onClick={() => {}}>
                  <FilterListIcon />
                </IconButton>
              </Stack>
            }
            titleTypographyProps={{ align: 'left' }}
          />
          <CardContent>
            <Box
              sx={{
                height: 300,
                border: '1px solid white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p>line/bar graph of networth over time</p>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
