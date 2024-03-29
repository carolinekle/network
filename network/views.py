import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.core.paginator import Paginator

from .models import User, Post, Following


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
        "followers":followers
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
    try:
        post = Post.objects.get(user=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Email not found."}, status=404)


    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("read") is not None:
            post.read = data["read"]
        if data.get("archived") is not None:
            post.archived = data["archived"]
        post.save()
        return HttpResponse(status=204)
    return HttpResponseRedirect(reverse("index"))