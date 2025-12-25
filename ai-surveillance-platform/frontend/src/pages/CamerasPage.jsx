import React, { useState, useEffect } from 'react';
import { cameraAPI } from '../services/api';
import { Video, VideoOff, Play, Pause, Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

const CamerasPage = () => {
  const [cameras, setCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const response = await cameraAPI.getAll();
      setCameras(response.data);
    } catch (error) {
      setError('Failed to load cameras');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCamera = async (cameraId) => {
    try {
      await cameraAPI.start(cameraId);
      loadCameras();
    } catch (error) {
      setError('Failed to start camera');
    }
  };

  const handleStopCamera = async (cameraId) => {
    try {
      await cameraAPI.stop(cameraId);
      loadCameras();
    } catch (error) {
      setError('Failed to stop camera');
    }
  };

  if (isLoading) {
    return ;
  }

  return (
    
      
        Cameras
        
          
          Add Camera
        
      

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      
        {cameras.map((camera) => (
          
            
              {camera.is_online ? (
                
              ) : (
                
              )}
              
              
                {camera.is_online ? 'Online' : 'Offline'}
              
            

            
              {camera.name}
              {camera.location || 'No location set'}

              
                {camera.resolution_width}x{camera.resolution_height}
                {camera.fps} FPS
              

              
                {camera.is_active ? (
                  <button
                    onClick={() => handleStopCamera(camera.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
                  >
                    
                    Stop
                  
                ) : (
                  <button
                    onClick={() => handleStartCamera(camera.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100"
                  >
                    
                    Start
                  
                )}

                
                  
                
                
                  
                
              
            
          
        ))}
      

      {cameras.length === 0 && (
        
          
          No cameras added
          Add your first camera to start monitoring
          
            Add Camera
          
        
      )}
    
  );
};

export default CamerasPage;