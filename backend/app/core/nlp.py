import re
import time
import nltk
import spacy
from nltk.corpus import stopwords
from nltk.stem import RSLPStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class NLPProcessor:
    def __init__(self):
        nltk.download('stopwords', quiet=True)
        nltk.download('rslp', quiet=True)
        self.stop_words_pt = set(stopwords.words('portuguese'))
        self.stemmer = RSLPStemmer()

        try:
            self.spacy_nlp = spacy.load("pt_core_news_sm")
        except OSError:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "pt_core_news_sm"])
            self.spacy_nlp = spacy.load("pt_core_news_sm")

    def limpar_texto_stemming(self, texto: str) -> str:
        if not texto:
            return ""
        
        texto = texto.lower()
        texto = re.sub(r'[^\w\s]', '', texto)
        palavras = texto.split()
        
        palavras_limpas = [self.stemmer.stem(p) for p in palavras if p not in self.stop_words_pt]
        return " ".join(palavras_limpas)

    def limpar_texto_lematizacao(self, texto: str) -> str:
        if not texto:
            return ""
        
        texto = texto.lower()
        doc = self.spacy_nlp(texto)
        
        palavras_limpas = [
            token.lemma_ for token in doc 
            if not token.is_stop and not token.is_punct and not token.is_space
        ]
        return " ".join(palavras_limpas)

    def calcular_ranking(self, texto_demanda_limpo: str, textos_portfolios_limpos: list, acervo: list) -> list:
        corpus = [texto_demanda_limpo] + textos_portfolios_limpos
        
        vectorizer = TfidfVectorizer()
        matriz_tfidf = vectorizer.fit_transform(corpus)
        
        vetor_demanda = matriz_tfidf[0]
        vetores_portfolios = matriz_tfidf[1:]
        
        similaridades = cosine_similarity(vetor_demanda, vetores_portfolios).flatten()
        feature_names = vectorizer.get_feature_names_out()
        demanda_array = vetor_demanda.toarray().flatten()
        
        resultados = []
        for i, score in enumerate(similaridades):
            if score > 0:
                portfolio_array = vetores_portfolios[i].toarray().flatten()
                
                intersecao = demanda_array * portfolio_array
                
                top_indices = intersecao.argsort()[::-1]
                
                termos_comuns = []
                for idx in top_indices:
                    if intersecao[idx] > 0:
                        termos_comuns.append(feature_names[idx])
                        if len(termos_comuns) == 5:
                            break

                item_acervo = acervo[i]
                resultados.append({
                    "expertise_id": item_acervo["expertise_id"],
                    "pesquisador_responsavel": item_acervo["pesquisador_responsavel"],
                    "area_conhecimento": item_acervo["area_conhecimento"],
                    "link_lattes": item_acervo.get("link_lattes"),
                    "link_portfolio": item_acervo.get("link_portfolio"),
                    "score": round(float(score), 4),
                    "termos_explicativos": termos_comuns # Adicionando os termos no retorno
                })
                
        resultados.sort(key=lambda x: x["score"], reverse=True)
        return resultados