import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NavBar from '../Utility/Navbar'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: '#1976d2',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  fab: {
	margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  }
}));

export default function DashBoard(){
	const classes = useStyles();
	return (
		<NavBar classes={classes}/>
	)
}
