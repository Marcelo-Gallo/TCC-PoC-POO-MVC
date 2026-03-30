from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import dto
from app.models.expertise_model import ExpertiseModel
from app.core.security import get_current_user 

expertise_controller = APIRouter(prefix="/expertises", tags=["Expertises"])

def get_expertise_model(db: Session = Depends(get_db)) -> ExpertiseModel:
    return ExpertiseModel(db)

@expertise_controller.post("", response_model=dto.ExpertiseResponse, status_code=status.HTTP_201_CREATED)
def criar_expertise(
    expertise_in: dto.ExpertiseCreate, 
    model: ExpertiseModel = Depends(get_expertise_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.criar_expertise(expertise_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@expertise_controller.put("/{expertise_id}", response_model=dto.ExpertiseResponse)
def atualizar_expertise(
    expertise_id: int, 
    expertise_in: dto.ExpertiseUpdate, 
    model: ExpertiseModel = Depends(get_expertise_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.atualizar_expertise(expertise_id, expertise_in)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Erro interno ao atualizar a expertise.")

@expertise_controller.post("/{expertise_id}/portfolios", response_model=dto.PortfolioResponse, status_code=status.HTTP_201_CREATED)
def adicionar_portfolio(
    expertise_id: int, 
    portfolio_in: dto.PortfolioCreate, 
    model: ExpertiseModel = Depends(get_expertise_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.adicionar_portfolio(expertise_id, portfolio_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@expertise_controller.put("/portfolios/{portfolio_id}", response_model=dto.PortfolioResponse)
def atualizar_portfolio(
    portfolio_id: int, 
    portfolio_in: dto.PortfolioUpdate, 
    model: ExpertiseModel = Depends(get_expertise_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.atualizar_portfolio(portfolio_id, portfolio_in)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@expertise_controller.get("", response_model=List[dto.ExpertiseResponse])
def listar_expertises(
    mostrar_inativos: bool = False, 
    model: ExpertiseModel = Depends(get_expertise_model), 
    current_user: str = Depends(get_current_user)
):
    return model.listar_expertises(mostrar_inativos)