{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.title}}</h1>

  <ol class="breadcrumb">
    <li><a href="/{{parentPage.id}}">{{parentPage.title}}</a></li>
    <li class="active">{{currentPage.title}}</li>
  </ol>

  {% set offer = currentPage.blocks({ type: 'special-offer' })[0]; %}

  {% autoescape false %}
  {{ offer.longDescription }}
  {% endautoescape %}

  <p>
  For more info or to book drop me a line by email: <a href='mailto:&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;'>&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;</a>
  or via my <a href='https://facebook.com/juliapaganophotography'><i class="fa fa-facebook-official" aria-hidden="true"></i> Facebook</a>
  </p>


  {% for image in offer.flickr.photoset.items %}
    <a data-lightbox="{{offer.flickr.photosetId}}"
       href="{{image.sizes['Original'].source}}"
       class="thumbnail inline-block"
       title="{{image.title}}">
        <img src="{{image.sizes[offer.flickr.size].source}}" alt="{{image.title}}">
    </a>
  {% endfor %}
{%endblock%}
