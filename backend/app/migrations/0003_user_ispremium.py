# Generated by Django 5.1.7 on 2025-04-17 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_playlist_cover_image_playlist_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='isPremium',
            field=models.BooleanField(default=True),
        ),
    ]
