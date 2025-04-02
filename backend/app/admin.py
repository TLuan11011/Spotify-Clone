from django.contrib import admin
from .models import User, Song, Playlist, PlaylistSong

admin.site.register(User)
admin.site.register(Song)
admin.site.register(Playlist)
admin.site.register(PlaylistSong)