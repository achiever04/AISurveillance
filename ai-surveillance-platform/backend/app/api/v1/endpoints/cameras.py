"""
Camera management endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from datetime import datetime

from app.db.session import get_db
from app.models.camera import Camera
from app.models.user import User
from app.schemas.camera import CameraCreate, CameraUpdate, CameraResponse, CameraStats
from app.api.deps import get_current_user, require_role

router = APIRouter()

@router.get("/", response_model=List[CameraResponse])
async def get_cameras(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all cameras with optional filters"""
    query = select(Camera)
    
    if is_active is not None:
        query = query.where(Camera.is_active == is_active)
    
    query = query.offset(skip).limit(limit).order_by(Camera.id)
    
    result = await db.execute(query)
    cameras = result.scalars().all()
    
    return cameras

@router.get("/{camera_id}", response_model=CameraResponse)
async def get_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get camera by ID"""
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    return camera

@router.post("/", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
async def create_camera(
    camera_in: CameraCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin", "operator"))
):
    """Create new camera"""
    camera = Camera(
        name=camera_in.name,
        source_type=camera_in.source_type,
        source_url=camera_in.source_url,
        location=camera_in.location,
        latitude=camera_in.latitude,
        longitude=camera_in.longitude,
        resolution_width=camera_in.resolution_width,
        resolution_height=camera_in.resolution_height,
        fps=camera_in.fps
    )
    
    db.add(camera)
    await db.commit()
    await db.refresh(camera)
    
    return camera

@router.put("/{camera_id}", response_model=CameraResponse)
async def update_camera(
    camera_id: int,
    camera_update: CameraUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin", "operator"))
):
    """Update camera configuration"""
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    # Update fields
    update_data = camera_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(camera, field, value)
    
    camera.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(camera)
    
    return camera

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Delete camera"""
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    await db.delete(camera)
    await db.commit()

@router.get("/{camera_id}/stats", response_model=CameraStats)
async def get_camera_stats(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get camera statistics"""
    from app.models.detection import Detection
    from datetime import datetime, timedelta
    
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    # Total detections
    total_result = await db.execute(
        select(func.count(Detection.id)).where(Detection.camera_id == camera_id)
    )
    total_detections = total_result.scalar() or 0
    
    # Detections today
    today = datetime.utcnow().date()
    today_result = await db.execute(
        select(func.count(Detection.id))
        .where(Detection.camera_id == camera_id)
        .where(func.date(Detection.timestamp) == today)
    )
    detections_today = today_result.scalar() or 0
    
    return CameraStats(
        camera_id=camera_id,
        total_detections=total_detections,
        detections_today=detections_today,
        uptime_percentage=95.5,  # Calculate from health logs
        avg_fps=camera.fps * 0.9  # Estimate based on processing
    )

@router.post("/{camera_id}/start")
async def start_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin", "operator"))
):
    """Start camera stream processing"""
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    camera.is_active = True
    camera.updated_at = datetime.utcnow()
    
    await db.commit()
    
    # TODO: Start camera processing task
    
    return {"message": f"Camera {camera_id} started", "camera_id": camera_id}

@router.post("/{camera_id}/stop")
async def stop_camera(
    camera_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin", "operator"))
):
    """Stop camera stream processing"""
    result = await db.execute(
        select(Camera).where(Camera.id == camera_id)
    )
    camera = result.scalar_one_or_none()
    
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    camera.is_active = False
    camera.updated_at = datetime.utcnow()
    
    await db.commit()
    
    # TODO: Stop camera processing task
    
    return {"message": f"Camera {camera_id} stopped", "camera_id": camera_id}