# Generated by Django 5.2 on 2025-04-06 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_maintenancetask_carmaintenance_car_maintenance_tasks'),
    ]

    operations = [
        migrations.AddField(
            model_name='car',
            name='image_data',
            field=models.BinaryField(blank=True, editable=True, null=True),
        ),
        migrations.AlterField(
            model_name='carmaintenance',
            name='performed_at',
            field=models.DateTimeField(),
        ),
    ]
