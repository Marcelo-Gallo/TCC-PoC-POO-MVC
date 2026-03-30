from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import dto
from app.models.ator_model import AtorModel
from app.core.security import get_current_user

ator_controller = APIRouter(prefix="/atores", tags=["Atores"])

def get_ator_model(db: Session = Depends(get_db)) -> AtorModel:
    return AtorModel(db)

@ator_controller.get("", response_model=List[dto.AtorResponse])
def listar_atores(
    mostrar_inativos: bool = False, 
    model: AtorModel = Depends(get_ator_model), 
    current_user: str = Depends(get_current_user)
):
    return model.listar_atores(mostrar_inativos)

@ator_controller.post("", response_model=dto.AtorResponse, status_code=status.HTTP_201_CREATED)
def criar_ator(
    ator_in: dto.AtorCreate, 
    model: AtorModel = Depends(get_ator_model), 
    current_user: str = Depends(get_current_user)
): 
    try:
        return model.criar_ator(ator_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@ator_controller.put("/{ator_id}", response_model=dto.AtorResponse)
def atualizar_ator(
    ator_id: int, 
    ator_in: dto.AtorUpdate, 
    model: AtorModel = Depends(get_ator_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.atualizar_ator(ator_id, ator_in)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Erro interno ao atualizar o ator.")