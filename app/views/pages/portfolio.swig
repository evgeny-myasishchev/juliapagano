{% extends '../layouts/application.swig' %}
{% block container %}
{% set gallery = currentPage.blocks({ id : 'gallery' })[0]; %}

<div class="row">
    {% for photo in gallery.flickr.photoset.items %}
    <div class="col-lg-6 col-md-6 col-xs-12 thumb" >
        <a data-lightbox="roadtrip" href="{{photo.sizes['Original'].source}}" class="thumbnail" title="{{photo.title}}">
            <img style='width: 500px; height: 357px;' src="{{photo.sizes[gallery.flickr.size].source}}" alt="{{photo.title}}" class="img-responsive">
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
