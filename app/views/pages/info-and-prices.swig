{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.name}}</h1>
  <div class="row">
    <div class="col-md-6">
      <div class="row">
        {% for price in currentPage.prices %}
        <div class="col-md-12">
          <h3>{{ price.title }}</h3>
          <p>{{ price.fee }}</p>
          {% for image in photosets[price.photosetId].items %}
            <a data-lightbox="{{price.photosetId}}"
               href="{{image.sizes['Original'].source}}"
               class="thumbnail inline-block"
               title="{{image.title}}">
                <img src="{{image.sizes['Large Square'].source}}" alt="{{image.title}}">
            </a>
          {% endfor %}
          {% for description in price.description %}
          <p>{{ description }}</p>
          {% endfor %}
        </div>
        {% endfor %}
      </div>
    </div>
    <div class="col-md-6">
      <div>
        <p><h3>Extras</h3></p>
        <p>Additional packages of prints and digital images are available with each session, please contact me for more info.</p>
        <div class="panel panel-default">
          <ul class="list-group">
            <li class="list-group-item">Unmounted prints - from £5</li>
            <li class="list-group-item">Photobooks - from £80</li>
            <li class="list-group-item">Digital images and collections - from £20</li>
          </ul>
        </div>
      </div>
      <div>
        <p>
          <h3>What happens after the session</h3>
        </p>
        <p>
          I carefully select and edit your images and prepare your online gallery for you to see. About two weeks after your session you will receive the access information to your online gallery. It can be shared with your family and friends if you wish, and it will be available to you for three weeks to decide which prints and other products you would like to order.
        </p>
      </div>
      <div class='well'>
        All session fees include pre-shoot consultation, my time on location and the time it takes to edit your images; online gallery to view your images. Half of the session fee should be paid at the time of booking to secure your place, the other half at the day of photo session or when ordering prints.
      </div>
    </div>
  </div>
{% endblock %}
