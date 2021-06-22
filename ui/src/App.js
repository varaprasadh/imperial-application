import React from 'react';
import "./App.css";


import {useState} from "react";
import StartScreen from './components/misc/startscreen/StartScreen';
import EndScreen from "./components/misc/endscreen/EndScreen";
import Form from "./Form";



import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import DashBoard from './pages/DashBoard';

import Axios from "axios";



if (process.env.NODE_ENV === "production"){
  Axios.defaults.baseURL = "https://imperial-capital.herokuapp.com";
}else{
    Axios.defaults.baseURL = "http://localhost:3001";
}

function RenderFormRoot(props){  
  // return (<StartScreen {...props} />)
  // return (<EndScreen {...props} />)
  
  if(props.screen==="start"){
    return (<StartScreen {...props}/>)
  }
  if(props.screen==="form"){
    return (<Form {...props}/>)
  }
  if(props.screen==="thanks"){
    return (<EndScreen {...props}/>)
  }
}


function App(){
      const [screen,setScreen]=useState("start");
      const history=useHistory();
      return (
        <div className="app">
          <Router history={history} basename="/ua/securebanking/MyRegistration/">
           <Switch>
              <Route path="/" exact>
                  <RenderFormRoot 
                      screen={screen} 
                      onStart={()=>setScreen("form")} 
                      onSubmitSuccess={()=>setScreen("thanks")}
                      onProceed={()=>setScreen("start")}
                      />
              </Route>
              <Route path="/dashboard" exact>
                    <DashBoard/>
              </Route>
           </Switch>
         </Router>
         </div>
      );
}


export default App;
