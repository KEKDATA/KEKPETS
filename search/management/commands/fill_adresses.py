import pandas as pd
from tqdm import tqdm
from django.core.management import BaseCommand

from search.models import VidecamInfo


PHONE_TRANSLATE_TABLE = str.maketrans({' ': '', '(': '', ')': '', '-': ''})


def get_ovd_phones(row):
    ovd_phones = row['OVDPhone'].strip().split('\n\n')
    ovd_phones = [phone.replace('PhoneOVD:', '+7').translate(PHONE_TRANSLATE_TABLE) for phone in ovd_phones]
    return ','.join(ovd_phones)


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        sheets = [
            'Подъезное видеонаблюдение',
            'Видеонаблюдение массового скопл',
            'Дворовое наблюдение',
        ]
        for sheet in sheets:
            df = pd.read_excel('Open Data камеры видеонаблюдения.xlsx', sheet_name=sheet)
            print(f'Load "{sheet}" sheet')
            for _, row in tqdm(df.iterrows()):
                VidecamInfo.objects.update_or_create(
                    videcam_id=row['ID'],
                    defaults={
                        'address': row['Address'],
                        'ovd_phones': get_ovd_phones(row),
                    },
                )
