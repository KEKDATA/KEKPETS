from django.contrib.auth import get_user_model
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = 'Create superuser "admin"'

    def handle(self, *args, **options):
        User = get_user_model()  # noqa
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                password='admin'
            )
            print('Create superuser "admin"')
        else:
            print('Superuser "admin" already exists')

