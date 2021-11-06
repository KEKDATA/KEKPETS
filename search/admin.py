import json
import random

from django.apps import apps
from django.conf import settings
from django.contrib import admin, messages
from django.contrib.admin.options import TO_FIELD_VAR, IS_POPUP_VAR
from django.contrib.admin.templatetags.admin_urls import add_preserved_filters
from django.contrib.admin.utils import quote
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.html import format_html
from django.utils.http import urlquote
from django.utils.translation import gettext as _

from .apps import SearchConfig
from .forms import VidecamFramesUploadForm
from .ml.algorithm import PetAnalytics
from .models import VidecamFrame, DetectedObject, VidecamInfo


def get_pet_analytic() -> PetAnalytics:
    app_config = apps.get_app_config('search')
    return app_config.pet_analytic


def process_image(videcam_frame: VidecamFrame):
    print('KEK', videcam_frame.image.url)
    pet_analytic = get_pet_analytic()
    img = videcam_frame.image.read()
    analytics_result = pet_analytic.predict(img)
    videcam_info = VidecamInfo.objects.filter(videcam_id=analytics_result.camera_id).first()
    videcam_frame.videcam_id = analytics_result.camera_id
    videcam_frame.filmed_at = analytics_result.snapshot_datetime
    videcam_frame.info = videcam_info

    videcam_frame.save()
    for bbox in analytics_result.boxes:
        DetectedObject.objects.create(
            color=json.dumps(bbox.animal_colors),
            breed=json.dumps(bbox.animal_breeds),
            long_tail_proba=bbox.is_long_tail,
            top_left_x=bbox.top_left_x,
            top_left_y=bbox.top_left_y,
            width=bbox.width,
            height=bbox.height,
            frame_id=videcam_frame.pk,
        )


@admin.register(VidecamFrame)
class VidecamFrameAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'preview',
        'detected_objects_count',
    )
    readonly_fields = ('image', 'preview')

    add_form = VidecamFramesUploadForm

    def get_urls(self):
        return super().get_urls()

    def preview(self, obj):
        return format_html('<a href="{0}"><img src="{0}" alt="{1}" width=200 height=100></a>', obj.image.url, obj.image)

    def detected_objects_count(self, obj):
        return str(obj.detected_objects.count())

    def get_form(self, request, obj=None, change=False, **kwargs):
        if obj is None:
            kwargs['form'] = self.add_form
        return super().get_form(request, obj, change, **kwargs)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return super().get_readonly_fields(request, obj)
        else:
            return tuple()

    def save_model(self, request, obj, form, change):
        if isinstance(obj, list):
            for o in obj:
                super().save_model(request, o, form, change)
                process_image(o)
        else:
            super().save_model(request, obj, form, change)

    def log_addition(self, request, object, message):
        for obj in object:
            return super().log_addition(request, obj, message)

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        if not object_id:
            extra_context = extra_context or {}
            extra_context['show_save_and_continue'] = False
        return super().changeform_view(request, object_id, form_url, extra_context)

    def response_add(self, request, obj, post_url_continue=None):
        opts = self.model._meta
        preserved_filters = self.get_preserved_filters(request)
        obj_urls = [
            reverse(
                'admin:%s_%s_change' % (opts.app_label, opts.model_name),
                args=(quote(o.pk),),
                current_app=self.admin_site.name,
            )
            for o in obj
        ]
        # Add a link to the object's change form if the user can edit the obj.
        if self.has_change_permission(request, obj):
            obj_repr = format_html('<br>' + ''.join([
                '<a href="{0}">{1}</a>,<br>'.format(urlquote(url), o) for o, url in zip(obj, obj_urls)
            ]))
        else:
            obj_repr = str(obj)
        msg_dict = {
            'name': opts.verbose_name,
            'obj': obj_repr,
        }
        # Here, we distinguish between different save types by checking for
        # the presence of keys in request.POST.

        if IS_POPUP_VAR in request.POST:
            to_field = request.POST.get(TO_FIELD_VAR)
            if to_field:
                attr = str(to_field)
            else:
                attr = obj._meta.pk.attname
            value = obj.serializable_value(attr)
            popup_response_data = json.dumps({
                'value': str(value),
                'obj': str(obj),
            })
            return TemplateResponse(
                request,
                self.popup_response_template or [
                    'admin/%s/%s/popup_response.html' % (opts.app_label, opts.model_name),
                    'admin/%s/popup_response.html' % opts.app_label,
                    'admin/popup_response.html',
                ],
                {
                    'popup_response_data': popup_response_data,
                },
            )

        elif "_addanother" in request.POST:
            msg = format_html(
                _('The {name} “{obj}” was added successfully. You may add another {name} below.'),
                **msg_dict
            )
            self.message_user(request, msg, messages.SUCCESS)
            redirect_url = request.path
            redirect_url = add_preserved_filters({'preserved_filters': preserved_filters, 'opts': opts}, redirect_url)
            return HttpResponseRedirect(redirect_url)

        else:
            msg = format_html(
                _('The {name} “{obj}” was added successfully.'),
                **msg_dict
            )
            self.message_user(request, msg, messages.SUCCESS)
            return self.response_post_save_add(request, obj)


@admin.register(DetectedObject)
class DetectedObjectAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'color',
        'breed',
        'long_tail_proba',
        'top_left_x',
        'top_left_y',
        'width',
        'height',
        'frame',
    )
    list_filter = ('frame',)


@admin.register(VidecamInfo)
class VidecamInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'videcam_id', 'address', 'ovd_phones')
