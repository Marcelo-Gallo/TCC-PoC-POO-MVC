from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class GestorCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str

class GestorResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    is_master: bool
    primeiro_login: bool
    is_deleted: bool

    class Config:
        from_attributes = True

class GestorPrimeiroLogin(BaseModel):
    nova_senha: str

class AtorBase(BaseModel):
    nome: str
    tipo_helice: str

class AtorCreate(AtorBase):
    pass

class AtorUpdate(AtorBase):
    nome: Optional[str] = None
    tipo_helice: Optional[str] = None
    is_deleted: Optional[bool] = None

class AtorResponse(AtorBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime
    is_deleted: bool

    class Config:
        from_attributes = True

class DemandaBase(BaseModel):
    titulo: str
    descricao: str
    ator_id: int
    area_cnpq: str

class DemandaCreate(DemandaBase):
    pass

class DemandaUpdate(DemandaBase):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    ator_id: Optional[int] = None
    area_cnpq: Optional[str] = None
    is_deleted: Optional[bool] = None

class DemandaResponse(DemandaBase):
    id: int
    is_deleted: bool

    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    tipo: str
    titulo: str
    ano_publicacao: int
    link_acesso: Optional[str] = None
    resumo: str

class PortfolioCreate(PortfolioBase):
    expertise_id: int

class PortfolioUpdate(PortfolioBase):
    tipo: Optional[str] = None
    titulo: Optional[str] = None
    ano_publicacao: Optional[int] = None
    link_acesso: Optional[str] = None
    resumo: Optional[str] = None
    is_deleted: Optional[bool] = None

class PortfolioResponse(PortfolioBase):
    id: int
    expertise_id: int
    is_deleted: bool

    class Config:
        from_attributes = True

class ExpertiseBase(BaseModel):
    area_conhecimento: str
    area_cnpq: str
    link_lattes: Optional[str] = None
    pesquisador_responsavel: str
    ator_id: int

class ExpertiseCreate(ExpertiseBase):
    pass

class ExpertiseUpdate(ExpertiseBase):
    area_conhecimento: Optional[str] = None
    area_cnpq: Optional[str] = None
    link_lattes: Optional[str] = None
    pesquisador_responsavel: Optional[str] = None
    ator_id: Optional[int] = None
    is_deleted: Optional[bool] = None

class ExpertiseResponse(ExpertiseBase):
    id: int
    is_deleted: bool
    portfolios: List[PortfolioResponse] = []

    class Config:
        from_attributes = True

class MatchmakingResult(BaseModel):
    expertise_id: int
    pesquisador_responsavel: str
    area_conhecimento: str
    link_lattes: Optional[str] = None
    link_portfolio: Optional[str] = None
    score: float
    termos_explicativos: List[str] = []

class MatchmakingMetrics(BaseModel):
    tempo_execucao_segundos: float
    resultados: List[MatchmakingResult]

class MatchmakingResponse(BaseModel):
    stemming: MatchmakingMetrics
    lematizacao: MatchmakingMetrics

class GestorRestore(BaseModel):
    email: EmailStr
    novo_nome: str
    nova_senha: str