from django.db import models

from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.


class Category(models.Model):
    TYPE_CHOICES = [
        ('INCOME','Income'),
        ("EXPENSE",'Expense')
    ]
    name = models.CharField(max_length=50,unique=True)
    type = models.CharField(max_length=7,choices=TYPE_CHOICES)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.type})"
    
class Transaction(models.Model):
    TYPE_CHOICES = [
        ('INCOME','Income'),
        ("EXPENSE",'Expense')
    ]
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    type = models.CharField(max_length=7,choices=TYPE_CHOICES)
    Category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True)
    date = models.DateField(default=timezone.now)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.type}:{self.amount}({self.Category})"
    

