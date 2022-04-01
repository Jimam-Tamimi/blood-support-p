# Generated by Django 4.0 on 2022-04-01 22:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_profile_email'),
        ('blood', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=500)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_reporter', to='account.user')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_reported', to='account.user')),
            ],
        ),
        migrations.CreateModel(
            name='DonorRequestReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=500)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('donor_request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blood.donorrequest')),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.user')),
            ],
        ),
        migrations.CreateModel(
            name='BloodRequestReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=500)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('blood_request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blood.bloodrequest')),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.user')),
            ],
        ),
    ]
