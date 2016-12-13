{% extends '../layouts/application.swig' %}

{% block title %}{{contentConfig.siteTitle}}{% endblock %}
{% block container_classes %}marketing{% endblock %}
{% block container %}
{% set sloganBlock = currentPage.blocks({ id : 'slogan' })[0]; %}
{% set carouselPhotoset = sloganBlock.flickr.photoset %}
{% set aboutBlock = currentPage.blocks({ id : 'about' }) %}
<div class="jumbotron">
	<h1>
  {% autoescape false %}{{sloganBlock.content}}{% endautoescape %}
	</h1>
	<div data-ride="carousel" class="carousel slide" id="home-screen-carousel" data-interval="3000">
		<ol class="carousel-indicators">
			{% for photo in carouselPhotoset.items %}
			<li interval data-target="#home-screen-carousel" data-slide-to="{{ loop.index - 1 }}" class="{% if loop.first %}active{% endif %}"></li>
			{% endfor %}
		</ol>
		<div role="listbox" class="carousel-inner">
			{% for photo in carouselPhotoset.items %}
			<div class="item {% if loop.first %}active{% endif %}">
					<img src="{{photo.sizes[sloganBlock.flickr.size].source}}" alt="{{photo.title}}">
				</div>
			{% endfor %}
		</div>
		<a class="left carousel-control" href="#home-screen-carousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#home-screen-carousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>
</div>

<div class="row">
	<div class="col-sm-12">
  {% autoescape false %}{{aboutBlock.content}}{% endautoescape %}
	</div>
</div>

{% endblock %}
