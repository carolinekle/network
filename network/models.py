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

