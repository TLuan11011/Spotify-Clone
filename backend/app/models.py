# from django.db import models

# class User(models.Model):  # Tương ứng với bảng `taikhoan`
#     username = models.CharField(max_length=50, unique=True)
#     email = models.EmailField(max_length=100, unique=True)
#     password_hash = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return self.username

# class Song(models.Model):  # Tương ứng với bảng `songs`
#     name = models.CharField(max_length=255)
#     artist = models.CharField(max_length=255)
#     album = models.CharField(max_length=255, blank=True, null=True)
#     duration = models.IntegerField()  # Thời lượng tính bằng giây
#     song_url = models.URLField(max_length=500)

#     def __str__(self):
#         return f"{self.name} - {self.artist}"

# class Playlist(models.Model):  # Tương ứng với bảng `playlists`
#     name = models.CharField(max_length=255)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)  # Liên kết với người dùng
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name

# class PlaylistSong(models.Model):  # Tương ứng với bảng `playlist_songs`
#     playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
#     song = models.ForeignKey(Song, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"{self.playlist.name} - {self.song.name}"

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username

    class Meta:
        db_table = 'taikhoan'
        managed = False  # Nếu bạn không muốn Django quản lý bảng này


class Song(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255, blank=True, null=True)
    duration = models.IntegerField()  # Thời gian tính bằng giây
    song_url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.name} - {self.artist}"

    class Meta:
        db_table = 'songs'
        managed = False


class Playlist(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Liên kết với người dùng
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'playlists'
        managed = False


class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.playlist.name} - {self.song.name}"

    class Meta:
        db_table = 'playlist_songs'
        managed = False