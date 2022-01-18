
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newpost", views.newpost, name="newpost"),
    path("post/<int:id>", views.post, name="post"),
    path("postview/<int:p>/<int:pnumber>/<int:cuser>", views.postview, name="postview"),
    path("followers/<int:user_id>", views.followers, name="followers"),
    path("toggle/<int:user_id>", views.toggle, name="toggle"),
    path("like/<int:post_id>", views.like, name="toggle")
]
