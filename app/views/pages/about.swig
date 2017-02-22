{% extends '../layouts/application.swig' %}
{% block container %}
  {% set aboutBlock = currentPage.blocks({ id : 'about' })[0]; %}
  {% set selfie = aboutBlock.flickr.photoset.items[0] %}
  <h1 class='page-header'>{{currentPage.title}}</h1>
  <div class="row">
    <div class="col-sm-6 col-md-6">
      {% autoescape false %}{{aboutBlock.content}}{% endautoescape %}
    </div>
    <div class="col-sm-6 col-md-6">
      <div class="thumbnail">
        <img alt="Julia Pagano" src="{{selfie.sizes[aboutBlock.flickr.size].source}}">
      </div>
    </div>
  </div>
{% endblock %}
