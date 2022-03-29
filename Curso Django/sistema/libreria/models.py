from django.db import models

# Create your models here.
class Libro(models.Model):
    id=models.AutoField(primary_key=True)
    titulo=models.CharField(max_length=100,verbose_name="titulo")
    imagen=models.ImageField(upload_to='imagenes/',null=True,blank=True,verbose_name="imagen")
    descripcion=models.TextField(null=True,verbose_name="descripcion")

    def __str__(self):
        fila= "titulo"+self.titulo+"-"+"Descripcion: "+self.descripcion
        return fila
    def delete(self,using=None,keep_parenta=False):
        self.imagen.storage.delete(self.imagen.name)
        super().delete()