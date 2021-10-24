"""conf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import debug_toolbar
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

from search.documents import DetectedObjectDocument


def kek(request, *args, **kwargs):
    script = {
        "source": "cosineSimilarity(params.query_vector, 'vector')",
        "params": {
            "query_vector": [.1, .2, .3, .4, .5]
        }
    }
    query = {
        "match_all": {}
    }
    r = DetectedObjectDocument.search().query('script_score', script=script, query=query)
    print(r.to_queryset())
    return HttpResponse('KEK')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', kek),
    path('api/v1/', include('conf.api_v1')),
]



urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
