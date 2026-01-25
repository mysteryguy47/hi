"""Authentication and authorization utilities."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

from models import User, get_db

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 days (extended from 7 days for better UX)

security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"✅ [AUTH] Token created for user_id: {data.get('sub')}, expires: {expire}")
    print(f"✅ [AUTH] SECRET_KEY (first 10 chars): {SECRET_KEY[:10] if SECRET_KEY else 'None'}...")
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str = payload.get("sub")
        if user_id_str is None:
            print(f"❌ [AUTH] Token missing 'sub' field. Payload: {payload}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Convert string user_id to int for database lookup
        # JWT 'sub' field must be a string, but we need int for database
        try:
            user_id = int(user_id_str)
        except (ValueError, TypeError):
            print(f"❌ [AUTH] Invalid user_id format in token: {user_id_str} (type: {type(user_id_str)})")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID format in token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        print(f"✅ [AUTH] Token verified for user_id: {user_id}")
        return user_id
    except JWTError as e:
        print(f"❌ [AUTH] JWT decode error: {str(e)}")
        print(f"❌ [AUTH] Token (first 20 chars): {token[:20] if token else 'None'}...")
        print(f"❌ [AUTH] SECRET_KEY (first 10 chars): {SECRET_KEY[:10] if SECRET_KEY else 'None'}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    user_id: int = Depends(verify_token),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    # user_id comes from verify_token which extracts it from JWT sub field
    # Since we store it as string in JWT, we need to convert back to int
    if isinstance(user_id, str):
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token"
            )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user and verify admin role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def verify_google_token(token: str) -> dict:
    """Verify Google OAuth ID token and return user info."""
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests
        
        GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
        if not GOOGLE_CLIENT_ID:
            print("ERROR: GOOGLE_CLIENT_ID not set in environment")
            raise ValueError("GOOGLE_CLIENT_ID not set in environment")
        
        print(f"Verifying token with client ID: {GOOGLE_CLIENT_ID[:20]}...")
        
        # Verify the ID token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), GOOGLE_CLIENT_ID
            )
            print(f"Token verified successfully, issuer: {idinfo.get('iss')}")
        except ValueError as e:
            # Token verification failed
            print(f"Token verification failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(e)}"
            )
        except Exception as e:
            print(f"Unexpected error during token verification: {str(e)}")
            import traceback
            print(traceback.format_exc())
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification error: {str(e)}"
            )
        
        # Verify issuer
        if idinfo.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
            print(f"Wrong issuer: {idinfo.get('iss')}")
            raise ValueError('Wrong issuer.')
        
        # Ensure required fields are present
        if 'sub' not in idinfo or 'email' not in idinfo:
            print(f"Missing required fields. Available: {list(idinfo.keys())}")
            raise ValueError('Missing required token fields.')
        
        user_info = {
            "google_id": idinfo['sub'],
            "email": idinfo['email'],
            "name": idinfo.get('name', idinfo.get('email', '').split('@')[0]),
            "avatar_url": idinfo.get('picture', '')
        }
        print(f"User info extracted: {user_info.get('email')}")
        return user_info
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in verify_google_token: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

