from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import dto

class AtorModel:
    TIPOS_HELICE_VALIDOS = ["GOVERNO", "INDUSTRIA", "UNIVERSIDADE"]

    def __init__(self, db: Session):
        self.db = db

    def listar_atores(self, mostrar_inativos: bool = False):
        if mostrar_inativos:
            query = text("""
                SELECT id, nome, tipo_helice, criado_em, atualizado_em, is_deleted 
                FROM ator 
                WHERE is_deleted = true 
                ORDER BY nome
            """)
        else:
            query = text("""
                SELECT id, nome, tipo_helice, criado_em, atualizado_em, is_deleted 
                FROM ator 
                WHERE is_deleted = false
            """)
        results = self.db.execute(query).fetchall()
        return [dict(row._mapping) for row in results]

    def buscar_por_id(self, ator_id: int):
        query = text("""
            SELECT id, nome, tipo_helice, criado_em, atualizado_em, is_deleted 
            FROM ator 
            WHERE id = :id
        """)
        result = self.db.execute(query, {"id": ator_id}).fetchone()
        if not result:
            raise ValueError("Ator não encontrado ou inativo.")
        return dict(result._mapping)

    def criar_ator(self, ator_data: dto.AtorCreate):
        tipo_helice = ator_data.tipo_helice.upper()
        if tipo_helice not in self.TIPOS_HELICE_VALIDOS:
            raise ValueError(f"Tipo de hélice inválido. Valores permitidos: {', '.join(self.TIPOS_HELICE_VALIDOS)}")
        
        dados_insercao = ator_data.model_dump()
        dados_insercao["tipo_helice"] = tipo_helice
        
        query = text("""
            INSERT INTO ator (nome, tipo_helice) 
            VALUES (:nome, :tipo_helice) 
            RETURNING id, nome, tipo_helice, criado_em, atualizado_em, is_deleted
        """)
        result = self.db.execute(query, dados_insercao)
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def atualizar_ator(self, ator_id: int, ator_data: dto.AtorUpdate):
        dados_atualizacao = ator_data.model_dump(exclude_unset=True)
        
        if dados_atualizacao.get("is_deleted") is True:
            self._inativar_vinculos_ator(ator_id)
        elif dados_atualizacao.get("is_deleted") is False:
            self._reativar_vinculos_ator(ator_id)
            
        set_clause = ", ".join([f"{key} = :{key}" for key in dados_atualizacao.keys()])
        query = text(f"""
            UPDATE ator 
            SET {set_clause}, atualizado_em = CURRENT_TIMESTAMP
            WHERE id = :id
            RETURNING id, nome, tipo_helice, criado_em, atualizado_em, is_deleted
        """)
        dados_atualizacao["id"] = ator_id
        result = self.db.execute(query, dados_atualizacao)
        
        if not result.rowcount:
            self.db.rollback()
            raise ValueError("Ator não encontrado.")
            
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def _inativar_vinculos_ator(self, ator_id: int):
        self.db.execute(text("""
            UPDATE demanda SET is_deleted = true WHERE ator_id = :ator_id AND is_deleted = false
        """), {"ator_id": ator_id})
        self.db.execute(text("""
            UPDATE expertise SET is_deleted = true WHERE ator_id = :ator_id AND is_deleted = false
        """), {"ator_id": ator_id})
        self.db.execute(text("""
            UPDATE portfolio_expertise SET is_deleted = true 
            WHERE expertise_id IN (SELECT id FROM expertise WHERE ator_id = :ator_id) AND is_deleted = false
        """), {"ator_id": ator_id})

    def _reativar_vinculos_ator(self, ator_id: int):
        self.db.execute(text("""
            UPDATE demanda SET is_deleted = false WHERE ator_id = :ator_id
        """), {"ator_id": ator_id})
        self.db.execute(text("""
            UPDATE expertise SET is_deleted = false WHERE ator_id = :ator_id
        """), {"ator_id": ator_id})
        self.db.execute(text("""
            UPDATE portfolio_expertise SET is_deleted = false 
            WHERE expertise_id IN (SELECT id FROM expertise WHERE ator_id = :ator_id)
        """), {"ator_id": ator_id})