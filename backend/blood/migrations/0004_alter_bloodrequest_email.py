# Generated by Django 4.0 on 2022-02-04 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blood', '0003_remove_bloodrequest_location_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bloodrequest',
            name='email',
            field=models.EmailField(max_length=100),
        ),
    ]
