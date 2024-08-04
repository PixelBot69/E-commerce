from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from E_Commerce_App import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Product', views.ProductView, basename='Product')
router.register(r'categories', views.CategoryViewSet, basename='Category')
router.register(r'details', views.ProductDetailView, basename='ProductDetail')
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'cart-items', views.CartItemViewSet, basename='cart-items')
router.register(r'addresses', views.AddressViewSet, basename='address')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/categories/<int:category_id>/products/', views.ProductByCategoryView.as_view()),
    path('api/create-order/', views.CreateOrderView.as_view(), name='create-order'),
    path('api/order-status/<int:order_id>/', views.OrderStatusView.as_view(), name='order-status'),
    path('api/orders/',views.UserOrdersView.as_view(),name='orders'),
    path('api/auth/google/', views.GoogleLogin.as_view(), name='google_login'),

    path('api/wish-items/', views.WishItemCreateView.as_view(), name='wish-item-create'),
    path('api/wish-items/<int:pk>/', views.WishItemDetailView.as_view(), name='wish-item-detail'),

    path('api/verify-payment/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
