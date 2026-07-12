import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.driver import Driver, DriverStatus
from app.models.user import UserRole
from app.schemas.driver import DriverCreate, DriverOut, DriverUpdate

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.get("", response_model=list[DriverOut])
def list_drivers(
    status_filter: Optional[DriverStatus] = Query(default=None, alias="status"),
    expiring_within_days: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = select(Driver)
    if status_filter:
        query = query.where(Driver.status == status_filter)
    if expiring_within_days is not None:
        from datetime import timedelta

        cutoff = date.today() + timedelta(days=expiring_within_days)
        query = query.where(Driver.license_expiry_date <= cutoff)

    query = query.offset(skip).limit(limit)
    return db.execute(query).scalars().all()


@router.get("/available", response_model=list[DriverOut])
def list_available_drivers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Excludes Suspended, On Trip, Off Duty, AND expired licenses —
    # license validity is a business rule, not just a status flag.
    query = select(Driver).where(
        Driver.status == DriverStatus.AVAILABLE,
        Driver.license_expiry_date >= date.today(),
    )
    return db.execute(query).scalars().all()


@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(
    driver_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    driver = db.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
    return driver


@router.post("", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
def create_driver(
    payload: DriverCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)),
):
    existing = db.execute(
        select(Driver).where(Driver.license_number == payload.license_number)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A driver with this license number already exists",
        )

    driver = Driver(**payload.model_dump())
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


@router.patch("/{driver_id}", response_model=DriverOut)
def update_driver(
    driver_id: uuid.UUID,
    payload: DriverUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)),
):
    driver = db.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)

    db.commit()
    db.refresh(driver)
    return driver