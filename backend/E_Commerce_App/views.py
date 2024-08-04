from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate

from social_django.utils import psa
from django.contrib.auth import authenticate
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    LoginSerializer, UserSerializer, ProductSerializer, CategorySerializer,
    CartSerializer, CartItemSerializer, AddressSerializer, OrderItemSerializer, OrderSerializer,WishItemSerializer,WishSerializer
)
from .models import Products, Category, Cart, CartItem, Address, OrderItem, Order,Wish,WishItem
import razorpay
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
class ProductView(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class ProductByCategoryView(APIView):
    def get(self, request, category_id):
        products = Products.objects.filter(category_id=category_id)
        if not products:
            return Response({"detail": "No products found for this category."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class VerifyPaymentView(APIView):
    def post(self, request):
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        params_dict = {
            'razorpay_order_id': request.data.get('razorpay_order_id'),
            'razorpay_payment_id': request.data.get('razorpay_payment_id'),
            'razorpay_signature': request.data.get('razorpay_signature')
        }
        try:
            client.utility.verify_payment_signature(params_dict)
            order = Order.objects.get(payment_id=params_dict['razorpay_order_id'])
            order.status = 'Completed'
            order.save()
            return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            logger.error('Payment verification failed: Invalid signature')
            return Response({'status': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            logger.error(f"Order with id {params_dict['razorpay_order_id']} does not exist")
            return Response({'status': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class OrderStatusView(APIView):
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        

    

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        user = request.user
        address_id = request.data.get('address_id')
        total_amount = request.data.get('total_amount')
        cart_items = request.data.get('cart_items')
        payment_method = request.data.get('payment_method', 'COD')  

        if not address_id or not total_amount or not cart_items:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.create(
                user=user,
                address_id=address_id,
                total_amount=total_amount,
                payment_method=payment_method  
            )
            return Response({'order_id': order.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class UserOrdersView(APIView):
        permission_classes = [permissions.IsAuthenticated]
        def get(self, request):
            orders = Order.objects.filter(user=request.user)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.response import Response
from rest_framework import status

class WishItemCreateView(APIView):
    queryset = WishItem.objects.all()
    serializer_class = WishItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishItemDetailView(APIView):
    queryset = WishItem.objects.all()
    serializer_class = WishItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        item = self.get_object()
        serializer = self.serializer_class(item)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        item = self.get_object()
        serializer = self.serializer_class(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.get(username=serializer.validated_data['username'])
        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'user_id': user.id, 'msg': 'Login Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'non_field_errors': ['username or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(viewsets.ReadOnlyModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter