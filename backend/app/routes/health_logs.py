from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user import User
from app.models.health_log import HealthLog
from app.schemas.health_log import HealthLogCreate, HealthLogUpdate, HealthLogResponse
from app.db.session import get_db
from app.dependencies.auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[HealthLogResponse])
async def get_health_logs(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all health logs for the current user with pagination."""
    health_logs = (
        db.query(HealthLog)
        .filter(HealthLog.user_id == current_user.id)
        .order_by(desc(HealthLog.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return [HealthLogResponse.model_validate(log) for log in health_logs]


@router.post("", response_model=HealthLogResponse, status_code=status.HTTP_201_CREATED)
async def create_health_log(
    health_log_data: HealthLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new health log."""
    new_log = HealthLog(
        user_id=current_user.id,
        blood_pressure=health_log_data.blood_pressure,
        glucose_level=health_log_data.glucose_level,
        symptoms=health_log_data.symptoms
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return HealthLogResponse.model_validate(new_log)


@router.put("/{log_id}", response_model=HealthLogResponse)
async def update_health_log(
    log_id: int,
    health_log_data: HealthLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a specific health log."""
    # Find the log
    log = db.query(HealthLog).filter(
        HealthLog.id == log_id,
        HealthLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health log not found"
        )
    
    # Update fields if provided
    if health_log_data.blood_pressure is not None:
        log.blood_pressure = health_log_data.blood_pressure
    if health_log_data.glucose_level is not None:
        log.glucose_level = health_log_data.glucose_level
    if health_log_data.symptoms is not None:
        log.symptoms = health_log_data.symptoms
    
    db.commit()
    db.refresh(log)
    
    return HealthLogResponse.model_validate(log)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_health_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific health log."""
    log = db.query(HealthLog).filter(
        HealthLog.id == log_id,
        HealthLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health log not found"
        )
    
    db.delete(log)
    db.commit()
    
    return None