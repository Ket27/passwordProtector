from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from config.connect import Base, engine 
from routes.authRouter import router as login_router
from routes.passwordRouter import router as password_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, tags=["login"])
app.include_router(password_router, prefix="/passwords", tags=["password"])

@app.get("/")
def root():
    return RedirectResponse(url = "/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload = False
    )
