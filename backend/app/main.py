from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .routers import leads, orders
from .models import Lead, Order

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackFlow CRM", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
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

        orders_by_status = {
            status: db.query(Order).filter(Order.status == status).count()
            for status in ["Order Received", "In Development", "Ready to Dispatch", "Dispatched"]
        }

        return {
            "total_leads": total_leads,
            "open_leads": open_leads,
            "won_leads": won_leads,
            "conversion_rate": round((won_leads / total_leads * 100) if total_leads > 0 else 0, 2),
            "total_orders": total_orders,
            "orders_by_status": orders_by_status
        }
    except Exception as e:
        return {"error": str(e)}
