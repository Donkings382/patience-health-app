from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class HealthLogCreate(BaseModel):
    blood_pressure: Optional[str] = None
    glucose_level: Optional[float] = None
    symptoms: Optional[str] = None


class HealthLogUpdate(BaseModel):
    blood_pressure: Optional[str] = None
    glucose_level: Optional[float] = None
    symptoms: Optional[str] = None


class HealthLogResponse(BaseModel):
    id: int
    user_id: int
    blood_pressure: Optional[str]
    glucose_level: Optional[float]
    symptoms: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True