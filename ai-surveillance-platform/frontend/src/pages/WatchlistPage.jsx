import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';
import { UserPlus, Search, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

const WatchlistPage = () => {
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistAPI.getAll();
      setPersons(response.data);
    } catch (error) {
      setError('Failed to load watchlist');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPersons = persons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.person_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || person.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getRiskBadgeColor = (level) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[level] || colors.low;
  };

  if (isLoading) {
    return ;
  }

  return (
    
      
        Watchlist
        
          
          Add Person
        
      

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      
        
          
            
              
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              All Categories
              Missing
              Criminal
              VIP
              Person of Interest
            
          
        

        
          
            
              
                
                  Person
                
                
                  Category
                
                
                  Risk Level
                
                
                  Last Seen
                
                
                  Detections
                
                
                  Actions
                
              
            
            
              {filteredPersons.map((person) => (
                
                  
                    
                      
                        
                          {person.name.charAt(0)}
                        
                      
                      
                        {person.name}
                        {person.person_id}
                      
                    
                  
                  
                    
                      {person.category.replace('_', ' ')}
                    
                  
                  
                    
                      {person.risk_level.toUpperCase()}
                    
                  
                  
                    {person.last_seen_at ? new Date(person.last_seen_at).toLocaleDateString() : 'Never'}
                  
                  
                    {person.total_detections}
                  
                  
                    
                      
                        
                      
                      
                        
                      
                      
                        
                      
                    
                  
                
              ))}
            
          
        
      

      {filteredPersons.length === 0 && (
        
          
          No persons found
          Add persons to your watchlist to start monitoring
        
      )}
    
  );
};

export default WatchlistPage;