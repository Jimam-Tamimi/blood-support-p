# Generated by Django 4.0 on 2022-02-24 22:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_profile_email'),
        ('blood', '0007_remove_bloodrequest_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='DonorRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=100)),
                ('date_time', models.DateTimeField()),
                ('number', models.CharField(max_length=30)),
                ('add_number', models.CharField(max_length=30)),
                ('address', models.CharField(max_length=100)),
                ('description', models.TextField(max_length=500)),
                ('location', models.JSONField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.user')),
            ],
        ),
    ]