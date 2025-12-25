import React, { useState, useEffect } from 'react';
import { detectionAPI } from '../services/api';
import { FileText, Download, Eye, Shield } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EvidencePage = () => {
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      const response = await detectionAPI.getAll({ limit: 50 });
      setDetections(response.data);
    } catch (error) {
      console.error('Failed to load evidence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return ;
  }

  return (
    
      Evidence Management

      
        
          
            All Evidence
            
              
                
                Export
              
            
          
        

        
          
            
              
                
                  Event ID
                
                
                  Type
                
                
                  Camera
                
                
                  Timestamp
                
                
                  Blockchain
                
                
                  Actions
                
              
            
            
              {detections.map((detection) => (
                
                  
                    {detection.event_id}
                  
                  
                    
                      {detection.detection_type}
                    
                  
                  
                    Camera {detection.camera_id}
                  
                  
                    {new Date(detection.timestamp).toLocaleString()}
                  
                  
                    {detection.blockchain_tx_id ? (
                      
                        
                        Verified
                      
                    ) : (
                      Pending
                    )}
                  
                  
                    
                      
                        
                      
                      
                        
                      
                    
                  
                
              ))}
            
          
        
      
    
  );
};

export default EvidencePage;