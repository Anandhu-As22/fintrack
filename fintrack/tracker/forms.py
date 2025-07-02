from django import forms
from .models import Category

class CategoryForm(forms.Form):
    name = forms.CharField(max_length=50, required=True)
    type = forms.ChoiceField(choices=Category.TYPE_CHOICES, required=True)

