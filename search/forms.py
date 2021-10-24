from django import forms
from django.forms import widgets

from search.models import VidecamFrame


class MultipleFileWidget(widgets.ClearableFileInput):
    template_name = 'search/widgets/multiple_file_input.html'

    class Media:
        css = {'all': ('multiple_file_upload/style.css',)}
        js = ('multiple_file_upload/script.js',)

    def __init__(self, attrs=None):
        super().__init__(attrs)
        self.attrs.update({'class': 'inputfile', 'multiple': True, 'data-multiple-caption': '{count} files selected'})


class VidecamFramesUploadForm(forms.ModelForm):

    class Meta:
        model = VidecamFrame
        fields = ('image',)
        widgets = {
            'image': MultipleFileWidget(),
        }
        labels = {
            'image': 'Images',
        }

    def save(self, commit=True):
        self.instance.origin_file, *files = self.files.getlist('image')
        videcam_frame = super().save(commit)
        videcam_frames = [VidecamFrame(image=file) for file in files]
        if commit:
            for file in videcam_frames:
                file.save()
        return [videcam_frame, *videcam_frames]




