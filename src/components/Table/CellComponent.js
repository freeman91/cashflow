import { useDispatch } from 'react-redux';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { setDialog } from '../../store/settings';
import { get } from 'lodash';

const styles = (theme) => ({
  cell: {
    borderBottom: `1px solid ${theme.palette.grey[900]}`,
    color: 'grey',
  },
});

export const CellComponent = withStyles(styles, { name: 'CellComponent' })(
  ({ classes, row, ...restProps }) => {
    const dispatch = useDispatch();
    const handleClick = (e) => {
      e.preventDefault();
      if (get(row, 'category')) {
        dispatch(setDialog({ open: true, record: row }));
      }
    };
    return (
      <Table.Cell
        row={row}
        {...restProps}
        className={classes.cell}
        onClick={handleClick}
      />
    );
  }
);
