import { useEffect } from 'react';
import { app } from '@microsoft/teams-js'
import './app.css';
import NaaTestControls from './Components/NaaTestControls';

export default function App() {
    console.log("Starting app render");
    useEffect(() => {
      localStorage.debug = "teamsJs.*";
      const initializeTeamsJs = async () => {
        await app.initialize();
        console.log("Teams JS initialized");
      };
      console.log("Initializing Teams JS");
      initializeTeamsJs();
    }, []);
    return (
      <div className="app" role="main">
        <NaaTestControls />
      </div>
    );
}