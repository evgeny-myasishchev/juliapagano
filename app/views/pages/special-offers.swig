{% macro offerBlock(offerPage) %}
  {% set offer = offerPage.blocks({ type: 'special-offer' })[0]; %}
  {% set offerImage = offer.flickr.photoset.items[0]; %}
  <div class="thumbnail">
    <img alt="{{offerImage.title}}" src="{{offerImage.sizes['Medium 640'].source}}" alt="{{offerImage.title}}">
    <div class="caption">
      <h3>{{ offerPage.title }}</h3>
      {% autoescape false %}
      <p>{{ offer.shortDescription }}</p>
      {% endautoescape %}
      <p>
        <a class="btn btn-primary" href="{{offerPage.id}}" role="button">More details</a>
      </p>
    </div>
  </div>
{% endmacro %}

{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.title}}</h1>
  <div class="row">
    {% for offer in specialOffers %}
    <div class="col-md-6">
      {{offerBlock(offer)}}
    </div>
    {% endfor %}
  </div>
  For more info or to book drop me a line by email: <a href='mailto:&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;'>&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;</a>
  or via my <a href='https://facebook.com/juliapaganophotography'><i class="fa fa-facebook-official" aria-hidden="true"></i> Facebook</a>
{%endblock%}
