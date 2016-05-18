'use strict'

import React, {Component} from 'React';

export default class Info extends Component{
  render(){
    return(
      <div className="info-div">
        <div className="header-div">
          <div>
            <img src="./img/logo_short.png"></img>
            <span>I'm here</span>
          </div>
        </div>
      </div>
    );
  }
}