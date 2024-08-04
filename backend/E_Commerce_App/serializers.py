from rest_framework import serializers
from .models import Products, Category, Cart, CartItem, Address, Order, OrderItem,WishItem,Wish
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    def get_product_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.product_image.url)

    class Meta:
        model = Products
        fields = ['id', 'product_name', 'product_price', 'product_quantity', 'product_description', 'product_image']


class WishItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', 
        queryset=Products.objects.all(), 
        write_only=True
    )

    class Meta:
        model = WishItem
        fields = ['id', 'wish', 'product', 'product_id']

    def create(self, validated_data):
        wish = validated_data.get('wish')
        product = validated_data.get('product')
        wish_items = WishItem.objects.filter(wish=wish, product=product)

        if wish_items.exists():
            
            return wish_items.first()
        else:
            
            return WishItem.objects.create(**validated_data)



class WishSerializer(serializers.ModelSerializer):
    items = WishItemSerializer(many=True)

    class Meta:
        model = Wish
        fields = ['id', 'user', 'created_at', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        wish = Wish.objects.create(**validated_data)
        for item_data in items_data:
            
            WishItem.objects.create(wish=wish, **item_data)
        return wish

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
       
        instance.user = validated_data.get('user', instance.user)
        instance.created_at = validated_data.get('created_at', instance.created_at)
        instance.save()

        
        for item_data in items_data:
            item_id = item_data.get('id')
            if item_id:
                item = WishItem.objects.get(id=item_id, wish=instance)
                item.product_id = item_data.get('product_id', item.product_id)
                item.save()
            else:
               
                WishItem.objects.create(wish=instance, **item_data)

        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', 
        queryset=Products.objects.all(), 
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity')

    def create(self, validated_data):
        product = validated_data.get('product')
        cart = validated_data.get('cart')
        quantity = validated_data.get('quantity')
        
        cart_items = CartItem.objects.filter(cart=cart, product=product)

        if cart_items.exists():
            cart_item = cart_items.first()
            cart_item.quantity += quantity
            cart_item.save()
            cart_items.exclude(id=cart_item.id).delete()
        else:
            cart_item = CartItem.objects.create(cart=cart, product=product, quantity=quantity)

        return cart_item

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.save()
        return instance

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'created_at', 'items')

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        cart = Cart.objects.create(**validated_data)
        for item_data in items_data:
            CartItem.objects.create(cart=cart, **item_data)
        return cart

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'address', 'total_amount', 'created_at', 'status', 'items')

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        total_amount = 0
        for item_data in items_data:
            item_price = item_data.get('price')
            quantity = item_data.get('quantity')
            total_amount += item_price * quantity
            OrderItem.objects.create(order=order, **item_data)
        order.total_amount = total_amount
        order.save()
        return order

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
