from fastapi import APIRouter

from schemas.auth import LoginRequest, TokenResponse
from services.auth_service import authenticate_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    token = authenticate_user(payload.email, payload.password)
    return TokenResponse(access_token=token)
