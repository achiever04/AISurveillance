import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CamerasPage from './pages/CamerasPage';
import WatchlistPage from './pages/WatchlistPage';
import EvidencePage from './pages/EvidencePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditPage from './pages/AuditPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    
      
        {!isAuthenticated ? (
          
            <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
            } />
          
        ) : (
          
            
            
              
              
                
                  } />
                  } />
                  } />
                  } />
                  } />
                  } />
                  } />
                
              
            
          
        )}
      
    
  );
}

export default App;