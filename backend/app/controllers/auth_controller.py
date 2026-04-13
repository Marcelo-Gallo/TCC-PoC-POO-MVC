from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import security
from app.core.email import enviar_email_recuperacao
from app.models import dto
from app.models.auth_model import AuthModel
from datetime import timedelta

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
    
@auth_controller.post("/recuperar-senha")
async def solicitar_recuperacao(
    background_tasks: BackgroundTasks,
    email: str = Body(..., embed=True),
    model: AuthModel = Depends(get_auth_model)
):
    """
    Endpoint para solicitar a recuperação. 
    Verifica o e-mail e dispara a tarefa de envio em background.
    """
    gestor = model.verificar_email_existe(email)
    
    if gestor:
        token_recuperacao = security.create_access_token(
            data={"sub": email, "tipo": "recuperacao"},
            expires_delta=timedelta(minutes=15)
        )
        background_tasks.add_task(enviar_email_recuperacao, email, token_recuperacao)
    return {"detail": "Se o e-mail estiver cadastrado, as instruções serão enviadas rapido."}

@auth_controller.post("/redefinir-senha")
def redefinir_senha(
    token: str = Body(...),
    nova_senha: str = Body(...),
    model: AuthModel = Depends(get_auth_model)
):
    """
    Endpoint final que valida o token JWT e atualiza a senha no banco.
    """
    try:
        payload = security.decode_token_email(token)
        email = payload.get("sub")
        tipo = payload.get("tipo")

        if tipo != "recuperacao":
            raise HTTPException(status_code=400, detail="Token inválido para esta operação.")
        model.redefinir_senha(email, nova_senha)
        
        return {"detail": "Senha atualizada com sucesso!"}

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="O link de recuperação expirou ou é inválido.",
        )