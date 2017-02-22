{% extends '../layouts/application.swig' %}
{% block container %}
  {% set offer = currentPage.blocks()[0]; %}

  <h1 class='page-header'>{{offer.title}}</h1>
  {% autoescape false %}{{offer.content}}{% endautoescape %}

  <div class="thumb" >
  {% for photo in offer.flickr.photoset.items %}
      <a data-lightbox="roadtrip" href="{{photo.sizes['Original'].source}}" class="thumbnail inline-block" title="{{photo.title}}">
          <img src="{{photo.sizes[offer.flickr.size].source}}" alt="{{photo.title}}" class="img-responsive">
      </a>
  {% endfor %}
  </div>
{%endblock%}
