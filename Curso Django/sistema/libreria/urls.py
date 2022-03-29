
from django.urls import  path
from . import  views
from django.contrib.staticfiles.urls import static
from django.conf import  settings

urlpatterns =[
    path('',views.inicio,name='inicio'),
    path('nosotros',views.nosotros,name='nosotros'),
    path('libros',views.libros,name='libros'),
    path('libros/crear',views.crear,name='crear'),
    path('libros/editar',views.editar,name='editar'),
    path('eliminar/<int:id>', views.eliminar, name='eliminar'),
     path('libros/editar/<int:id>',views.editar,name='editar'),

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
 