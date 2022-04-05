from operator import le
import random
import string
from django.utils.text import slugify


def random_string_generator(len):
    return ''.join(random.choices(string.ascii_letters+string.digits,k=len))


def generate_slug(slugStr, sender, randStrlen=5 ):
    def get_slug():
        return slugify(f"{slugStr} {random_string_generator(randStrlen)}")
    while True:
        slug = get_slug()
        if not sender.objects.filter(slug=slug).exists():
            return slug
            break 