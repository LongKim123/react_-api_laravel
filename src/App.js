
import { Component } from 'react';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import './App.scss';
import routes from './route';

//import IndexLogin from './Component/Login/index';
import IndexLogin from "./Component/Login/main";

// function App() {
//   return (
//     <div className="App">
//      <Login/>
//     </div>
//   );
// }
class App extends Component{
  render(){
    return (
      <Router>
        <div className="App">
        
         
        {/* Noi dung do len day */}
        <Switch>
         
          {this.showContentMenus(routes)}
          
        </Switch>
      </div>
      </Router>
    );
  }
  showContentMenus = (routes)=>{
    var result = null;
    if(routes.length > 0 ){
      result = routes.map((route,index)=>{
        return (
          <Route key={index} path={route.path} exact={route.exact} component={route.main}/>
        );
      });
    }
    return result ;
  }

}

export default App;
