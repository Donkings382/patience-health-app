from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user import User
from app.models.health_log import HealthLog
from app.schemas.health_log import HealthLogResponse
from app.dependencies.auth import get_current_user
from app.db.session import get_db  # This import was missing!

router = APIRouter()


@router.get("")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard data including recent logs and latest symptom."""
    
    # Get last 3 health logs
    recent_logs = (
        db.query(HealthLog)
        .filter(HealthLog.user_id == current_user.id)
        .order_by(desc(HealthLog.created_at))
        .limit(3)
        .all()
    )

    # Get most recent symptom
    latest_log_with_symptom = (
        db.query(HealthLog)
        .filter(
            HealthLog.user_id == current_user.id,
            HealthLog.symptoms.isnot(None),
            HealthLog.symptoms != ""
        )
        .order_by(desc(HealthLog.created_at))
        .first()
    )

    latest_symptom = latest_log_with_symptom.symptoms if latest_log_with_symptom else None

    return {
        "recent_logs": [HealthLogResponse.model_validate(log) for log in recent_logs],
        "latest_symptom": latest_symptom
    }