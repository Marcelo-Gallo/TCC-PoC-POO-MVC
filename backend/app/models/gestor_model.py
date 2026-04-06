from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import dto
from app.core.security import get_password_hash

class GestorModel:
    def __init__(self, db: Session):
        self.db = db

    def listar_gestores(self):
        query = text("""
            SELECT id, nome, email, is_master, is_deleted 
            FROM gestor 
            WHERE is_deleted = false 
            ORDER BY is_master DESC, nome ASC
        """)
        results = self.db.execute(query).fetchall()
        return [dict(row._mapping) for row in results]

    def criar_gestor(self, gestor_data: dto.GestorCreate):
        senha_hash = get_password_hash(gestor_data.senha)
        try:
            query = text("""
                INSERT INTO gestor (nome, email, senha_hash, is_master) 
                VALUES (:nome, :email, :senha_hash, false) 
                RETURNING id, nome, email, is_master, is_deleted
            """)
            result = self.db.execute(query, {
                "nome": gestor_data.nome,
                "email": gestor_data.email,
                "senha_hash": senha_hash
            })
            self.db.commit()
            return dict(result.fetchone()._mapping)
        except Exception:
            self.db.rollback()
            raise ValueError("Erro ao cadastrar: este e-mail já pode estar em uso.")

    def transferir_master(self, email_atual: str, novo_master_id: int):
        query_verificacao = text("SELECT id, is_master FROM gestor WHERE email = :email")
        atual = self.db.execute(query_verificacao, {"email": email_atual}).fetchone()

        if not atual or not atual._mapping["is_master"]:
            raise ValueError("Apenas o Administrador Master pode realizar esta transferência.")

        id_atual = atual._mapping["id"]

        try:
            self.db.execute(text("UPDATE gestor SET is_master = false WHERE id = :id"), {"id": id_atual})
            res = self.db.execute(
                text("UPDATE gestor SET is_master = true WHERE id = :id AND is_deleted = false RETURNING id"),
                {"id": novo_master_id}
            )
            
            if not res.fetchone():
                raise ValueError("Gestor alvo não encontrado ou inativo.")

            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise ValueError(str(e))

    def deletar_gestor(self, gestor_id: int):
        query = text("SELECT is_master FROM gestor WHERE id = :id")
        alvo = self.db.execute(query, {"id": gestor_id}).fetchone()

        if not alvo:
            raise ValueError("Gestor não encontrado.")
        if alvo._mapping["is_master"]:
            raise ValueError("Não é possível excluir o Master. Transfira a titularidade primeiro.")

        self.db.execute(text("UPDATE gestor SET is_deleted = true WHERE id = :id"), {"id": gestor_id})
        self.db.commit()