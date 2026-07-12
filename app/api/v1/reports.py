import csv
import io
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.dependencies.auth import get_current_user
from app.schemas.report import DashboardKPIs, VehicleReport
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/dashboard", response_model=DashboardKPIs)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return report_service.get_dashboard_kpis(db)


@router.get("/vehicles", response_model=list[VehicleReport])
def all_vehicle_reports(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return report_service.get_all_vehicle_reports(db)


@router.get("/vehicle/{vehicle_id}", response_model=VehicleReport)
def vehicle_report(
    vehicle_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    report = report_service.get_vehicle_report(db, vehicle_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return report


@router.get("/export.csv")
def export_csv(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    reports = report_service.get_all_vehicle_reports(db)

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "vehicle_id", "registration_number", "total_distance", "total_fuel_liters",
        "fuel_efficiency", "total_fuel_cost", "total_maintenance_cost",
        "total_other_expenses", "total_operational_cost", "total_revenue", "roi",
    ])
    for r in reports:
        writer.writerow([
            r.vehicle_id, r.registration_number, r.total_distance, r.total_fuel_liters,
            r.fuel_efficiency, r.total_fuel_cost, r.total_maintenance_cost,
            r.total_other_expenses, r.total_operational_cost, r.total_revenue, r.roi,
        ])

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transitops_report.csv"},
    )