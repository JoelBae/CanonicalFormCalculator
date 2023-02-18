from django.db import models

# Create your models here.
class LP(models.Model):
    lp = models.JSONField()


class Calculation(models.Model):
    input_LP = models.ForeignKey(LP, on_delete=models.CASCADE, related_name='input')
    output_LP = models.ForeignKey(LP, on_delete=models.CASCADE, related_name='output')
    date = models.DateTimeField(auto_now_add=True)