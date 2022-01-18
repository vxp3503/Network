from django.test import TestCase
from django.test import Client
from .models import User,Post
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from.views import toggle,like
import datetime

# Create your tests here.


class FollowTestCase(TestCase):

    def setUp(self):

        a1 = User.objects.create(username="BBB", email="City@gmail.com", password="1234")
        a2 = User.objects.create(username="AAA", email="ity@gmail.com", password="1234")
        a2 = User.objects.create(username="CCC", email="ty@gmail.com", password="1234")
        p1 = Post.objects.create(user=a1, content="ty@gmail.com")



    def test_2(self):
        u1 = User.objects.get(username="BBB")
        u2 = User.objects.get(username="CCC")
        u1.is_active=True
        c=Client()
        request = HttpResponse(c.put('/like/1',{'body':'changed bodys'},content_type="application/json"))
        request.user=u1
        request.method="PUT"

        self.assertEqual(like(request,1),1)
