import { Table } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  cell: {
    borderBottom: `1px solid ${theme.palette.grey[900]}`,
    color: 'grey',
  },
});

export const CellComponent = withStyles(styles, { name: 'CellComponent' })(
  ({ classes, row, ...restProps }) => {
    return (
      <Table.Cell
        row={row}
        {...restProps}
        className={classes.cell}
        onClick={() => null}
      />
    );
  }
);
