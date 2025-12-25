import React, { useState } from 'react';
import { Shield, Search, Filter } from 'lucide-react';

const AuditPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    
      Audit Trail

      
        
          
            
              
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            
            
              
              Filter
            
          
        

        
          
          Blockchain Audit Trail
          All system actions are recorded on the blockchain
          Blockchain integration coming soon
        
      
    
  );
};

export default AuditPage;