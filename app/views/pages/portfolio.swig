{% extends '../layouts/application.swig' %}
{% block container %}
<div class="row">
    {% for photo in galleryPhotoset.items %}
    <div class="col-lg-3 col-md-4 col-xs-6 thumb" >
        <a data-lightbox="roadtrip" href="{{photo.sizes['Original'].source}}" class="thumbnail" title="{{photo.title}}">
            <img style='width: 240px; height: 171px;' src="{{photo.sizes['Small'].source}}" alt="{{photo.title}}" class="img-responsive">
        </a>
    </div>
    {% endfor %}
</div>
{%endblock%}

{% block bottomScripts %}
  <script>
    !function($) {
      jQuery(function() {
        $('img.img-responsive').attr('style', '');
      });
    }(jQuery);
  </script>
{% endblock %}
