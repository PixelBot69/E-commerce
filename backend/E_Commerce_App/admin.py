from django.contrib import admin

from .models import Products,Category,Cart,CartItem,Address,Order,OrderItem,WishItem,Wish



class ProductsAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'product_price', 'product_quantity', 'product_description','product_image')
class CategoryAdmin(admin.ModelAdmin):
    list_display=('category_id', 'name')
class CartAdmin(admin.ModelAdmin):
    list_display=('user', 'created_at')

class CartListAdmin(admin.ModelAdmin):
    list_display=('cart', 'product', 'quantity')

class AddressListAdmin(admin.ModelAdmin):
    list_display=('user', 'street', 'city', 'state', 'zip_code')


class OrderListAdmin(admin.ModelAdmin):
    list_display = ( 'user', 'address', 'total_amount','created_at', 'status')

    def get_products(self, obj):
        return ", ".join([product.name for product in obj.products.all()])
    get_products.short_description = 'Products'

admin.site.register(Order, OrderListAdmin)

class OrderItemListAdmin(admin.ModelAdmin):
    list_display=('order','cart_item', 'product', 'quantity', 'price')






admin.site.register(Products, ProductsAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartListAdmin)
admin.site.register(Address, AddressListAdmin)

admin.site.register(OrderItem, OrderItemListAdmin)

from .models import WishItem, Wish

admin.site.register(WishItem)
admin.site.register(Wish)
