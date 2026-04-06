from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core import security

class AuthModel:
    def __init__(self, db: Session):
        self.db = db

    def autenticar_gestor(self, email: str, senha: str):
        gestor = self._buscar_por_email(email)
        
        if not gestor or not security.verify_password(senha, gestor["senha_hash"]):
            raise ValueError("Credenciais inválidas")
            
        token_jwt = security.create_access_token(
            data={
                "sub": gestor["email"], 
                "nome": gestor["nome"], 
                "is_master": gestor["is_master"],
                "primeiro_login": gestor["primeiro_login"] # Injetando no token
            }
        )
        return {"access_token": token_jwt, "token_type": "bearer"}

    def _buscar_por_email(self, email: str):
        query = text("""
            SELECT id, nome, email, senha_hash, is_master, primeiro_login, is_deleted 
            FROM gestor 
            WHERE email = :email AND is_deleted = false
        """)
        result = self.db.execute(query, {"email": email}).fetchone()
        return dict(result._mapping) if result else None