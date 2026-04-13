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
                "primeiro_login": gestor["primeiro_login"]
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
    
    def verificar_email_existe(self, email: str):
        """
        Verifica se o e-mail pertence a um gestor ativo.
        Utilizado antes de disparar o e-mail de recuperação.
        """
        return self._buscar_por_email(email)

    def redefinir_senha(self, email: str, nova_senha: str):
        """
        Gera o hash da nova senha e atualiza o registo no banco de dados.
        Garante a integridade através do commit da transação.
        """
        nova_senha_hash = security.get_password_hash(nova_senha)
        
        query = text("""
            UPDATE gestor 
            SET senha_hash = :nova_senha_hash, primeiro_login = false 
            WHERE email = :email AND is_deleted = false
        """)
        
        try:
            result = self.db.execute(query, {
                "nova_senha_hash": nova_senha_hash, 
                "email": email
            })

            if result.rowcount == 0:
                self.db.rollback()
                raise ValueError("Usuário não encontrado ou inativo.")
            
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            print(f"Erro ao atualizar senha: {e}")
            raise ValueError("Erro interno ao atualizar a senha no banco de dados.")