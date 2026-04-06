from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import dto
from app.models.gestor_model import GestorModel
from app.core.security import get_current_user

gestor_controller = APIRouter(prefix="/gestores", tags=["Gestores"])

def get_gestor_model(db: Session = Depends(get_db)) -> GestorModel:
    return GestorModel(db)

@gestor_controller.get("", response_model=List[dto.GestorResponse])
def listar_gestores(
    model: GestorModel = Depends(get_gestor_model), 
    current_user: dict = Depends(get_current_user)
):
    return model.listar_gestores()

@gestor_controller.post("", response_model=dto.GestorResponse, status_code=status.HTTP_201_CREATED)
def criar_gestor(
    gestor_in: dto.GestorCreate, 
    model: GestorModel = Depends(get_gestor_model), 
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("is_master"):
        raise HTTPException(status_code=403, detail="Acesso negado: Apenas o Administrador Master pode criar contas.")
    try:
        return model.criar_gestor(gestor_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@gestor_controller.post("/{novo_master_id}/transferir-master")
def transferir_master(
    novo_master_id: int,
    model: GestorModel = Depends(get_gestor_model),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("is_master"):
        raise HTTPException(status_code=403, detail="Acesso negado: Apenas o Master pode transferir o master.")
    try:
        model.transferir_master(current_user["email"], novo_master_id)
        return {"message": "Titularidade transferida com sucesso. Faça login novamente para atualizar suas permissões."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@gestor_controller.delete("/{gestor_id}")
def deletar_gestor(
    gestor_id: int,
    model: GestorModel = Depends(get_gestor_model),
    current_user: dict = Depends(get_current_user)
):
    if not current_user.get("is_master"):
        raise HTTPException(status_code=403, detail="Acesso negado: Apenas o Master pode excluir contas.")
    try:
        model.deletar_gestor(gestor_id)
        return {"message": "Gestor excluído com sucesso."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))