import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.core.paginator import Paginator
import json
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

from .models import User, Post, Following, Like


def index(request):
    all = Post.objects.order_by('-created').all()
    posts = Paginator(all, 10)

    page_number = request.GET.get("page")
    page_obj = posts.get_page(page_number)
    

    return render(request, "network/index.html",{
        "posts":posts,
        "page_obj": page_obj
    })

def profile(request, post_poster):
    poster = User.objects.get(username=post_poster)
    profile_posts = Post.objects.filter(poster=poster).order_by('-created').all()

    following = Following.objects.filter(user_following=poster)
    followers =Following.objects.filter(user_followed=poster)
    
    posts = Paginator(profile_posts, 10)

    page_number = request.GET.get("page")
    page_obj = posts.get_page(page_number)

    return render(request, "network/profile.html",{
        "profile":poster,
        "page_obj": page_obj,
        "following":following,
        "followers":followers,
        
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def all_posts(request):
    if request.method == "POST":
        text = request.POST["content"]
        poster = request.user

        new_post = Post(
            text=text,
            poster=poster
        )
        new_post.save()

        return HttpResponseRedirect(reverse("index"))

    else:
        message = "The request is not valid."
        return JsonResponse({ 
            "message": message
            }, status=404)

def edit_posts(request, post_id):
    if request.method == "POST":
        try:
            edited = Post.objects.get(pk=post_id)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Post not found"}, status=404)

        try:
            data = json.loads(request.body)
            if data.get("text") is not None:
                edited.text = data["text"]
                updated_datetime = timezone.now()
                edited.updated = updated_datetime
            edited.save()
            response_data = {
                "message": "Change successful",
                "text": edited.text,
                "updated": edited.updated
            }
            return JsonResponse(response_data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        
def delete_post(request, post_id):
    if request.method == "GET":
        try:
            deleted = get_object_or_404(Post, pk=post_id)
            deleted.delete()
            return JsonResponse({"message":"post deleted"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Post unavailable. Try again"}, status=400)
    elif json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    

def like_status(request, post_id):
    if request.user.is_authenticated:
        liker = request.user
        post = get_object_or_404(Post, pk=post_id)
        existing_like = Like.objects.filter(post_liked=post, liker=liker).exists()
        return JsonResponse({"liked": existing_like})
    else:
        return JsonResponse({"liked": False})

def like(request, post_id):
    if request.method == "POST":
        liker = request.user
        post = get_object_or_404(Post, pk=post_id)
        existing_like = Like.objects.filter(post_liked=post, liker=liker).first()
        if existing_like:
            existing_like.delete()
            return JsonResponse({"message": "like removed"})
        else:
            new_like = Like(
                liker=liker,
                post_liked=post
            )
            new_like.save()
            return JsonResponse({"message": "like added"})
    elif json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    
def follow_status(request, post_poster):
    if request.user.is_authenticated:
        following = request.user
        followed = User.objects.get(username=post_poster)
        existing_follower = Following.objects.filter(user_following=following, user_followed=followed).exists()
        return JsonResponse({"following": existing_follower})
    else:
        return JsonResponse({"following": False})

def follow(request, post_poster):
    if request.method == "POST":
        following = request.user
        followed = User.objects.get(username=post_poster)
        existing_follower = Following.objects.filter(user_following=following, user_followed=followed.id).first()
        if existing_follower:
            existing_follower.delete()
            return JsonResponse({"message":"unfollowed"})
        else:
            new_follow= Following(
                user_following=following,
                user_followed=followed
            )
            new_follow.save()
            return JsonResponse({"message":"followed"})
    elif json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)