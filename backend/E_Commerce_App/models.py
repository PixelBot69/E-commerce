from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Products(models.Model):
    product_name = models.CharField(max_length=100)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_quantity = models.PositiveIntegerField()
    product_description = models.TextField()
    product_image = models.ImageField(upload_to='products/')
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")

    def __str__(self):
        return self.product_name

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.product.product_name}"



class Wish(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"

class WishItem(models.Model):
    wish = models.ForeignKey(Wish, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE)

    def __str__(self):
        return f"Wish Item {self.id} for Wish {self.wish.id}"

 




class Address(models.Model):
    user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.zip_code}"
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address=models.ForeignKey(Address, on_delete=models.CASCADE)
    total_amount = models.DecimalField(decimal_places=2,max_digits=10)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100, default="Pending")
    payment_method = models.CharField(max_length=20, choices=[('COD', 'Cash on Delivery'), ('RAZORPAY', 'Razorpay')], default='COD')
    

    def __str__(self):
        return f"Order #{self.id} for {self.user.username}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    cart_item=models.ForeignKey(CartItem,on_delete=models.CASCADE)
    product=models.ForeignKey(Products,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return f"{self.quantity} of {self.product.product_name} "