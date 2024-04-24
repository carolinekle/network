from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    text = models.CharField(max_length=240, blank=False)
    poster = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, blank=True)
    
    def __str__(self):
        return f"Post {self.id} by {self.poster} on {self.created.strftime('%d %b %Y %H:%M')}"
    
    def likes(self):
        return Like.objects.filter(post_liked=self).count()
    
    def user_likes(self):
        return Like.objects.filter(post_liked=self).exists()


class Following(models.Model):
    user_following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    user_followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed")

    def __str__(self):
        return f"{self.user_following} is following {self.user_followed}"
    
class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liker")
    post_liked = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_liked")

    def __str__(self):
        return f"User {self.liker} liked {self.post_liked}"