from app.core.database import SessionLocal
from app.core.security import get_password_hash
from sqlalchemy import text

def seed_data():
    db = SessionLocal()
    try:
        print("Iniciando a limpeza do banco de dados...")
        db.execute(text("TRUNCATE TABLE portfolio_expertise, expertise, demanda, ator RESTART IDENTITY CASCADE"))
        
        # ==========================================
        # 1. GESTOR
        # ==========================================
        senha_hash = get_password_hash("admin123")
        db.execute(
            text("""
            INSERT INTO gestor (nome, email, senha_hash) 
            VALUES (:nome, :email, :senha) 
            ON CONFLICT (email) DO NOTHING
            """),
            {"nome": "Gestor de Inovação", "email": "admin@prefeitura.gov.br", "senha": senha_hash}
        )

        # ==========================================
        # 2. ATORES (Tríplice Hélice)
        # ==========================================
        atores_in = [
            {"nome": "Universidade Estadual", "tipo": "UNIVERSIDADE"},
            {"nome": "Instituto Federal de Tecnologia", "tipo": "UNIVERSIDADE"},
            {"nome": "Universidade Federal de Ciências", "tipo": "UNIVERSIDADE"},
            
            {"nome": "TechMotors S.A.", "tipo": "INDUSTRIA"},
            {"nome": "AgroTech Brasil", "tipo": "INDUSTRIA"},
            {"nome": "BioFarma Labs", "tipo": "INDUSTRIA"},
            
            {"nome": "Prefeitura de Tanabi", "tipo": "GOVERNO"},
            {"nome": "Ministério da Saúde", "tipo": "GOVERNO"},
            {"nome": "Departamento de Estradas (DER)", "tipo": "GOVERNO"}
        ]
        
        atores_ids = {}
        for ator in atores_in:
            res = db.execute(
                text("INSERT INTO ator (nome, tipo_helice) VALUES (:nome, :tipo) RETURNING id"),
                {"nome": ator["nome"], "tipo": ator["tipo"]}
            ).fetchone()
            atores_ids[ator["nome"]] = res[0]

        # ==========================================
        # 3. DEMANDAS (Exclusivamente Indústria e Governo)
        # ==========================================
        demandas_in = [
            {
                "tit": "Dissipação de calor em rotores elétricos",
                "desc": "Necessitamos de uma solução inovadora para otimizar a dissipação de calor em rotores de motores elétricos automotivos, utilizando novos materiais cerâmicos e compósitos de alta condutividade térmica que suportem altas rotações.",
                "ator": "TechMotors S.A.", "area": "3.04.00.00-7"
            },
            {
                "tit": "Otimização de baterias de estado sólido",
                "desc": "Buscamos pesquisas voltadas ao aumento da densidade energética e vida útil de baterias de estado sólido aplicadas a veículos elétricos de grande porte.",
                "ator": "TechMotors S.A.", "area": "3.04.04.00-2"
            },
            {
                "tit": "Sistema de Gestão de Tráfego Inteligente",
                "desc": "Buscamos um algoritmo de inteligência artificial ou IoT para sincronização de semáforos, visão computacional e otimização do fluxo de veículos em vias urbanas de cidades inteligentes.",
                "ator": "Prefeitura de Tanabi", "area": "1.03.00.00-7"
            },
            {
                "tit": "Previsão de degradação asfáltica",
                "desc": "Necessidade de modelos preditivos usando machine learning e dados climáticos para prever buracos, rachaduras e desgaste prematuro em rodovias estaduais.",
                "ator": "Departamento de Estradas (DER)", "area": "3.01.00.00-3"
            },
            {
                "tit": "Mapeamento genético para resistência à seca",
                "desc": "Oportunidade para desenvolver sementes de soja e milho geneticamente modificadas que suportem longos períodos de estiagem no cerrado brasileiro.",
                "ator": "AgroTech Brasil", "area": "5.01.00.00-9"
            },
            {
                "tit": "Estabilização de princípios ativos amazônicos",
                "desc": "Precisamos de técnicas farmacológicas avançadas para estabilizar moléculas bioativas extraídas da flora amazônica para produção de cosméticos antienvelhecimento.",
                "ator": "BioFarma Labs", "area": "4.03.00.00-5"
            },
            {
                "tit": "Plataforma de monitoramento epidemiológico",
                "desc": "Precisamos de um sistema inteligente para prever surtos de doenças e analisar a eficácia de tratamentos usando mineração de dados (data mining) aplicados em registros e prontuários de hospitais regionais.",
                "ator": "Ministério da Saúde", "area": "4.06.00.00-9"
            }
        ]

        for dem in demandas_in:
            db.execute(
                text("INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) VALUES (:tit, :desc, :ator, :area)"),
                {"tit": dem["tit"], "desc": dem["desc"], "ator": atores_ids[dem["ator"]], "area": dem["area"]}
            )

        # ==========================================
        # 4. EXPERTISES E PORTFÓLIOS (Exclusivamente Universidades)
        # ==========================================
        expertises_in = [
            {
                "area": "Engenharia de Materiais", "cnpq": "3.03.00.00-2", 
                "pesq": "Dr. Roberto Silva", "ator": "Universidade Estadual",
                "lattes": "http://lattes.cnpq.br/1111111111111111",
                "portfolios": [
                    {"tipo": "ARTIGO", "tit": "Materiais Cerâmicos em Sistemas Elétricos", "ano": 2023, "res": "Este artigo investiga o uso de compostos cerâmicos avançados e compósitos para o controle de temperatura e dissipação de calor em rotores de motores elétricos de alta performance automotiva."},
                    {"tipo": "PATENTE", "tit": "Revestimento Térmico para Rotores", "ano": 2021, "res": "Patente de um novo revestimento à base de polímeros termo-condutivos para proteção contra superaquecimento em componentes mecânicos e elétricos sob alto estresse térmico."}
                ]
            },
            {
                "area": "Ciência da Computação", "cnpq": "1.03.00.00-7", 
                "pesq": "Dra. Ana Souza", "ator": "Instituto Federal de Tecnologia",
                "lattes": "http://lattes.cnpq.br/2222222222222222",
                "portfolios": [
                    {"tipo": "ARTIGO", "tit": "IoT aplicado à mobilidade urbana", "ano": 2024, "res": "Apresenta um modelo de sincronização semafórica baseada em redes de sensores IoT e algoritmos de visão computacional para otimizar o fluxo de tráfego urbano inteligente."},
                    {"tipo": "TESE", "tit": "Machine Learning na manutenção de infraestrutura", "ano": 2022, "res": "Estudo profundo sobre modelos preditivos e inteligência artificial para detecção e previsão de anomalias em asfaltos, ruas e rodovias usando processamento de imagens."}
                ]
            },
            {
                "area": "Farmacologia e Bioquímica", "cnpq": "4.03.00.00-5", 
                "pesq": "Dra. Helena Oliveira", "ator": "Universidade Federal de Ciências",
                "lattes": "http://lattes.cnpq.br/3333333333333333",
                "portfolios": [
                    {"tipo": "PROJETO", "tit": "Extração de bioativos de plantas da Amazônia", "ano": 2023, "res": "Projeto financiado pela FAPESP focado na extração sustentável, isolamento e estabilização de moléculas antioxidantes de plantas amazônicas com potencial cosmético."},
                    {"tipo": "ARTIGO", "tit": "Estabilidade de emulsões com princípios ativos naturais", "ano": 2022, "res": "Avaliação química da estabilidade e degradação térmica de cremes e loções baseados em flora tropical nativa."}
                ]
            },
            {
                "area": "Ciências Agrárias e Dados", "cnpq": "5.01.00.00-9", 
                "pesq": "Dr. Carlos Mendes", "ator": "Universidade Estadual",
                "lattes": "http://lattes.cnpq.br/4444444444444444",
                "portfolios": [
                    {"tipo": "TESE", "tit": "Melhoramento genético e resistência da soja", "ano": 2021, "res": "Estudo sobre a resistência da soja e do milho à seca através do cruzamento seletivo e mapeamento genético."},
                    {"tipo": "ARTIGO", "tit": "Data Mining em Registros Médicos", "ano": 2020, "res": "Aplicação de mineração de dados (data mining) para encontrar padrões de eficácia em prontuários eletrônicos de hospitais regionais."},
                    {"tipo": "PROJETO", "tit": "Automação com Drones na Pulverização", "ano": 2023, "res": "Desenvolvimento de rotas automatizadas para drones aplicarem pesticidas com base em coordenadas GPS."}
                ]
            },
            {
                "area": "Física Aplicada", "cnpq": "1.05.00.00-6", 
                "pesq": "Dr. Fernando Costa", "ator": "Instituto Federal de Tecnologia",
                "lattes": "http://lattes.cnpq.br/5555555555555555",
                "portfolios": [
                    {"tipo": "ARTIGO", "tit": "Síntese avançada de nanoestruturas de Grafeno", "ano": 2024, "res": "Método laboratorial de baixo custo para criar folhas de grafeno monocamada com alta pureza para aplicações eletrônicas."},
                    {"tipo": "ARTIGO", "tit": "Dinâmica de fluidos em turbinas eólicas", "ano": 2019, "res": "Análise aerodinâmica das pás de turbinas eólicas para maximizar a conversão de energia cinética em regiões de baixo vento."},
                    {"tipo": "TESE", "tit": "Eletrólitos sólidos para veículos elétricos", "ano": 2023, "res": "Investigação sobre a densidade energética, segurança contra incêndios e longevidade de baterias de estado sólido (solid-state) para o setor automotivo."}
                ]
            }
        ]

        for exp in expertises_in:
            res_exp = db.execute(
                text("INSERT INTO expertise (area_conhecimento, area_cnpq, pesquisador_responsavel, link_lattes, ator_id) VALUES (:area, :cnpq, :pesq, :lattes, :ator) RETURNING id"),
                {"area": exp["area"], "cnpq": exp["cnpq"], "pesq": exp["pesq"], "lattes": exp["lattes"], "ator": atores_ids[exp["ator"]]}
            ).fetchone()
            
            exp_id = res_exp[0]
            
            for port in exp["portfolios"]:
                db.execute(
                    text("INSERT INTO portfolio_expertise (expertise_id, tipo, titulo, ano_publicacao, resumo) VALUES (:exp_id, :tipo, :tit, :ano, :res)"),
                    {"exp_id": exp_id, "tipo": port["tipo"], "tit": port["tit"], "ano": port["ano"], "res": port["res"]}
                )

        db.commit()
        print("Ecossistema populado com sucesso! Muitas conexões prontas para o Matchmaking.")
    except Exception as e:
        db.rollback()
        print(f"Erro ao executar seed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()