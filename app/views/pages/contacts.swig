{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.name}}</h1>
  <p>
    Thank you for stopping by!
  </p>
  <p>
  You can reach me on Facebook: <a href='https://facebook.com/juliapaganophotography'>facebook.com/juliapaganophotography</a>
  or on Instagram: <a href="https://www.instagram.com/yuliapagano/">@yuliapagano</a>
  </p>
  <fieldset>
    <legend>Online enquiry form</legend>
    <form class="" action="index.html" method="post">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Shoot type</label>
            <select class="form-control">
              <option>Please select shoot type</option>
              <option>portrait session</option>
              <option>baby or family session</option>
            </select>
          </div>
          <div class="form-group">
            <label>Name</label>
            <input class="form-control" placeholder="Tell me your name please" type="text">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" placeholder="Please provide your email" type="email">
          </div>
          <div class="form-group">
            <label>Phone number</label>
            <input class="form-control" placeholder="Please provide your phone number" type="text">
          </div>
          <div class="form-group">
            <label>Postcode</label>
            <input class="form-control" placeholder="Please provide your postcode" type="text">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Additional details</label>
        <textarea class="form-control" rows="3"></textarea>
        <span id="helpBlock" class="help-block">
          Tell me more about the kind of photos you are looking for. For family session, please send more details about your family, whether you’d like at home or an outdoor shooting (or both), if there is special occasion or activity you’d like photographed.
        </span>
      </div>
      <button disabled type="submit" class="btn btn-primary">Submit</button>
    </form>
  </fieldset>
{% endblock %}
