import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMeasure } from 'react-use';
import { Card, CardContent, Toolbar, Typography } from '@material-ui/core';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableColumnResizing,
  TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';

import Menu from '../Menu';
import { Header, EditCell, HeaderEditCell, PAGE_SIZES } from './Table';
import { indexOf, map } from 'lodash';

function BaseTable(props) {
  const {
    title,
    data,
    dataType,
    actions,
    filtering,
    integratedFilteringColumnExtensions,
    paging,
    columns,
    defaultSorting,
    Dialog,
    toolbarOptions,
    menuOptions,
    providers,
  } = props;
  const [selectedRow, setSelectedRow] = useState({});
  const [columnWidths, setColumnWidths] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [filters, setFilters] = useState([]);
  const [tableRef, { width }] = useMeasure();

  useEffect(() => {
    if (Object.keys(selectedRow) > 0) {
      setOpenDialog(true);
    }
  }, [selectedRow, setOpenDialog]);

  useEffect(() => {
    if (dialogMode !== '') {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, [dialogMode]);

  useEffect(() => {
    if (width) {
      const availableWidth = actions.length > 0 ? width - 100 : width;
      setColumnWidths(
        map(columns, (column) => {
          return {
            columnName: column.name,
            width: availableWidth * column.width,
          };
        })
      );
    }
  }, [width, columns, actions]);

  const handleClose = () => {
    setSelectedRow({});
    setDialogMode('');
    setOpenDialog(false);
  };

  const editCellActions = (() => {
    let _actions = [];
    if (indexOf(actions, 'edit') >= 0) {
      _actions.push({
        icon: ['fal', 'edit'],
        dialogMode: 'edit',
        tooltip: `Edit ${dataType}`,
        setDialogMode: setDialogMode,
      });
    }
    if (indexOf(actions, 'delete') >= 0) {
      _actions.push({
        icon: ['fal', 'trash-alt'],
        dialogMode: 'delete',
        tooltip: `Delete ${dataType}`,
        setDialogMode: setDialogMode,
      });
    }
    return _actions;
  })();

  return (
    <Card>
      {title || menuOptions ? (
        <Toolbar
          sx={{
            backgroundColor: '#e2dede',
            minHeight: `34px`,
            textAlign: 'left',
          }}
        >
          {title ? (
            <Typography variant='h6' color='inherit' sx={{ flex: 1 }}>
              {title}
            </Typography>
          ) : null}
          {toolbarOptions ? map(toolbarOptions, (option) => option) : null}
          {menuOptions ? (
            <Menu>{map(menuOptions, (option) => option)}</Menu>
          ) : null}
        </Toolbar>
      ) : null}
      <CardContent>
        <div ref={tableRef}>
          <Grid rows={data} columns={columns}>
            {providers}
            {TableEditColumn ? <EditingState /> : null}
            {paging ? (
              <PagingState
                defaultCurrentPage={0}
                defaultPageSize={PAGE_SIZES[0]}
              />
            ) : null}

            {filtering ? (
              <FilteringState filters={filters} onFiltersChange={setFilters} />
            ) : null}

            {defaultSorting ? (
              <SortingState defaultSorting={defaultSorting} />
            ) : null}

            {filtering ? (
              <IntegratedFiltering
                columnExtensions={
                  integratedFilteringColumnExtensions
                    ? integratedFilteringColumnExtensions
                    : []
                }
              />
            ) : null}

            {defaultSorting ? <IntegratedSorting /> : null}

            {paging ? <IntegratedPaging /> : null}

            <Table />
            <TableColumnResizing
              columnWidths={columnWidths}
              onColumnWidthsChange={setColumnWidths}
              resizingMode='nextColumn'
            />

            {paging && data.length >= PAGE_SIZES[0] ? (
              <PagingPanel pageSizes={PAGE_SIZES} />
            ) : null}

            {filtering ? <TableFilterRow /> : null}
            {defaultSorting ? (
              <TableHeaderRow contentComponent={Header} showSortingControls />
            ) : null}
            {actions.length > 0 ? (
              <TableEditColumn
                width={80}
                showEditCommand={indexOf(actions, 'edit') >= 0}
                showDeleteCommand={indexOf(actions, 'delete') >= 0}
                cellComponent={(props) => (
                  <EditCell
                    {...props}
                    style={{ padding: 0 }}
                    actions={editCellActions}
                    setSelectedRow={setSelectedRow}
                  />
                )}
                headerCellComponent={(props) => {
                  if (indexOf(actions, 'add') >= 0) {
                    return (
                      <HeaderEditCell
                        {...props}
                        setDialogMode={setDialogMode}
                        setSelectedRow={setSelectedRow}
                        setOpenDialog={setOpenDialog}
                        tooltipText={`Add ${dataType}`}
                      />
                    );
                  } else return <TableEditColumn.HeaderCell {...props} />;
                }}
              />
            ) : null}
            {editCellActions.length > 0 ? <TableEditRow /> : null}
          </Grid>
          {Dialog ? (
            <Dialog
              open={openDialog}
              dialogMode={dialogMode}
              handleClose={handleClose}
              rowData={selectedRow}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

BaseTable.propTypes = {
  title: PropTypes.string, // show Toolbar if title is passed
  data: PropTypes.array.isRequired, // the data shown in the table
  dataType: PropTypes.string,
  actions: PropTypes.array.isRequired, // options: ['add', 'edit', 'delete']
  filtering: PropTypes.bool, // enable table filtering
  integratedFilteringColumnExtensions: PropTypes.array,
  paging: PropTypes.bool, // enable table paging
  columns: PropTypes.PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired, // attribute key in the data
      title: PropTypes.string.isRequired, // name in table column
      width: PropTypes.number.isRequired, // ratio out of 1
    })
  ).isRequired,
  defaultSorting: PropTypes.array, // defaultSorting settings
  Dialog: PropTypes.func, // Dilaog for an item in the table
  toolbarOptions: PropTypes.array,
  menuOptions: PropTypes.array,
  providers: PropTypes.array, // TypeProviders
};

export default BaseTable;
