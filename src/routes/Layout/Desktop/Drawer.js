import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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

import LogoImg from '../../../components/CustomAppBar/LogoImg';

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

export default function DesktopDrawer(props) {
  const { PaperProps } = props;

  const accounts = useSelector((state) => state.accounts.data);
  const [nodes, setNodes] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

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
    console.log('TODO: push id: ', id);
    // dispatch(push());
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
        <ListItem>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 1 }}>
            <LogoImg />
          </ListItemIcon>
          <ListItemText
            primary='cashflow'
            primaryTypographyProps={{
              fontWeight: 'bold',
              variant: 'h5',
            }}
          />
        </ListItem>
        <Divider sx={{ mx: 1 }} />
        <ListItem sx={{ width: '100%', columnGap: 1, p: 1 }}>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: 'center',
            }}
          >
            <ListItemIcon
              sx={{
                width: 'fit-content',
                minWidth: 'unset',
              }}
            >
              <CreditCardIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: 'center',
            }}
          >
            <ListItemIcon sx={{ width: 'fit-content', minWidth: 'unset' }}>
              <AttachMoneyIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: 'center',
            }}
          >
            <ListItemIcon sx={{ width: 'fit-content', minWidth: 'unset' }}>
              <LocalAtmIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Divider sx={{ mx: 1 }} />
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>home</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText>calendar</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText>summary</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText>networth</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText>budgets</ListItemText>
        </ListItemButton>
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>search</ListItemText>
        </ListItemButton>
        <Divider sx={{ mx: 1 }} />
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText>accounts</ListItemText>
        </ListItemButton>
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
        <ListItemButton sx={{ m: 0.5, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 'fit-content', mr: 2 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>settings</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
}
