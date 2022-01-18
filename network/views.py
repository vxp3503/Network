
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
import json
from .models import User, Post, Comments
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, "network/index.html")


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

@csrf_exempt
@login_required
def newpost(request):
    if request.method != "POST":
        return JsonResponse({"error":"POST method required"}, status = 400)
    data = json.loads(request.body)
    body = data.get("body", "")
    post = Post(content=body,user=User.objects.get(username=request.user.username))
    post.save()
    if (Post.objects.filter(content=body).exists()):
        return JsonResponse({"message":"post created"}, status = 201)
    else:
        return JsonResponse({"error":"post not created"}, status = 400)

@csrf_exempt
def postview(request,p,pnumber,cuser):
    if p==1:
        x=Post.objects.all()
        x=x.order_by("-date").all()
        paginator = Paginator(x,10)
        obj = paginator.page(pnumber)
        return JsonResponse({'objlist':[post.serialize() for post in obj.object_list],'objnum':paginator.num_pages,'hasnext':obj.has_next(),'hasprevious':obj.has_previous()},safe=False)
    elif p==2:
        u=User.objects.get(id=request.user.id)
        followed = u.follower.all()
        z=[]
        for user in followed:
            x = Post.objects.filter(user=user)
            x=x.order_by("-date").all()
            z.extend(x)
        paginator = Paginator(z,10)
        obj = paginator.page(pnumber)
        return JsonResponse({'objlist':[post.serialize() for post in obj.object_list],'objnum':paginator.num_pages,'hasnext':obj.has_next(),'hasprevious':obj.has_previous()},safe=False)
    else:
        user=User.objects.get(id=cuser)
        x= Post.objects.filter(user=user)
        x=x.order_by("-date").all()
        paginator = Paginator(x,10)
        obj = paginator.page(pnumber)
        return JsonResponse({'objlist':[post.serialize() for post in obj.object_list],'objnum':paginator.num_pages,'hasnext':obj.has_next(),'hasprevious':obj.has_previous()},safe=False)


def followers(request,user_id):
    current = User.objects.get(id=request.user.id)
    follow = User.objects.get(id=user_id)
    followed = follow.followers.all()
    following =follow.follower.all()
    return JsonResponse({"followed":len(followed),'following':len(following), "currentuser":1 if current in followed else 0, "samee":1 if user_id==current.id else 0 },safe=False)

def toggle(request,user_id):
    current = User.objects.get(id=request.user.id)
    follow = User.objects.get(id=user_id)
    if current in follow.followers.all():
        follow.followers.remove(current)
        current.save()
        if current not in follow.followers.all():
            return JsonResponse({"message":"unfollowed"}, status = 201)
        else:
            return JsonResponse({"error":"fucked up shit"}, status = 400)
    else:
        follow.followers.add(current)
        current.save()
        if current in follow.followers.all():
            return JsonResponse({"message":"followed"}, status = 201)
        else:
            return JsonResponse({"error":"fucked up shit"}, status = 400)
@csrf_exempt
@login_required
def like(request,post_id):
    post = Post.objects.get(id=post_id)
    if request.method=="PUT":
        data = json.loads(request.body)
        if data.get("content") is not None:
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)
    else:
        p = post.likes.all()
        if request.user in p:
            post.likes.remove(request.user)
            post.save()
            return JsonResponse({'message':'Unliked'},status=201)
        if request.user not in p:
            post.likes.add(request.user)
            post.save()
            return JsonResponse({"message":"Liked"},status=201)

def post(request,id):
    p = Post.objects.get(id=id)
    return JsonResponse(p.serialize(),status=201)            
