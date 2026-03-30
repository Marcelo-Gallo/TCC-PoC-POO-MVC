from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import dto
from app.models.matchmaking_model import MatchmakingModel
from app.core.nlp import NLPProcessor
from app.core.security import get_current_user

matchmaking_controller = APIRouter(tags=["Matchmaking"])

def get_nlp_processor() -> NLPProcessor:
    return NLPProcessor()

def get_matchmaking_model(
    db: Session = Depends(get_db), 
    nlp: NLPProcessor = Depends(get_nlp_processor)
) -> MatchmakingModel:
    return MatchmakingModel(db, nlp)

@matchmaking_controller.get("/demandas/{demanda_id}/matchmaking", response_model=dto.MatchmakingResponse)
def gerar_matchmaking(
    demanda_id: int, 
    model: MatchmakingModel = Depends(get_matchmaking_model), 
    current_user: str = Depends(get_current_user)
):
    try:
        return model.gerar_ranking(demanda_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))