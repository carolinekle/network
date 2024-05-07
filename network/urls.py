
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("all_posts", views.all_posts, name="all_posts"),
    path("profile/<str:post_poster>", views.profile, name="profile"),
    #API Routes
    path("edit_posts/<int:post_id>", views.edit_posts, name="edit"),
    path("like/<int:post_id>", views.like, name="like"),
    path("delete_post/<int:post_id>", views.delete_post, name="delete_post"),
    path("like_status/<int:post_id>", views.like_status, name="like_status"),
    path("follow/<str:post_poster>", views.follow, name="follow"),
    path("follow_status/<str:post_poster>", views.follow_status, name="follow_status")
]
