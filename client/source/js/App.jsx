'use strict';

import React, {Component} from 'React';
import Map from './Components/Map.jsx';
import Info from './Components/Info.jsx';

export default class App extends Component{
  render(){
    return (
      <div className="wrapper">
        <Info/>
        <Map/>
      </div>
    );
  }
}