import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Video, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await analyticsAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return ;
  }

  const statCards = [
    {
      title: 'Active Cameras',
      value: `${stats?.active_cameras || 0} / ${stats?.total_cameras || 0}`,
      icon: Video,
      color: 'blue'
    },
    {
      title: 'Detections (24h)',
      value: stats?.detections_24h || 0,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Watchlist Persons',
      value: stats?.watchlist_persons || 0,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Verified Detections',
      value: stats?.total_detections - stats?.unverified_detections || 0,
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    
      Dashboard

      
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
            green: 'bg-green-100 text-green-600'
          };

          return (
            
              
                {card.title}
                
                  
                
              
              {card.value}
            
          );
        })}
      

      
        
          Recent Detections
          No recent detections
        

        
          System Health
          
            
              Database
              Healthy
            
            
              Blockchain
              Connected
            
            
              IPFS
              Online
            
          
        
      
    
  );
};

export default DashboardPage;