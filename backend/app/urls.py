# backend/app/urls.py
from django.urls import path
from .views import (
    get_songs,
    get_playlists,
    get_playlist,
    add_playlist,
    update_playlist,
    delete_playlist,
    get_playlist_songs,
    add_song_to_playlist,
    remove_song_from_playlist,
    get_albums,
    add_album,
    update_album,
    change_album_status,
    get_artists,
    add_artist,
    update_artist,
    change_artist_status,
    get_users,
    add_user,
    update_user,
    delete_user,
    changestatus_user,
    login_user,
    add_song,
)

urlpatterns = [
    # Songs
    path('api/songs/', get_songs, name='get_songs'),
    path('api/songs/add/', add_song, name='add_song'),
    
    # Playlists
    path('api/playlists/', get_playlists, name='get_playlists'),
    path('api/playlists/<int:pk>/', get_playlist, name='get_playlist'),
    path('api/playlists/add/', add_playlist, name='add_playlist'),
    path('api/playlists/update/<int:pk>/', update_playlist, name='update_playlist'),
    path('api/playlists/delete/<int:pk>/', delete_playlist, name='delete_playlist'),
    
    # Playlist Songs
    path('api/playlist/<int:playlist_id>/songs/', get_playlist_songs, name='get_playlist_songs'),
    path('api/playlist_songs/', add_song_to_playlist, name='add_song_to_playlist'),
    path('api/playlist_songs/<int:playlist_id>/<int:song_id>/', remove_song_from_playlist, name='remove_song_from_playlist'),
    
    # Album
    path('api/albums/', get_albums, name='get_albums'),
    path('api/albums/add/', add_album, name='add_album'),
    path('api/albums/update/<int:album_id>/', update_album, name='update_album'),
    path('api/albums/change/<int:pk>/', change_album_status, name='change_album_status'),
    
    # Nghệ sĩ
    path('api/artists/', get_artists, name='get_artists'),
    path('api/add-artist/', add_artist, name='add-artist'),
    path('api/artists/<int:pk>/', update_artist, name='update-artist'),
    path('api/artists/change/<int:pk>/', change_artist_status, name='change_artist_status'),
    
    # User
    path('api/users/', get_users, name='get_users'),
    path('api/user/add/', add_user, name='add_user'),
    path('api/users/<int:pk>/', update_user, name='update_user'),
    path('api/users/login/', login_user, name='login_user'),
    path('api/delete-user/<int:pk>/', delete_user, name='delete_user'),
    path('api/users/<int:pk>/toggle-status/', changestatus_user, name='changestatus_user'),
]