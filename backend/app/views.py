from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Song, Playlist, PlaylistSong
from .serializers import SongSerializer, PlaylistSerializer, PlaylistSongSerializer

@api_view(['GET'])
def get_songs(request):
    songs = Song.objects.all()
    serializer = SongSerializer(songs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_playlists(request):
    playlists = Playlist.objects.all()
    serializer = PlaylistSerializer(playlists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_playlist_songs(request, playlist_id):
    playlist_songs = PlaylistSong.objects.filter(playlist_id=playlist_id)
    serializer = PlaylistSongSerializer(playlist_songs, many=True)
    return Response(serializer.data)