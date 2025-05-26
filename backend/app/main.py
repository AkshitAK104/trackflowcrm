from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from .database import engine, Base, get_db
from .routers import leads, orders
from .models import Lead, Order

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackFlow CRM", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers FIRST
app.include_router(leads.router, prefix="/api")
app.include_router(orders.router, prefix="/api")

# API endpoints
@app.get("/api/")
def api_root():
    return {"message": "TrackFlow CRM API"}

@app.get("/api/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        total_leads = db.query(Lead).count()
        open_leads = db.query(Lead).filter(Lead.stage.notin_(["Won", "Lost"])).count()
        won_leads = db.query(Lead).filter(Lead.stage == "Won").count()
        total_orders = db.query(Order).count()
        
        orders_by_status = {}
        for status in ["Order Received", "In Development", "Ready to Dispatch", "Dispatched"]:
            orders_by_status[status] = db.query(Order).filter(Order.status == status).count()
        
        conversion_rate = round((won_leads / total_leads * 100) if total_leads > 0 else 0, 2)
        
        return {
            "total_leads": total_leads,
            "open_leads": open_leads,
            "won_leads": won_leads,
            "conversion_rate": conversion_rate,
            "total_orders": total_orders,
            "orders_by_status": orders_by_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Mount static files
static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir / "static")), name="static")

@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

# Serve React app for non-API routes (MUST be last!)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    static_dir = Path(__file__).parent.parent / "static"
    if static_dir.exists():
        return FileResponse(str(static_dir / "index.html"))
    else:
        return {"message": "TrackFlow CRM API - Frontend not deployed"}
