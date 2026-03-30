import time
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.nlp import NLPProcessor

class MatchmakingModel:
    def __init__(self, db: Session, nlp_processor: NLPProcessor):
        self.db = db
        self.nlp = nlp_processor

    def gerar_ranking(self, demanda_id: int):
        demanda = self._buscar_textos_demanda(demanda_id)
        if not demanda:
            raise ValueError("Demanda não encontrada ou inativa.")
            
        texto_demanda = f"{demanda['titulo']} {demanda['descricao']} {demanda['area_cnpq']}"
        
        acervo_bruto = self._buscar_expertises_portfolios()
        if not acervo_bruto:
            raise ValueError("Nenhum portfólio ativo encontrado no ecossistema.")
            
        pesquisadores_agrupados = {}
        for item in acervo_bruto:
            exp_id = item["expertise_id"]
            texto_item = f"{item['area_conhecimento']} {item['portfolio_titulo']} {item['resumo']}"
            
            if exp_id not in pesquisadores_agrupados:
                pesquisadores_agrupados[exp_id] = dict(item) 
                pesquisadores_agrupados[exp_id]["texto_unificado"] = texto_item
            else:
                pesquisadores_agrupados[exp_id]["texto_unificado"] += f" {texto_item}"
                
        acervo_processado = list(pesquisadores_agrupados.values())
        textos_portfolios = [pesquisador["texto_unificado"] for pesquisador in acervo_processado]
        
        # ==========================================
        # Pipeline com STEMMING (NLTK)
        # ==========================================
        start_stem = time.time()
        texto_demanda_stem = self.nlp.limpar_texto_stemming(texto_demanda)
        textos_portfolios_stem = [self.nlp.limpar_texto_stemming(t) for t in textos_portfolios]
        ranking_stem = self.nlp.calcular_ranking(texto_demanda_stem, textos_portfolios_stem, acervo_processado)
        tempo_stem = round(time.time() - start_stem, 4)

        # ==========================================
        # Pipeline com LEMATIZAÇÃO (SpaCy)
        # ==========================================
        start_lem = time.time()
        texto_demanda_lem = self.nlp.limpar_texto_lematizacao(texto_demanda)
        textos_portfolios_lem = [self.nlp.limpar_texto_lematizacao(t) for t in textos_portfolios]
        ranking_lem = self.nlp.calcular_ranking(texto_demanda_lem, textos_portfolios_lem, acervo_processado)
        tempo_lem = round(time.time() - start_lem, 4)

        return {
            "stemming": {
                "tempo_execucao_segundos": tempo_stem,
                "resultados": ranking_stem
            },
            "lematizacao": {
                "tempo_execucao_segundos": tempo_lem,
                "resultados": ranking_lem
            }
        }

    def _buscar_textos_demanda(self, demanda_id: int):
        query = text("""
            SELECT titulo, descricao, area_cnpq 
            FROM demanda 
            WHERE id = :id AND is_deleted = false
        """)
        result = self.db.execute(query, {"id": demanda_id}).fetchone()
        return dict(result._mapping) if result else None

    def _buscar_expertises_portfolios(self):
        query = text("""
            SELECT 
                e.id AS expertise_id, 
                e.pesquisador_responsavel, 
                e.area_conhecimento, 
                e.link_lattes,
                p.titulo AS portfolio_titulo, 
                p.resumo 
            FROM expertise e 
            JOIN portfolio_expertise p ON e.id = p.expertise_id 
            WHERE e.is_deleted = false AND p.is_deleted = false
        """)
        results = self.db.execute(query).fetchall()
        return [dict(row._mapping) for row in results]