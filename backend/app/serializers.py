from rest_framework import serializers
from .models import User, Song, Playlist, PlaylistSong

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Hiển thị thông tin user

    class Meta:
        model = Playlist
        fields = '__all__'

class PlaylistSongSerializer(serializers.ModelSerializer):
    playlist = PlaylistSerializer(read_only=True)
    song = SongSerializer(read_only=True)

    class Meta:
        model = PlaylistSong
        fields = '__all__'