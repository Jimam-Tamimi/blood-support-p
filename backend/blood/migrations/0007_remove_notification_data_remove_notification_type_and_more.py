# Generated by Django 4.0 on 2022-04-19 21:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0009_alter_user_id'),
        ('blood', '0006_notification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='data',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='type',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='users',
        ),
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='account.user'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='NotificationData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('NEW_BLOOD_REQUEST', 'NEW_BLOOD_REQUEST'), ('DONOR_REQUEST_GOT', 'DONOR_REQUEST_GOT'), ('BLOOD_REQUEST_UPDATED', 'BLOOD_REQUEST_UPDATED'), ('BLOOD_REQUEST_DELETED', 'BLOOD_REQUEST_DELETED'), ('DONOR_REQUEST_ACCEPTED', 'DONOR_REQUEST_ACCEPTED'), ('DONOR_REQUEST_NOT_ACCEPTED', 'DONOR_REQUEST_NOT_ACCEPTED'), ('DONOR_REQUEST_REJECTED', 'DONOR_REQUEST_REJECTED'), ('DONOR_REQUEST_RESTORED', 'DONOR_REQUEST_RESTORED'), ('DONOR_REQUEST_DELETED', 'DONOR_REQUEST_DELETED'), ('DONOR_REQUEST_UPDATED', 'DONOR_REQUEST_UPDATED'), ('DONOR_REQUEST_REVIEWED', 'DONOR_REQUEST_REVIEWED'), ('BLOOD_REQUEST_REVIEWED', 'BLOOD_REQUEST_REVIEWED')], max_length=300)),
                ('data', models.JSONField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('users', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='notification',
            name='notification_data',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='blood.notificationdata'),
            preserve_default=False,
        ),
    ]