import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { BarChart3, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AnalyticsPage = () => {
  const [trends, setTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadTrends();
  }, [days]);

  const loadTrends = async () => {
    try {
      const response = await analyticsAPI.getDetectionTrends({ days });
      setTrends(response.data);
    } catch (error) {
      console.error('Failed to load trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return ;
  }

  return (
    
      
        Analytics
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          Last 7 days
          Last 30 days
          Last 90 days
        
      

      
        
          
            Detection Trends
            
          
          
            Chart visualization would go here
          
        

        
          
            Detection by Type
            
          
          
            {trends?.by_type && Object.entries(trends.by_type).map(([type, count]) => (
              
                {type.replace('_', ' ')}
                {count}
              
            ))}
          
        
      
    
  );
};

export default AnalyticsPage;