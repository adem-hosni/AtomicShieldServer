from django.db import models
import json

class GameServers(models.Model):
    
    ip = models.CharField(max_length=49)
    port = models.IntegerField()
    owner_id = models.IntegerField()
    subscriptions = models.TextField()
    
    class Meta:
        db_table = "gameservers"
        verbose_name_plural = "gameservers"
        

class Announcements(models.Model):
    author = models.CharField(max_length=32, default="EagleAntiCheat Development Team", null=False)
    title = models.CharField(max_length=50, null=True)
    announcement = models.TextField(max_length=4096)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)
    
    class Meta:
        db_table = "announcements"
        verbose_name_plural = "announcements"
        
    def __str__(self) -> str:
        return self.title

class PatchNotes(models.Model):
    author = models.CharField(max_length=32, default="EagleAntiCheat Development Team", null=False)
    title = models.CharField(max_length=32, null=False)
    patchnotes = models.TextField(blank=False)
    mention_everyone = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, null=True)
        
    class Meta:
        db_table = "patchnotes"
        verbose_name_plural = "patch-notes"
            
    def __str__(self) -> str:
        return self.title

