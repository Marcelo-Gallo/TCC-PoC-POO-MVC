from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import dto

class ExpertiseModel:
    def __init__(self, db: Session):
        self.db = db

    def listar_expertises(self, mostrar_inativos: bool = False):
        if mostrar_inativos:
            query = text("""
                SELECT e.*, 
                       COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as portfolios
                FROM expertise e
                LEFT JOIN portfolio_expertise p ON e.id = p.expertise_id
                WHERE e.is_deleted = TRUE
                GROUP BY e.id
            """)
        else:
            query = text("""
                SELECT e.*, 
                       COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL AND p.is_deleted = FALSE), '[]') as portfolios
                FROM expertise e
                LEFT JOIN portfolio_expertise p ON e.id = p.expertise_id
                WHERE e.is_deleted = FALSE
                GROUP BY e.id
            """)
        result = self.db.execute(query).fetchall()
        return [dict(row._mapping) for row in result]

    def criar_expertise(self, expertise_data: dto.ExpertiseCreate):
        self._verificar_ator_universidade(expertise_data.ator_id)
        
        dados_insercao = expertise_data.model_dump()
        query = text("""
            INSERT INTO expertise (area_conhecimento, area_cnpq, link_lattes, pesquisador_responsavel, ator_id) 
            VALUES (:area_conhecimento, :area_cnpq, :link_lattes, :pesquisador_responsavel, :ator_id) 
            RETURNING id, area_conhecimento, area_cnpq, link_lattes, pesquisador_responsavel, ator_id, is_deleted
        """)
        result = self.db.execute(query, dados_insercao)
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def atualizar_expertise(self, expertise_id: int, expertise_data: dto.ExpertiseUpdate):
        dados_atualizacao = expertise_data.model_dump(exclude_unset=True)
        
        if dados_atualizacao.get("is_deleted") is True:
            self._inativar_portfolios(expertise_id)
        elif dados_atualizacao.get("is_deleted") is False:
            self._reativar_portfolios(expertise_id)
            
        set_clause = ", ".join([f"{key} = :{key}" for key in dados_atualizacao.keys()])
        if not set_clause:
            raise ValueError("Nenhum dado para atualizar.")

        query = text(f"""
            UPDATE expertise 
            SET {set_clause}
            WHERE id = :id
            RETURNING id, area_conhecimento, area_cnpq, link_lattes, pesquisador_responsavel, ator_id, is_deleted
        """)
        dados_atualizacao["id"] = expertise_id
        result = self.db.execute(query, dados_atualizacao)
        
        if not result.rowcount:
            self.db.rollback()
            raise ValueError("Expertise não encontrada.")
            
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def adicionar_portfolio(self, expertise_id: int, portfolio_data: dto.PortfolioCreate):
        dados_insercao = portfolio_data.model_dump()
        dados_insercao["expertise_id"] = expertise_id 
        
        query = text("""
            INSERT INTO portfolio_expertise (expertise_id, tipo, titulo, ano_publicacao, link_acesso, resumo) 
            VALUES (:expertise_id, :tipo, :titulo, :ano_publicacao, :link_acesso, :resumo) 
            RETURNING id, expertise_id, tipo, titulo, ano_publicacao, link_acesso, resumo, is_deleted
        """)
        result = self.db.execute(query, dados_insercao)
        self.db.commit()
        return dict(result.fetchone()._mapping)

    def atualizar_portfolio(self, portfolio_id: int, portfolio_data: dto.PortfolioUpdate):
        dados_atualizacao = portfolio_data.model_dump(exclude_unset=True)
        if not dados_atualizacao:
            raise ValueError("Nenhum dado para atualizar.")

        set_clause = ", ".join([f"{key} = :{key}" for key in dados_atualizacao.keys()])
        query = text(f"""
            UPDATE portfolio_expertise 
            SET {set_clause}
            WHERE id = :id
            RETURNING id, expertise_id, tipo, titulo, ano_publicacao, link_acesso, resumo, is_deleted
        """)
        dados_atualizacao["id"] = portfolio_id
        result = self.db.execute(query, dados_atualizacao)
        
        if not result.rowcount:
            raise ValueError("Item do portfólio não encontrado ou já inativo.")

        self.db.commit()
        return dict(result.fetchone()._mapping)

    def _verificar_ator_universidade(self, ator_id: int):
        query = text("SELECT id, tipo_helice, is_deleted FROM ator WHERE id = :id")
        result = self.db.execute(query, {"id": ator_id}).fetchone()
        
        if not result or result._mapping["is_deleted"]:
            raise ValueError("Ator não encontrado ou inativo.")
        
        if result._mapping["tipo_helice"].upper() != "UNIVERSIDADE":
            raise ValueError("Operação negada: Uma expertise deve estar obrigatoriamente vinculada a uma instituição acadêmica (UNIVERSIDADE).")

    def _inativar_portfolios(self, expertise_id: int):
        query = text("""
            UPDATE portfolio_expertise 
            SET is_deleted = true 
            WHERE expertise_id = :expertise_id AND is_deleted = false
        """)
        self.db.execute(query, {"expertise_id": expertise_id})

    def _reativar_portfolios(self, expertise_id: int):
        query = text("""
            UPDATE portfolio_expertise 
            SET is_deleted = false 
            WHERE expertise_id = :expertise_id
        """)
        self.db.execute(query, {"expertise_id": expertise_id})