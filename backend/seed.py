from app.core.database import SessionLocal
from app.core.security import get_password_hash
from sqlalchemy import text

def seed_data():
    db = SessionLocal()
    try:
        print("Iniciando a limpeza do banco de dados...")
        db.execute(text("TRUNCATE TABLE portfolio_expertise, expertise, demanda, ator RESTART IDENTITY CASCADE"))
        
        # ==========================================
        # GESTOR
        # ==========================================
        senha_hash = get_password_hash("admin123")
        db.execute(
            text("""
            INSERT INTO gestor (nome, email, senha_hash, is_master, primeiro_login) 
            VALUES (:nome, :email, :senha, :is_master, false) 
            ON CONFLICT (email) DO NOTHING
            """),
            {
                "nome": "Gestor de Inovação (Master SEED)", 
                "email": "admin@prefeitura.gov.br", 
                "senha": senha_hash, 
                "is_master": True
            }
        )
        
        # ==========================================
        # ATORES (Tríplice Hélice)
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
            {"nome": "Departamento de Estradas (DER)", "tipo": "GOVERNO"},
            
            # --- Adicionados para a Banca do TCC ---
            {"nome": "Instituto Federal de São Paulo (IFSP)", "tipo": "UNIVERSIDADE"},
            {"nome": "Prefeitura Municipal (Gabinete de Inovação)", "tipo": "GOVERNO"},
            {"nome": "Cooperativa Agrícola e Sustentabilidade", "tipo": "INDUSTRIA"}
        ]
        
        atores_ids = {}
        for ator in atores_in:
            res = db.execute(
                text("INSERT INTO ator (nome, tipo_helice) VALUES (:nome, :tipo) RETURNING id"),
                {"nome": ator["nome"], "tipo": ator["tipo"]}
            ).fetchone()
            atores_ids[ator["nome"]] = res[0]

        # ==========================================
        # DEMANDAS (Exclusivamente Indústria e Governo)
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
            },
            {
                "tit": "Plataforma de Inteligência para Corretagem Digital de Inovação no Setor Público",
                "desc": "A prefeitura municipal enfrenta uma grave paralisia da inovação e forte assimetria de informações na prospecção tecnológica de parceiros. Precisamos superar a dificuldade técnica de unir o poder público às universidades. Buscamos o desenvolvimento de um sistema de informação voltado para o matchmaking inteligente, atuando como um corretor digital de inovação. A solução deve focar na correlação semântica de textos por meio de Processamento de Linguagem Natural (NLP), idealmente utilizando modelo espaço-vetorial e similaridade de cosseno, integrados em uma arquitetura API-First. O objetivo é fomentar a Tríplice Hélice municipal e otimizar a alocação de recursos públicos com base científica.",
                "ator": "Prefeitura Municipal (Gabinete de Inovação)", "area": "1.03.00.00-7"
            },
            {
                "tit": "Monitoramento IoT de Baixo Custo para Agricultura Sustentável e Mitigação de Gases",
                "desc": "Nossa cooperativa busca inovações voltadas à agenda climática e ao pequeno produtor rural. O desafio é desenvolver uma rede baseada em Internet das Coisas (IoT) de baixo custo, utilizando microcontroladores acessíveis (como o ESP32). O sistema deve ser capaz de realizar o monitoramento ambiental de estufas (sensores de umidade do solo e do ar, como DHT11 e capacitivos) para automatizar a irrigação e gerar economia de água em cultivos exigentes. Adicionalmente, busca-se adaptar a mesma plataforma tecnológica para realizar o diagnóstico de gases em resíduos orgânicos, detectando metano (CH4) para validar processos de compostagem e evitar emissões prejudiciais à saúde climática.",
                "ator": "Cooperativa Agrícola e Sustentabilidade", "area": "1.03.00.00-7"
            }
        ]

        for dem in demandas_in:
            db.execute(
                text("INSERT INTO demanda (titulo, descricao, ator_id, area_cnpq) VALUES (:tit, :desc, :ator, :area)"),
                {"tit": dem["tit"], "desc": dem["desc"], "ator": atores_ids[dem["ator"]], "area": dem["area"]}
            )

        # ==========================================
        # EXPERTISES E PORTFÓLIOS (Exclusivamente Universidades)
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
            },
            
            {
                "area": "Sistemas de Informação", "cnpq": "1.03.00.00-7", 
                "pesq": "Marcelo Augusto Godoi Gallo", "ator": "Instituto Federal de São Paulo (IFSP)",
                "lattes": "https://lattes.cnpq.br/7284748863164123",
                "portfolios": [
                    {
                        "tipo": "ARTIGO", 
                        "tit": "MATCHMAKING SEMÂNTICO COMO SOLUÇÃO PARA A ASSIMETRIA DE INFORMAÇÃO NA TRÍPLICE HÉLICE MUNICIPAL", 
                        "ano": 2026, 
                        "res": "O Brasil vem enfrentando nos últimos anos um cenário caracterizado por uma Crise Fiscal Municipal que intensificou-se no último ano, sendo agravado por um engessamento da gestão pública que vai além da questão financeira, resultando na Paralisia da Inovação no setor público. Embora o modelo da Tríplice Hélice proponha a integração entre Universidade, Indústria e Governo como caminho para o desenvolvimento local, a execução prática dessa colaboração esbarra na assimetria de informações e na dificuldade de prospecção tecnológica. Neste sentido, o presente trabalho de pesquisa projeta e desenvolve um sistema de informação responsável de matchmaking fundamentado em Processamento de Linguagem Natural (NLP) para atuar como um corretor digital de inovação. Através da construção de uma prova de conceito (PoC) baseada em uma arquitetura API-First, o sistema automatiza a correlação semântica entre demandas governamentais ou industriais e os portfólios de pesquisadores acadêmicos, utilizado o modelo espaço-vetorial e o cálculo de Similaridade de Cosseno. A principal contribuição do trabalho é a otimização da prospecção de parcerias estratégicas, estruturando os meios para obter expertises com elevado grau de compatibilidade com as demandas da comunidade municipal. Isto demonstra como a tecnologia da informação transcende a função técnica e atua como agente de inteligência, facilitando novos pactos de confiança entre Estado e sociedade civil e fomentando a inovação com eficiência na alocação de recursos."
                    },
                    {
                        "tipo": "ARTIGO", 
                        "tit": "DESENVOLVIMENTO DE UMA PLATAFORMA IOT PARA O MONITORAMENTO E DIAGNÓSTICO DE PROCESSOS DE COMPOSTAGEM NO CONTEXTO DA AGENDA CLIMÁTICA", 
                        "ano": 2025, 
                        "res": "A compostagem é uma estratégia eficaz para a gestão de resíduos orgânicos, mas processos mal gerenciados podem se tornar anaeróbicos e emitir metano (CH4), um potente gás de efeito estufa. Em um momento em que o Brasil se prepara para sediar a COP30, a busca por soluções tecnológicas para a agenda climática se intensifica. Este trabalho apresenta o desenvolvimento de uma plataforma IoT de baixo custo, projetada para atuar como uma ferramenta de diagnóstico para a qualidade de processos de compostagem. O sistema, baseado no microcontrolador ESP32 e no sensor de gás MQ-4, monitora as emissões para fornecer um feedback sobre a \"saúde\" da composteira. Nos testes iniciais, os níveis de CH4 detectados foram consistentemente baixos, validando a eficiência aeróbica do processo e a capacidade do protótipo de funcionar como um indicador de qualidade. Conclui-se que a plataforma é uma solução viável e alinhada aos esforços de inovação para a mitigação das mudanças climáticas."
                    },
                    {
                        "tipo": "PROJETO", 
                        "tit": "AUTOMAÇÃO DE UMA ESTUFA PARA PRODUÇÃO DE BAUNILHA", 
                        "ano": 2024, 
                        "res": "Este trabalho apresenta um projeto de baixo custo destinado a pequenos produtores agrícolas, visando proporcionar acesso a um investimento de longo prazo no cultivo da baunilha (Vanilla Planifolia). O foco é a automatização da irrigação em uma estufa utilizando conceitos de Internet das Coisas (IoT). O sistema utiliza o microcontrolador ESP32 em conjunto com sensores capacitivos para medir a umidade do solo e sensores DHT11 para quantificar a umidade do ar, fatores essenciais para o cultivo da baunilha. A automação permite economia de água e oferece maior liberdade ao produtor rural, eliminando a necessidade de vigilância constante. O estudo adapta tecnologias usadas no setor residencial para o ambiente agrícola, criando alternativas acessíveis para pequenos agricultores."
                    }
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