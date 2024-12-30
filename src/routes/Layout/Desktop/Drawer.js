import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';

import styled from '@mui/material/styles/styled';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceTwoTone';
import AssessmentIcon from '@mui/icons-material/AssessmentTwoTone';
import AssignmentIcon from '@mui/icons-material/AssignmentTwoTone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoneyTwoTone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthTwoTone';
import CollapseIcon from '@mui/icons-material/KeyboardArrowDown';
import CreditCardIcon from '@mui/icons-material/CreditCardTwoTone';
import ExpandIcon from '@mui/icons-material/KeyboardArrowUp';
import HomeIcon from '@mui/icons-material/HomeTwoTone';
import LocalAtmIcon from '@mui/icons-material/LocalAtmTwoTone';
import SearchIcon from '@mui/icons-material/SearchTwoTone';
import SettingsIcon from '@mui/icons-material/SettingsTwoTone';
import TrendingUpIcon from '@mui/icons-material/TrendingUpTwoTone';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view';

import { openDialog } from '../../../store/dialogs';

const Label = styled('div')({ display: 'flex', alignItems: 'center' });
const StyledTreeItem = styled(TreeItem)(({ theme }) => {
  return {
    maxWidth: 300,
    [`& .${treeItemClasses.root}`]: {},
    [`& .${treeItemClasses.groupTransition}`]: {},
    [`& .${treeItemClasses.content}`]: {
      paddingBottom: 0,
      paddingTop: 0,
      paddingLeft: theme.spacing(1),
    },
    [`& .${treeItemClasses.expanded}`]: {},
  };
});

const PageButton = (props) => {
  const { pageName, currentPage, icon } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push(`/${pageName}`));
  };

  return (
    <ListItemButton
      sx={{ m: 0.5, borderRadius: 1 }}
      selected={currentPage === pageName}
      onClick={handleClick}
    >
      <ListItemIcon
        sx={{
          minWidth: 'fit-content',
          mr: 2,
          color: currentPage === pageName ? 'primary.main' : 'inherit',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={pageName}
        primaryTypographyProps={{
          color: currentPage === pageName ? 'primary' : 'inherit',
        }}
      />
    </ListItemButton>
  );
};

const CreateButton = (props) => {
  const { type, icon } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openDialog({ type, mode: 'create' }));
  };

  return (
    <ListItemButton
      sx={{
        borderRadius: 1,
        justifyContent: 'center',
      }}
      onClick={handleClick}
    >
      <ListItemIcon
        sx={{
          width: 'fit-content',
          minWidth: 'unset',
        }}
      >
        {icon}
      </ListItemIcon>
    </ListItemButton>
  );
};

export default function DesktopDrawer(props) {
  const { PaperProps } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const [page, setPage] = useState('');
  const [nodes, setNodes] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const _page = location.pathname.split('/')[1];
    setPage(_page);
  }, [location]);

  useEffect(() => {
    const groupedAccounts = groupBy(accounts, 'account_type');
    const _nodes = Object.entries(groupedAccounts).map(
      ([type, groupAccounts]) => {
        return {
          label: type,
          id: type,
          icon: null,
          active: false,
          children: groupAccounts.map((account) => ({
            label: account.name,
            id: account.account_id,
            icon: null,
            active: false,
            children: [],
          })),
        };
      }
    );
    setNodes(_nodes);
  }, [accounts]);

  const handleExpandedItemsChange = (e, ids) => {
    e.preventDefault();
    setExpanded(ids);
  };

  const handleLabelClick = (e, id) => {
    if (includes(expanded, id)) {
      e.stopPropagation();
    }

    setSelected([id]);
    dispatch(push(`/account`, { accountId: id }));
  };

  const mapNodes = (_nodes) => {
    return _nodes.map((node) => {
      const { id, label, icon, children } = node;
      return (
        <StyledTreeItem
          itemId={id}
          key={id}
          label={
            <Label
              sx={{ height: 35 }}
              id={id}
              onClick={(e) => handleLabelClick(e, id)}
            >
              {icon && (
                <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
              )}
              <ListItemText primary={label} />
            </Label>
          }
        >
          {children && mapNodes(children)}
        </StyledTreeItem>
      );
    });
  };

  return (
    <Drawer variant='permanent' PaperProps={PaperProps}>
      <List disablePadding>
        <ListItem sx={{ width: '100%', columnGap: 1, p: 1 }}>
          <CreateButton type='expense' icon={<CreditCardIcon />} />
          <CreateButton type='income' icon={<AttachMoneyIcon />} />
          <CreateButton type='paycheck' icon={<LocalAtmIcon />} />
        </ListItem>
        <Divider sx={{ mx: 1 }} />
        <PageButton pageName='home' currentPage={page} icon={<HomeIcon />} />
        <PageButton
          pageName='calendar'
          currentPage={page}
          icon={<CalendarMonthIcon />}
        />
        <PageButton
          pageName='summary'
          currentPage={page}
          icon={<AssessmentIcon />}
        />
        <PageButton
          pageName='networth'
          currentPage={page}
          icon={<TrendingUpIcon />}
        />
        <PageButton
          pageName='budgets'
          currentPage={page}
          icon={<AssignmentIcon />}
        />
        <PageButton
          pageName='search'
          currentPage={page}
          icon={<SearchIcon />}
        />
        <Divider sx={{ mx: 1 }} />
        <PageButton
          pageName='accounts'
          currentPage={page}
          icon={<AccountBalanceIcon />}
        />
        <SimpleTreeView
          slots={{ collapseIcon: CollapseIcon, expandIcon: ExpandIcon }}
          expandedItems={expanded}
          onExpandedItemsChange={handleExpandedItemsChange}
          selectedItems={selected}
          sx={{ ml: 2 }}
        >
          {mapNodes(nodes)}
        </SimpleTreeView>
        <Divider sx={{ mx: 1 }} />
        <PageButton
          pageName='settings'
          currentPage={page}
          icon={<SettingsIcon />}
        />
      </List>
    </Drawer>
  );
}
