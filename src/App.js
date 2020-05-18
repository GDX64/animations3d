import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Lights from "./three/lights/Lights"
import Gravity from './three/gravity/Gravity';
import BlenderLoad from './three/blenderLoad/BlenderLoad';
import Planets from './three/planets/planets';
import Spin from './three/spin/Spin';
import Loading from './utilities/loading/Loading';
import Nav from './utilities/nav/Nav'
import Cubes from './three/cubes/Cubes'

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Nav} />
      <Route path='/lights' component={Lights} />
      <Route path='/cubes' component={Cubes} />
      <Route path='/spin' component={Spin} />
      <Route path='/gravity' component={Gravity} />
      <Route path='/blender-load' component={BlenderLoad} />
      <Route path='/planets' component={Planets} />
      <Route exact path="/loading" component={() =>
        <Loading data="scene" />} />
    </div>
  );
}

export default App;
