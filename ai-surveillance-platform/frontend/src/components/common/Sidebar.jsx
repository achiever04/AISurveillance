import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Users,
  FileText,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/cameras', icon: Video, label: 'Cameras' },
    { path: '/watchlist', icon: Users, label: 'Watchlist' },
    { path: '/evidence', icon: FileText, label: 'Evidence' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/audit', icon: Shield, label: 'Audit Trail' }
  ];

  return (
         Surveillance
        

        
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              
                
                {item.label}
              
            );
          })}
        
      
    
  );
};

export default Sidebar;