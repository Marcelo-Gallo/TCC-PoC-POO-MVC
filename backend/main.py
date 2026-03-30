from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import (
    auth_controller,
    ator_controller,
    demanda_controller,
    expertise_controller,
    matchmaking_controller
)

app = FastAPI(
    title="API Matchmaking Tríplice Hélice",
    description="Módulo de corretagem digital de inovação para gestão municipal. (Refatorado para POO/MVC)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller.auth_controller)
app.include_router(ator_controller.ator_controller)
app.include_router(demanda_controller.demanda_controller)
app.include_router(expertise_controller.expertise_controller)
app.include_router(matchmaking_controller.matchmaking_controller)