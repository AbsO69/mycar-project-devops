# Generated by Django 5.1.7 on 2025-04-07 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_car_image_data_alter_carmaintenance_performed_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='receipt_pdf',
            field=models.FileField(blank=True, null=True, upload_to='payment_receipts/'),
        ),
    ]
