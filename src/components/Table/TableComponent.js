import { Table } from '@devexpress/dx-react-grid-material-ui';
import { alpha } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  table: {
    backgroundColor: alpha(theme.palette.background.paper, 0.05),
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: alpha(theme.palette.background.paper, 0.05),
    },
  },
});

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  ({ classes, ...restProps }) => {
    return <Table.Table {...restProps} className={classes.table} />;
  }
);
