{% macro offerBlock(offer) %}
  <h3>{{ offer.title }}</h3>
  {% for image in offer.flickr.photoset.items %}
    <a data-lightbox="{{offer.flickr.photosetId}}"
       href="{{image.sizes['Original'].source}}"
       class="thumbnail inline-block"
       title="{{image.title}}">
        <img src="{{image.sizes[offer.flickr.size].source}}" alt="{{image.title}}">
    </a>
  {% endfor %}
  {% autoescape false %}<p>{{ offer.content }}</p>{% endautoescape %}
{% endmacro %}

{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.title}}</h1>
  <div class="row">
    {% for offer in currentPage.blocks({ type: 'special-offer' }) %}
    <div class="col-md-6">
      {{offerBlock(offer)}}
    </div>
    {% endfor %}
  </div>
  {% set contactMe = currentPage.blocks({ type: 'contact-me' })[0]; %}
  {% autoescape false %}<p>{{ contactMe.content }}</p>{% endautoescape %}
{%endblock%}
