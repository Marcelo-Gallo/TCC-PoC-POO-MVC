from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import dto
from app.models.demanda_model import DemandaModel
from app.core.security import get_current_user

demanda_controller = APIRouter(prefix="/demandas", tags=["Demandas"])

def get_demanda_model(db: Session = Depends(get_db)) -> DemandaModel:
    return DemandaModel(db)

@demanda_controller.get("", response_model=List[dto.DemandaResponse])
def listar_demandas(
    mostrar_inativos: bool = False, 
    model: DemandaModel = Depends(get_demanda_model), 
    current_user: str = Depends(get_current_user)
):
    return model.listar_demandas(mostrar_inativos)

@demanda_controller.post("", response_model=dto.DemandaResponse, status_code=status.HTTP_201_CREATED)
def criar_demanda(
    demanda_in: dto.DemandaCreate, 
    model: DemandaModel = Depends(get_demanda_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.criar_demanda(demanda_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@demanda_controller.put("/{demanda_id}", response_model=dto.DemandaResponse)
def atualizar_demanda(
    demanda_id: int, 
    demanda_in: dto.DemandaUpdate, 
    model: DemandaModel = Depends(get_demanda_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.atualizar_demanda(demanda_id, demanda_in)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))