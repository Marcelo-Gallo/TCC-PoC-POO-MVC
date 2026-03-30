from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import dto
from app.models.auth_model import AuthModel

auth_controller = APIRouter(prefix="/auth", tags=["Autenticação"])

def get_auth_model(db: Session = Depends(get_db)) -> AuthModel:
    return AuthModel(db)

@auth_controller.post("/login", response_model=dto.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    model: AuthModel = Depends(get_auth_model)
):
    try:
        return model.autenticar_gestor(form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )