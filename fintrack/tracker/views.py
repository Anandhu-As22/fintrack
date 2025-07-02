from django.shortcuts import redirect,render
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from .models import Transaction,Category
from django.db.models import Sum
from .forms import CategoryForm
from django.contrib import messages

# Create your views here.

def home(request):
    if request.user.is_authenticated:
        return redirect('transaction_list')
    return render(request,'tracker/home.html')




def Signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request,user)
            Category.objects.create(user=user, name='Salary', type='INCOME')
            Category.objects.create(user=user, name='Groceries', type='EXPENSE')
            messages.success(request,'account created successfully')
            return redirect('transaction_list')
        else:
            messages.error(request,'please correct the errors below')
    else:

        form = UserCreationForm()            
        
    return render(request,'tracker/signup.html',{'form':form})


@login_required
def category_add(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            if Category.objects.filter(user = request.user,name = form.cleaned_data['name']).exists():
                messages.error(request,'category name already exists')
            else:
                Category.objects.create(
                    user = request.user,
                    name = form.cleaned_data['name'],
                    type = form.cleaned_data['type']
                )
                messages.success(request,'Category added successfully')
                return redirect('transaction_list')
        else:
            messages.error(request,'please correct the errors')
    else:
        form = CategoryForm()
    return render(request,'tracker/category_form.html',{'form':form})







@login_required
def transaction_list(request):
    transactions = Transaction.objects.filter(user = request.user)
    total_income = Transaction.objects.filter(user = request.user,type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = Transaction.objects.filter(user=request.user, type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0
    return render(request,'tracker/transaction_list.html',{'transactions':transactions,'total_income': total_income,
        'total_expense': total_expense,
        'balance': total_income - total_expense})

@login_required
def transaction_add(request):
    if not Category.objects.filter(user=request.user).exists():
        messages.warning(request, 'Please add a category first.')
        return redirect('category_add')
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
            Category = category,
            date = date,
            description =description

        )
        messages.success(request,'transaction added successfully')
        return redirect('transaction_list')
    
    Categories = Category.objects.filter(user = request.user)
    return render(request,'tracker/transaction_form.html',{'categories':Categories})

@login_required
def transaction_delete(request,id):
    try:
        transaction = Transaction.objects.get(id=id, user=request.user)
        transaction.delete()
        messages.success(request, 'Transaction deleted successfully!')
    except Transaction.DoesNotExist:
        messages.error(request, 'Transaction not found.')
    return redirect('transaction_list')


