"""
Anti-spoofing detection using Silent-Face-Anti-Spoofing
"""
from silent_face_anti_spoofing.anti_spoof_predictor import AntiSpoofPredictor
import cv2
import numpy as np
from typing import Tuple

class AntiSpoofDetector:
    def __init__(self):
        """Initialize anti-spoofing detector"""
        self.predictor = AntiSpoofPredictor(device_id=0)  # 0 for CPU
    
    def predict(
        self,
        image: np.ndarray,
        face_bbox: Tuple[int, int, int, int]
    ) -> Tuple[bool, float]:
        """
        Predict if face is real or spoofed
        
        Args:
            image: Full BGR image
            face_bbox: (x1, y1, x2, y2)
            
        Returns:
            (is_real, confidence_score)
        """
        try:
            # Convert bbox format for predictor
            x1, y1, x2, y2 = face_bbox
            bbox = [x1, y1, x2 - x1, y2 - y1]  # [x, y, w, h]
            
            # Predict
            prediction = self.predictor.predict(image, bbox)
            
            # prediction is 1 for real, 0 for spoof
            is_real = prediction == 1
            
            # For now, use binary confidence (can be enhanced)
            confidence = 0.9 if is_real else 0.1
            
            return is_real, confidence
            
        except Exception as e:
            print(f"Anti-spoofing detection failed: {e}")
            # Default to assuming real (fail-open for better UX)
            return True, 0.5
    
    def predict_from_crop(self, face_crop: np.ndarray) -> bool:
        """
        Predict from cropped face image
        Simplified version
        """
        # For cropped image, create dummy bbox
        h, w = face_crop.shape[:2]
        bbox = [0, 0, w, h]
        
        try:
            prediction = self.predictor.predict(face_crop, bbox)
            return prediction == 1
        except:
            return True