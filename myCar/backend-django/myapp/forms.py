from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import Record,Car,Transaction, Payment, CarMaintenance, MaintenanceTask
from django.core.exceptions import ValidationError
from datetime import timedelta


class SignUpForm(UserCreationForm):
	email = forms.EmailField(label="", widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'Email Address'}))
	first_name = forms.CharField(label="", max_length=100, widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'First Name'}))
	last_name = forms.CharField(label="", max_length=100, widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'Last Name'}))


	class Meta:
		model = User
		fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')


	def __init__(self, *args, **kwargs):
		super(SignUpForm, self).__init__(*args, **kwargs)

		self.fields['username'].widget.attrs['class'] = 'form-control'
		self.fields['username'].widget.attrs['placeholder'] = 'User Name'
		self.fields['username'].label = ''
		self.fields['username'].help_text = '<span class="form-text text-muted"><small>Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</small></span>'

		self.fields['password1'].widget.attrs['class'] = 'form-control'
		self.fields['password1'].widget.attrs['placeholder'] = 'Password'
		self.fields['password1'].label = ''
		self.fields['password1'].help_text = '<ul class="form-text text-muted small"><li>Your password can\'t be too similar to your other personal information.</li><li>Your password must contain at least 8 characters.</li><li>Your password can\'t be a commonly used password.</li><li>Your password can\'t be entirely numeric.</li></ul>'

		self.fields['password2'].widget.attrs['class'] = 'form-control'
		self.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
		self.fields['password2'].label = ''
		self.fields['password2'].help_text = '<span class="form-text text-muted"><small>Enter the same password as before, for verification.</small></span>'	

# Create Add Employee Form
class AddRecordForm(forms.ModelForm):
	first_name = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"First Name", "class":"form-control"}), label="")
	last_name = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Last Name", "class":"form-control"}), label="")
	email = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Email", "class":"form-control"}), label="")
	phone = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Phone", "class":"form-control"}), label="")
	address = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Address", "class":"form-control"}), label="")
	city = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"City", "class":"form-control"}), label="")
	state = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"State", "class":"form-control"}), label="")
	zipcode = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Zipcode", "class":"form-control"}), label="")

	class Meta:
		model = Record
		exclude = ("user",)

# Create Add Car Form
class AddCarForm(forms.ModelForm):
    make = forms.CharField(
        required=False,
        widget=forms.widgets.TextInput(attrs={"placeholder": "Car Make", "class": "form-control"}),
        label="Car Make"
    )
    model = forms.CharField(
        required=True,
        widget=forms.widgets.TextInput(attrs={"placeholder": "Car Model", "class": "form-control"}),
        label="Car Model"
    )
    year = forms.IntegerField(
        required=True,
        widget=forms.widgets.NumberInput(attrs={"placeholder": "Year of Manufacture", "class": "form-control"}),
        label="Year of Manufacture"
    )
    vin = forms.CharField(
        required=True,
        widget=forms.widgets.TextInput(attrs={"placeholder": "VIN", "class": "form-control"}),
        label="Vehicle Identification Number (VIN)"
    )
    color = forms.CharField(
        required=True,
        widget=forms.widgets.TextInput(attrs={"placeholder": "Car Color", "class": "form-control"}),
        label="Car Color"
    )
    license_plate = forms.CharField(
        required=False,
        widget=forms.widgets.TextInput(attrs={"placeholder": "License Plate", "class": "form-control"}),
        label="License Plate"
    )
    mileage = forms.IntegerField(
        required=True,
        widget=forms.widgets.NumberInput(attrs={"placeholder": "Mileage (in miles)", "class": "form-control"}),
        label="Mileage"
    )
    fuel_type = forms.ChoiceField(
        required=True,
        choices=[('gas', 'Gasoline'), ('diesel', 'Diesel'), ('electric', 'Electric'), ('hybrid', 'Hybrid')],
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Fuel Type"
    )
    image_upload = forms.ImageField(required=False)
    delete_image = forms.BooleanField(required=False, label="Delete current image")


    class Meta:
        model = Car  # Ensure you have a Car model in your models.py
        # exclude = ("user", "maintenance_tasks", "image_data")  # If you don't want to include a user field
        exclude = ("user", "maintenance_tasks")  # If you don't want to include a user field
		
    def save(self, commit=True):
        instance = super().save(commit=False)

        if self.cleaned_data.get('delete_image'):
            instance.image_data = None
        else:
            image_file = self.cleaned_data.get('image_upload')
            if image_file:
                instance.image_data = image_file.read()

        if commit:
            instance.save()
        return instance

    # def save(self, commit=True):
    #     instance = super().save(commit=False)
    #     image_file = self.cleaned_data.get('image_upload')
    #     if image_file:
    #         instance.image_data = image_file.read()
    #     if commit:
    #         instance.save()
    #     return instance

class TransactionForm(forms.ModelForm):
    rental_start_date = forms.DateTimeField(
        widget=forms.widgets.DateTimeInput(attrs={"class": "form-control", "placeholder": "Rental Start Date", "type": "datetime-local"}),
        label="Rental Start Date"
    )
    rental_end_date = forms.DateTimeField(
        widget=forms.widgets.DateTimeInput(attrs={"class": "form-control", "placeholder": "Rental End Date", "type": "datetime-local"}),
        label="Rental End Date"
    )
    rental_price = forms.DecimalField(
        required=True,
        widget=forms.widgets.NumberInput(attrs={"class": "form-control", "placeholder": "Rental Price (USD)"}),
        label="Rental Price"
    )
    status = forms.ChoiceField(
        required=True,
        choices=[('ongoing', 'Ongoing'), ('completed', 'Completed'), ('canceled', 'Canceled')],
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Status"
    )
    payment_status = forms.ChoiceField(
        required=True,
        choices=[('unpaid', 'Unpaid'), ('paid', 'Paid'), ('pending', 'Pending')],
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Payment Status"
    )

    car = forms.ModelChoiceField(
        queryset=Car.objects.all(),
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Car"
    )

    customer = forms.ModelChoiceField(
        queryset=Record.objects.all(),
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Customer"
    )

    class Meta:
        model = Transaction
        fields = ['car', 'customer', 'rental_start_date', 'rental_end_date', 'rental_price', 'status', 'payment_status']
		
    def clean(self):
        cleaned_data = super().clean()
        car = cleaned_data.get('car')
        start_date = cleaned_data.get('rental_start_date')
        end_date = cleaned_data.get('rental_end_date')
        price = cleaned_data.get('rental_price')

        if start_date and end_date:
            if end_date < start_date:
                raise ValidationError("Rental end date must be after start date.") 
            if car:
                overlapping_transactions = Transaction.objects.filter(
                car=car,
                rental_start_date__lt=end_date,
                rental_end_date__gt=start_date
            )
                if self.instance.pk:
                    overlapping_transactions = overlapping_transactions.exclude(pk=self.instance.pk)

                if overlapping_transactions.exists():
                    raise ValidationError("This car is already rented in the selected date range.")
                
                # date_range = [start_date.date() + timedelta(days=i) for i in range((end_date.date() - start_date.date()).days + 1)]
                # maintenance_conflict = car.maintenance_tasks.filter(
                #     carmaintenance__performed_at__date__in=date_range
                # ).exists()


                # Check maintenance dates
                # maintenance_conflict = car.maintenance_tasks.filter(
                #     performed_at__date__in=date_range
                # ).exists()

                # if maintenance_conflict:
                #     raise ValidationError("This car is scheduled for maintenance during the selected rental period.")

        if price is not None and price < 0:
            raise ValidationError("Rental price must be positive.")


    # def clean(self):
    #     cleaned_data = super().clean()
    #     car = cleaned_data.get('car')
    #     start_date = cleaned_data.get('rental_start_date')
    #     end_date = cleaned_data.get('rental_end_date')
    #     price = cleaned_data.get('rental_price')

    #     if start_date and end_date and car:
    #         overlapping_transactions = Transaction.objects.filter(
    #             car=car,
    #             rental_start_date__lt=end_date,
    #             rental_end_date__gt=start_date
    #         )
    #         if self.instance.pk:
    #             overlapping_transactions = overlapping_transactions.exclude(pk=self.instance.pk)

    #         if overlapping_transactions.exists():
    #             raise ValidationError("This car is already rented in the selected date range.")

    #     if price is not None and price < 0:
            # raise ValidationError("Rental price must be positive.")

class PaymentForm(forms.ModelForm):
    payment_amount = forms.DecimalField(
        required=True,
        widget=forms.NumberInput(attrs={"class": "form-control", "placeholder": "Payment Amount (USD)"}),
        label="Payment Amount"
    )
    payment_method = forms.ChoiceField(
        required=True,
        choices=[('credit_card', 'Credit Card'), ('debit_card', 'Debit Card'), ('cash', 'Cash'), ('paypal', 'PayPal')],
        widget=forms.Select(attrs={"class": "form-control"}),
        label="Payment Method"
    )
    payment_status = forms.ChoiceField(
        required=True,
        choices=[('paid', 'Paid'), ('pending', 'Pending'), ('failed', 'Failed')],
        widget=forms.Select(attrs={"class": "form-control"}),
        label="Payment Status"
    )


    transaction = forms.ModelChoiceField(
        queryset=Transaction.objects.all(),
        widget=forms.HiddenInput(),  
        required=True,
    )
    
    class Meta:
        model = Payment
        exclude = ['payment_date','receipt_pdf']

    def __init__(self, *args, **kwargs):
        transaction_instance = kwargs.pop('transaction_instance', None)
        super().__init__(*args, **kwargs)
        if transaction_instance:
            self.fields['transaction'].initial = transaction_instance
            self.fields['transaction'].widget.attrs.update({'readonly': True})


class MaintenanceTaskForm(forms.ModelForm):
    name = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Name", "class":"form-control"}), label="")
    description = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Description", "class":"form-control"}), label="")

    class Meta:
        model = MaintenanceTask
        fields = ['name', 'description']


class CarMaintenanceForm(forms.ModelForm):
    performed_at = forms.DateTimeField(
        widget=forms.widgets.DateTimeInput(attrs={"class": "form-control", "placeholder": "Performed At", "type": "datetime-local"}),
        label="Performed At", required=True
        )
    car = forms.ModelChoiceField(
        queryset=Car.objects.all(),
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Car"
    )
    task = forms.ModelChoiceField(
        queryset=MaintenanceTask.objects.all(),
        widget=forms.widgets.Select(attrs={"class": "form-control"}),
        label="Maintenance Task"
    )
    notes = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={"placeholder":"Description", "class":"form-control"}), label="")

    class Meta:
        model = CarMaintenance
        fields = ['car', 'task', 'notes', 'performed_at']