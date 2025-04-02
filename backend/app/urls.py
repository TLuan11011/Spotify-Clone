from django.urls import path
from .views import get_songs, get_playlists, get_playlist_songs

urlpatterns = [
    path('songs/', get_songs, name='get_songs'),
    path('playlists/', get_playlists, name='get_playlists'),
    path('playlist/<int:playlist_id>/songs/', get_playlist_songs, name='get_playlist_songs'),
]