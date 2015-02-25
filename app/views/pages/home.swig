{% extends '../layouts/application.swig' %}

{% block title %}{{currentPage.title}}{% endblock %}
{% block container_classes %}marketing{% endblock %}
{% block container %}
<div class="jumbotron">
	<h1>Children and family photographer</h1>
	<p>Hi, I am Julia, I am a mum and a child photographer based in St Andrews, Scotland.</p>
</div>

<div class="row">
	<div class="col-md-4">
		<h2>Portrait session - <sup>£</sup> <strong>20</strong></h2>
		<p>What is included: pre-session consultation, 30 min shoot at your home or location of your choice, editing your images and providing private online gallery with 10-15 portraits to chose from.</p>
		<p><a role="button" href="#" class="btn btn-primary">View samples &raquo;</a></p>
	</div>
	<div class="col-md-4">
		<h2>Lifestyle session - <sup>£</sup> <strong>50</strong></h2>
		<p>What is included: pre-session consultation, 2 hour shoot at your home or location of your choice, editing your images and providing private online gallery with 30-50 pictures to chose from.</p>
		<p><a role="button" href="#" class="btn btn-primary">View samples &raquo;</a></p>
		
	</div>
	<div class="col-md-4">
		<h2>Additional services</h2>
		<p>Prints prices - from £5, digital images from £10, digital collections from £50.</p>
		<p>I also make story boards and photo books.</p>
	</div>
</div>

{% endblock %}