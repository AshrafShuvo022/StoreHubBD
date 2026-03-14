from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, sellers, products, upload, store, orders

app = FastAPI(title="StoreHubBD API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"http://.*\.localhost(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sellers.router)
app.include_router(products.router)
app.include_router(upload.router)
app.include_router(store.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "StoreHubBD API is running"}
