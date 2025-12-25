"""
Blockchain query endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime  # ← ADD THIS LINE

from app.db.session import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.services.blockchain_service import BlockchainService
from app.schemas.blockchain import ProvenanceQuery, ProvenanceResponse

router = APIRouter()

@router.post("/provenance", response_model=ProvenanceResponse)
async def get_evidence_provenance(
    query: ProvenanceQuery,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get evidence provenance from blockchain"""
    service = BlockchainService(db)
    provenance = await service.get_evidence_provenance(query.event_id)
    
    return provenance

@router.post("/verify/{event_id}")
async def verify_evidence_blockchain(
    event_id: str,
    current_hash: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify evidence integrity using blockchain"""
    service = BlockchainService(db)
    is_valid = await service.verify_evidence_integrity(event_id, current_hash)
    
    return {
        "event_id": event_id,
        "is_valid": is_valid,
        "verified_at": datetime.utcnow().isoformat()  # ← NOW WORKS
    }