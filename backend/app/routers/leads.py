from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Lead
from ..schemas import Lead as LeadSchema, LeadCreate, LeadUpdate

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("/", response_model=LeadSchema)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    try:
        if not lead.name or not lead.contact:
            raise HTTPException(status_code=400, detail="Name and contact are required")
        
        db_lead = Lead(**lead.dict())
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        return db_lead
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating lead: {str(e)}")

@router.get("/", response_model=List[LeadSchema])
def get_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        leads = db.query(Lead).offset(skip).limit(limit).all()
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching leads: {str(e)}")

@router.get("/{lead_id}", response_model=LeadSchema)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if lead is None:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lead: {str(e)}")

@router.put("/{lead_id}", response_model=LeadSchema)
def update_lead(lead_id: int, lead_update: LeadUpdate, db: Session = Depends(get_db)):
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if lead is None:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        for field, value in lead_update.dict(exclude_unset=True).items():
            setattr(lead, field, value)
        
        db.commit()
        db.refresh(lead)
        return lead
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating lead: {str(e)}")

@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if lead is None:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        db.delete(lead)
        db.commit()
        return {"message": "Lead deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting lead: {str(e)}")
