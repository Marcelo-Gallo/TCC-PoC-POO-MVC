from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import dto

class DemandaModel:
    def __init__(self, db: Session):
        self.db = db

    def listar_demandas(self, mostrar_inativos: bool = False):
        if mostrar_inativos:
            query = text("""
                SELECT id, titulo, descricao, ator_id, area_cnpq, is_deleted 
                FROM demanda 
                WHERE is_deleted = true
            """)
        else:
            query = text("""
                SELECT id, titulo, descricao, ator_id, area_cnpq, is_deleted 
                FROM demanda 
                WHERE is_deleted = false
            """)
        results = self.db.execute(query).fetchall()
        return [dict(row._mapping) for row in results]

    def buscar_por_id(self, demanda_id: int):
        query = text("""
            SELECT id, titulo, descricao, ator_id, area_cnpq, is_deleted 
            FROM demanda 
            WHERE id = :id
        """)
        result = self.db.execute(query, {"id": demanda_id}).fetchone()
        if not result:
            raise ValueError("Demanda não encontrada ou já inativa.")
        return dict(result._mapping)

    def criar_demanda(self, demanda_data: dto.DemandaCreate):
        self._verificar_ator_ativo(demanda_data.ator_id)
        
        dados_insercao = demanda_data.model_dump()
        query = text("""
            INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) 
            VALUES (:titulo, :descricao, :ator_id, :area_cnpq) 
            RETURNING id, titulo, descricao, ator_id, area_cnpq, is_deleted
        """)
        result = self.db.execute(query, dados_insercao)
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def atualizar_demanda(self, demanda_id: int, demanda_data: dto.DemandaUpdate):
        demanda_existente = self.buscar_por_id(demanda_id)
        
        if demanda_data.ator_id is not None and demanda_data.ator_id != demanda_existente["ator_id"]:
            self._verificar_ator_ativo(demanda_data.ator_id)

        dados_atualizacao = demanda_data.model_dump(exclude_unset=True)
        if not dados_atualizacao:
            return demanda_existente

        set_clause = ", ".join([f"{key} = :{key}" for key in dados_atualizacao.keys()])
        query = text(f"""
            UPDATE demanda 
            SET {set_clause}
            WHERE id = :id
            RETURNING id, titulo, descricao, ator_id, area_cnpq, is_deleted
        """)
        dados_atualizacao["id"] = demanda_id
        result = self.db.execute(query, dados_atualizacao)
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def _verificar_ator_ativo(self, ator_id: int):
        query = text("SELECT id, is_deleted FROM ator WHERE id = :id")
        result = self.db.execute(query, {"id": ator_id}).fetchone()
        
        if not result or result._mapping["is_deleted"]:
            raise ValueError("Ator vinculado não encontrado ou inativo.")