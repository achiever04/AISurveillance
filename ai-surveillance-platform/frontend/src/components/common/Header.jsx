import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Menu } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (     
            AI Surveillance Platform         
              {user?.full_name}
              {user?.role}  
         );
        };

export default Header;