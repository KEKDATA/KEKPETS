# Generated by Django 3.2.8 on 2021-10-22 18:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_auto_20211022_1727'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videcamframe',
            old_name='videcam_info',
            new_name='info',
        ),
    ]
