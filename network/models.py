from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class User(AbstractUser):
    followers = models.ManyToManyField("self", symmetrical=False, related_name='follower')

    def serializer(self):
        return {
        "name":self.username,
        "id":self.id
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator')
    content = models.TextField()
    date = models.DateTimeField(default=datetime.datetime.now)
    likes = models.ManyToManyField(User, related_name='likers', blank=True)

    def serialize(self):
        return {
        "name":self.user.username,
        "u_id":self.user.id,
        "id":self.id,
        "date":self.date.strftime("%b %#d %Y, %#I:%M %p"),
        "content":self.content,
        "likes":[users.id for users  in self.likes.all()]
        }

class Comments(models.Model):
    comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='posterr')
