import React from 'react';
// import { filter, get, map, reduce, sortBy } from 'lodash';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

export default function Income() {
  const theme = useTheme();
  // const dispatch = useDispatch();
  // const allIncomes = useSelector((state) => state.incomes.data);

  // const [incomes, setIncomes] = useState({});

  // useEffect(() => {
  // setIncomes(allIncomes);
  // }, [allIncomes]);

  // console.log('incomes: ', incomes);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid item xs={12} md={6}>
          <Card
            raised
            sx={{
              width: '100%',
            }}
          >
            <CardHeader
              title='paycheck details'
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
                <p>info about paycheck</p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            raised
            sx={{
              width: '100%',
            }}
          >
            <CardHeader
              title='recent incomes'
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
                <p>table of incomes</p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
