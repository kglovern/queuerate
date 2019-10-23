import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Route, Switch, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { connect }from 'react-redux'
import { fetchCategories } from '../APIs/Category'
import AddCategory from '../Components/AddCategory'
import CategoryView from "../Components/CategoryView/CategoryView";

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchCategories } = this.props
    fetchCategories()
  }

  render() {
    const { history, classes, categories } = this.props
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {/* <Typography variant="h6" noWrap>
            Clipped drawer
          </Typography> */}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button
                // key={index}
                onClick={() => history.push('/')}>
                <ListItemText primary={'All'} />
              </ListItem>
            {categories.map((obj, index) => (
              <ListItem button
                key={index}
                onClick={() => history.push('/category/' + obj.id)}>
                <ListItemText primary={obj.category_name} />
              </ListItem>
            ))}
          </List>
          <ListItem>
            <Fab
              size="small"
              color="secondary"
              aria-label="add"
              className={classes.margin}
              onClick={() => history.push('/addCategory')}
            >
              <AddIcon />
            </Fab>
          </ListItem>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route
                exact
                path="/category/:categoryID"
                component={CategoryView}
            />
            <Route path="/addCategory" component={AddCategory}/>
          </Switch>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  categories: state.category ? state.category.categories : []
})

const mapDispatchToProps = (dispatch) => ({
  fetchCategories: () => dispatch(fetchCategories())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
