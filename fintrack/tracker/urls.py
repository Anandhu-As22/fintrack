from django.urls import path
from . import views


urlpatterns = [
    path('',views.home,name='home'),
    path('signup/',views.Signup,name='signup'),
    path('transactions/', views.transaction_list, name='transaction_list'),
    path('transactions/add/', views.transaction_add, name='transaction_add'),
    path('transactions/delete/<int:id>/', views.transaction_delete, name='transaction_delete'),
    path('categories/add/', views.category_add, name='category_add')

]