import React, { Suspense } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Lights from "./three/lights/Lights"
import Gravity from './three/gravity/Gravity';
import BlenderLoad from './three/blenderLoad/BlenderLoad';
import Spin from './three/spin/Spin';
import Loading from './utilities/loading/Loading';
import Nav from './utilities/nav/Nav'
import Ring from './three/rings/Rings'
import SimpleCubes from './three/simpleCubes/SimpleCubes'

//Lazy
const Cubes = React.lazy(() => import('./three/cubes/Cubes'));
const Planets = React.lazy(() => import('./three/planets/planets'));

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Nav} />
      <Route path='/lights' component={Lights} />

      <Suspense fallback={<div>Loading...</div>}>
        <Route path='/cubes' component={Cubes} />
      </Suspense>

      <Suspense fallback={<Loading data="files" />}>
        <Route path='/planets' component={Planets} />
      </Suspense>

      <Route path="/simple-cubes" component={SimpleCubes} />
      <Route path='/spin' component={Spin} />
      <Route path='/gravity' component={Gravity} />
      <Route path='/blender-load' component={BlenderLoad} />
      <Route path='/ring' component={Ring} />
      <Route exact path="/loading" component={() =>
        <Loading data="scene" />} />
    </div>
  );
}

export default App;
