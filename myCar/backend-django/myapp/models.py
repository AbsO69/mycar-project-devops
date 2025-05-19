from django.db import models


class Record(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	first_name = models.CharField(max_length=50)
	last_name =  models.CharField(max_length=50)
	email =  models.EmailField(max_length=100, unique=True)
	phone = models.CharField(max_length=15)
	address =  models.CharField(max_length=100)
	city =  models.CharField(max_length=50)
	state =  models.CharField(max_length=50)
	zipcode =  models.CharField(max_length=20)

	def __str__(self):
		return(f"{self.first_name} {self.last_name}")
	
class MaintenanceTask(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Car(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    vin = models.CharField(max_length=17, unique=True)  # VIN is 17 characters long
    color = models.CharField(max_length=50)
    license_plate = models.CharField(max_length=20, unique=True)
    mileage = models.IntegerField()  # Mileage in miles
    fuel_type = models.CharField(
        max_length=10, 
        choices=[('gas', 'Gasoline'), ('diesel', 'Diesel'), ('electric', 'Electric'), ('hybrid', 'Hybrid')]
    )
    
    maintenance_tasks = models.ManyToManyField(MaintenanceTask, through='CarMaintenance', related_name='cars')
    image_data = models.BinaryField(blank=True, null=True, editable=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model} - {self.license_plate}"
    
class CarMaintenance(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    task = models.ForeignKey(MaintenanceTask, on_delete=models.CASCADE)
    performed_at = models.DateTimeField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.task.name} on {self.car}"


class Transaction(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='transactions')  # One car can have many transactions
    customer = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='transactions')  # One customer can have many transactions
    rental_start_date = models.DateTimeField()
    rental_end_date = models.DateTimeField()
    rental_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('ongoing', 'Ongoing'), ('completed', 'Completed'), ('canceled', 'Canceled')], default='ongoing')
    payment_status = models.CharField(max_length=20, choices=[('paid', 'Paid'), ('unpaid', 'Unpaid'), ('pending', 'Pending')], default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transaction {self.id} - {self.customer} rented {self.car}"


class Payment(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='payment')  # Each transaction has one payment
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=[('credit_card', 'Credit Card'), ('debit_card', 'Debit Card'), ('cash', 'Cash'), ('paypal', 'PayPal')])
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=[('paid', 'Paid'), ('pending', 'Pending'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    receipt_pdf = models.FileField(upload_to='payment_receipts/', null=True, blank=True) 
    binary_receipt_pdf = models.BinaryField(null=True, blank=True)   
    
    def __str__(self):
        return f"Payment for Transaction {self.transaction.id} - {self.payment_method}"


