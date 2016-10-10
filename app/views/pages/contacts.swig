{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.name}}</h1>
  <fieldset>
    <legend>I would love to hear from you.</legend>
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
        </div>
      </div>
      <div class="form-group">
        <label>Additional details</label>
        <textarea class="form-control" rows="3"></textarea>
        <span id="helpBlock" class="help-block">
          Tell me more about the kind of photos you are looking for. For family session, please send more details about your family, whether you’d like at home or an outdoor shooting (or both), if there is special occasion or activity you’d like photographed.
        </span>
      </div>
      <div class="form-group">
        <button disabled type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </fieldset>

  You can also reach me on Facebook: <a href='https://facebook.com/juliapaganophotography'>facebook.com/juliapaganophotography</a>
  or on Instagram: <a href="https://www.instagram.com/yuliapagano/">@yuliapagano</a>
  or directly by email: <a href='mailto:&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;'>&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;</a>
{% endblock %}
