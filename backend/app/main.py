from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .routers import leads, orders
from .models import Lead, Order

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackFlow CRM", version="1.0.0")

# Configure CORS - Updated for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://trackflow-api-l0vt.onrender.com",  # Your Render backend
        "https://*.vercel.app",  # All Vercel deployments
        "https://*.netlify.app"  # All Netlify deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leads.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "TrackFlow CRM API"}

@app.get("/dashboard")
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

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "TrackFlow CRM API"}

@app.get("/test")
def test_endpoint():
    """Test endpoint to verify API is working"""
    return {"message": "API is working correctly", "timestamp": "2025-05-27"}
