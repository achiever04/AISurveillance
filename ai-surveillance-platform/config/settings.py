from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI Surveillance Platform"
    VERSION: str = "1.0.0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database
    POSTGRES_USER: str = "surveillance_user"
    POSTGRES_PASSWORD: str = "secure_password_123"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "surveillance_db"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # IPFS
    IPFS_API: str = "http://localhost:5001"
    IPFS_GATEWAY: str = "http://localhost:8080"
    
    # Blockchain
    FABRIC_NETWORK_PATH: str = "./blockchain/fabric-network"
    FABRIC_ORG1_MSP: str = "Org1MSP"
    FABRIC_ORG2_MSP: str = "Org2MSP"
    CHANNEL_NAME: str = "surveillance-channel"
    
    # AI Models
    FACE_DETECTION_MODEL: str = "mtcnn"
    FACE_RECOGNITION_MODEL: str = "insightface"
    CONFIDENCE_THRESHOLD: float = 0.7
    
    # Camera
    MAX_CAMERAS: int = 4
    FRAME_RATE: int = 10  # Process every 10th frame for CPU
    
    # Storage
    EVIDENCE_RETENTION_DAYS: int = 30
    MAX_EVIDENCE_SIZE_MB: int = 500
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()