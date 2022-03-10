# Generated by Django 4.0 on 2022-03-05 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blood', '0011_rename_accepted_donorrequest_isaccepted'),
    ]

    operations = [
        migrations.AddField(
            model_name='bloodrequest',
            name='status',
            field=models.CharField(choices=[('open', 'Open'), ('accepted', 'Accepted'), ('completed', 'Completed'), ('expired', 'Expired')], default='open', max_length=30),
        ),
    ]