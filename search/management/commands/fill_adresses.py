import pandas as pd
from tqdm import tqdm
from django.core.management import BaseCommand

from search.models import VidecamInfo


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
                VidecamInfo.objects.create(
                    videcam_id=row['ID'],
                    address=row['Address'],
                )
