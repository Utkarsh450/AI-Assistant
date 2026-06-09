def authenticate_user(email: str, password: str) -> str:
    if not email or not password:
        raise ValueError("Email and password are required.")

    return "demo-token"
