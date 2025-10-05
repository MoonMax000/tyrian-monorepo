from django.urls import path # type: ignore
from .views import (
    ValidateCredentialsView,
    RegisterView,
    LoginView,
    MeView,
    UserByEmailView,
    DeleteProfileVerificationRequestView,
    DeleteProfileVerificationConfirmView,
    RestoreProfileView,
    # EmailVerificationRequestView,
    EmailVerificationConfirmView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PasswordChangeView,
    LogoutView,
    FullLogoutView,
    Login2FAView,
    CsrfTokenView,
    ProfileVerificationRequestView,
    ProfileVerificationConfirmView,
    ProfileUpdateView,
    MyRevenueView,
    MyWithdrawsPurchasesView,
    AIAssistantPurchasesView,
    UserRoleListView,
    UserSessionsListView,
    UserSessionDetailView,
    UserSessionDeleteView,
    BulkSessionDeleteView,
    GoogleOAuthInitView,
    GoogleOAuthCallbackView,
    GoogleOAuthLoginDirectView,
)
from accounts.views.user import UserIdByEmailView
from accounts.views.sector import SectorListView
from accounts.views.email_change import (
    ChangeEmailVerificationRequestView,
    EmailChangeConfirmView,
    EmailChangeView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/2fa/', Login2FAView.as_view(), name='login-2fa'),
    path('validate-credentials/', ValidateCredentialsView.as_view(), name='validate-credentials'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout/all/', FullLogoutView.as_view(), name='logout-all'),
    path('me/', MeView.as_view(), name='me'),
    path('user/by-email/', UserByEmailView.as_view(), name='user-by-email'),
    path('user/id-by-email/', UserIdByEmailView.as_view(), name='user-id-by-email'),
    path('csrf-token/', CsrfTokenView.as_view(), name='csrf-token'),
    # path('verify-email/', EmailVerificationRequestView.as_view(), name='verify-email'),
    path('verify-email/confirm/', EmailVerificationConfirmView.as_view(), name='verify-email-confirm'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    
    # Profile routes
    path('profile/verification/', ProfileVerificationRequestView.as_view(), name='profile-verification-request'),
    path('profile/verification/confirm/', ProfileVerificationConfirmView.as_view(), name='profile-verification-confirm'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('profile/delete/verification/', DeleteProfileVerificationRequestView.as_view(), name='profile-delete-verification-request'),
    path('profile/delete/confirm/', DeleteProfileVerificationConfirmView.as_view(), name='profile-delete-verification-confirm'),
    path('profile/restore/', RestoreProfileView.as_view(), name='profile-restore'),
    
    # Email change routes
    path('profile/email-change/verification/', ChangeEmailVerificationRequestView.as_view(), name='email-change-verification-request'),
    path('profile/email-change/confirm/', EmailChangeConfirmView.as_view(), name='email-change-confirm'),
    path('profile/email-change/', EmailChangeView.as_view(), name='email-change'),

    # Extra views
    path('profile/extra/my-revenue', MyRevenueView.as_view(), name='profile-extra-my-revenue'),
    path('profile/extra/my-widthraws-purchases', MyWithdrawsPurchasesView.as_view(), name='profile-extra-my-widthraws-purchases'),
    path('profile/extra/ai-assistant-purchases', AIAssistantPurchasesView.as_view(), name='profile-extra-ai-assistant-purchases'),
    
    # User roles
    path('user-roles/', UserRoleListView.as_view(), name='user-roles-list'),
    
    # Sectors
    path('sectors/', SectorListView.as_view(), name='sectors-list'),
    
    # User sessions
    path('sessions/', UserSessionsListView.as_view(), name='user-sessions-list'),
    path('sessions/<int:session_id>/', UserSessionDetailView.as_view(), name='user-session-detail'),
    path('sessions/<int:session_id>/delete/', UserSessionDeleteView.as_view(), name='user-session-delete'),
    path('sessions/bulk-delete/', BulkSessionDeleteView.as_view(), name='user-sessions-bulk-delete'),
    
    # Google OAuth
    path('google/', GoogleOAuthInitView.as_view(), name='google-oauth-init'),
    path('google/callback/', GoogleOAuthCallbackView.as_view(), name='google-oauth-callback'),
    path('google/login/', GoogleOAuthLoginDirectView.as_view(), name='google-oauth-login'),
]
