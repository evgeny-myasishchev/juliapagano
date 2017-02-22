{% macro priceBlock(price) %}
  <h3>{{ price.title }}</h3>
  <p>{{ price.fee }}</p>
  {% for image in price.flickr.photoset.items %}
    <a data-lightbox="{{price.flickr.photosetId}}"
       href="{{image.sizes['Original'].source}}"
       class="thumbnail inline-block"
       title="{{image.title}}">
        <img src="{{image.sizes[price.flickr.size].source}}" alt="{{image.title}}">
    </a>
  {% endfor %}
  <p>{{ price.description }}</p>
{% endmacro %}

{% extends '../layouts/application.swig' %}
{% set prices = currentPage.blocks({ type: 'photo-session' }); %}
{% block container %}
  <h1 class='page-header'>{{currentPage.title}}</h1>
  <div class="row">
      <div class="col-md-6">
      {{priceBlock(prices[0])}}
      </div>
      <div class="col-md-6">
      {{priceBlock(prices[3])}}
      </div>
  </div>
  <div class="row">
      <div class="col-md-6">
      {{priceBlock(prices[1])}}
      </div>
      <div class="col-md-6">
      {{priceBlock(prices[2])}}
      </div>
  </div>

  {% set extras = currentPage.blocks({ type: 'extras' })[0]; %}
  {% set afterSession = currentPage.blocks({ type: 'after-session' })[0]; %}
  <div class="row">
    <div class="col-md-6">
      <p><h3>{{ extras.title }}</h3></p>
      <p>{{ extras.description }}</p>
      <div class="panel panel-default">
        <ul class="list-group">
          {% for extraItem in extras.items %}
            <li class="list-group-item">{{ extraItem }}</li>
          {% endfor %}
        </ul>
      </div>
    </div>
    <div class="col-md-6">
      <p>
        <h3>{{ afterSession.title }}</h3>
      </p>
      <p>
        {{ afterSession.description }}
      </p>
      <div class='well'>
        {{ afterSession.notice }}
      </div>
    </div>
  </div>
{% endblock %}
