import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Notes from './pages/Notes';           // ← sin subcarpeta
import CreateNote from './pages/CreateNote'; // ← sin subcarpeta

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/notes" component={Notes} exact />
        <Route path="/create" component={CreateNote} exact />
        <Redirect exact from="/" to="/notes" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;