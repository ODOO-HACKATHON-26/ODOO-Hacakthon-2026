import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user
from app.models.trip import Trip, TripStatus
from app.schemas.trip import TripCreate, TripCompleteRequest, TripOut
from app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[TripOut])
def list_trips(
    status_filter: Optional[TripStatus] = Query(default=None, alias="status"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(Trip)
    if status_filter:
        query = query.where(Trip.status == status_filter)
    query = query.offset(skip).limit(limit).order_by(Trip.created_at.desc())
    return db.execute(query).scalars().all()


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    trip = db.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


@router.post("", response_model=TripOut, status_code=status.HTTP_201_CREATED)
def create_trip(
    payload: TripCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return trip_service.create_trip(db, payload, created_by=current_user.id)


@router.post("/{trip_id}/dispatch", response_model=TripOut)
def dispatch_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return trip_service.dispatch_trip(db, trip_id)


@router.post("/{trip_id}/complete", response_model=TripOut)
def complete_trip(
    trip_id: uuid.UUID,
    payload: TripCompleteRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return trip_service.complete_trip(db, trip_id, payload)


@router.post("/{trip_id}/cancel", response_model=TripOut)
def cancel_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return trip_service.cancel_trip(db, trip_id)