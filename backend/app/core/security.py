import os
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
import bcrypt
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "chave_super_secreta_tcc_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password_bytes.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        nome: str = payload.get("nome")
        is_master: bool = payload.get("is_master", False)
        primeiro_login: bool = payload.get("primeiro_login", False) # Novo
        
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
        
    return {"email": email, "nome": nome, "is_master": is_master, "primeiro_login": primeiro_login}

def decode_token_email(token: str) -> dict | None:
    """
    Decodifica um token puro passado como string, sem depender de cabeçalhos HTTP.
    Usado para validação de tokens de recuperação de senha.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None