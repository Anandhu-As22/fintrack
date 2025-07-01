from django.shortcuts import redirect,render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from .models import Transaction,Category

# Create your views here.

def Signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.post)
        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect('transaction_list')
    else:
        form = UserCreationForm()            
        
    return render(request,'tracker/signup.html',{'form':form})




@login_required
def transaction_list(request):
    transactions = Transaction.objects.filter(user = request.user)
    return render(request,'tracker/transaction_list.html',{'transactions':transactions})

@login_required
def transaction_add(request):
    if request.method == 'POST':
        amount = request.POST.get('amount')
        type = request.POST.get('type')
        category_id = request.POST.get('category')
        date = request.POST.get('date')
        description = request.POST.get('description','')
        category = Category.objects.get(id= category_id,user = request.user)
        Transaction.objects.create(
            user = request.user,
            amount = amount,
            type = type,
            category = category,
            date = date,
            description =description

        )
        return redirect('transaction_list')
    Categories = Category.objects.filter(user = request.user)
    return render(request,'tracker/transaction_form.html',{'categories':Categories})

@login_required
def transaction_delete(request,id):
    transaction= Transaction.objects.get(id = id,user = request.user)
    transaction.delete()
    return redirect('transaction_list')


