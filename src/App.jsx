import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Routes from './Routes';

function App() {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}

export default App;