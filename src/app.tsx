import { useEffect } from 'react';
import { app } from '@microsoft/teams-js'
import './app.css';
import NaaTestControls from './Components/NaaTestControls';

export default function App() {
    useEffect(() => {
      const initializeTeamsJs = async () => {
        await app.initialize();
      };
      initializeTeamsJs();
    }, []);
    return (
      <div className="app" role="main">
        <NaaTestControls />
      </div>
    );
}