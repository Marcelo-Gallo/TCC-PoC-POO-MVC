from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import gestor_controller
import seed
import os

from app.controllers import (
    auth_controller,
    ator_controller,
    demanda_controller,
    expertise_controller,
    matchmaking_controller
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando a API e verificando o banco de dados...")
    seed.seed_data()
    yield

ROOT_PATH = os.getenv("ROOT_PATH", "")

app = FastAPI(
    title="API Matchmaking Tríplice Hélice",
    description="Módulo de corretagem digital de inovação para gestão municipal. (Refatorado para POO/MVC)",
    version="1.0.0",
    root_path=ROOT_PATH,
    lifespan=lifespan
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
app.include_router(gestor_controller.gestor_controller)