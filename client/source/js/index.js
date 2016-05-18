'use strict';

import React from 'React';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer'

function initImHereWeb(){
  ReactDOM.render(<AppContainer />, document.getElementById('container'));
}

document.addEventListener( 'DOMContentLoaded', function () {
  initImHereWeb();
}, false);