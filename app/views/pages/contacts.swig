{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.name}}</h1>
  <fieldset>
    <legend>I would love to hear from you.</legend>
    <form id='contacts' class="" action="index.html" method="post">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="control-label">Shoot type</label>
            <select class="form-control" name='shotType'>
              <option value=''>Please select shoot type</option>
              <option>portrait session</option>
              <option>baby or family session</option>
            </select>
          </div>
          <div class="form-group" data-required='name'>
            <label class="control-label">Name</label>
            <input class="form-control" placeholder="Tell me your name please" type="text" name='name'>
            <span class="help-block validation-message">Please provide your name</span>
          </div>
          <div class="form-group" data-required='email'>
            <label class="control-label">Email</label>
            <input class="form-control" placeholder="Please provide your email" type="email" name='email'>
            <span class="help-block validation-message">Please provide your email address</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">Additional details</label>
        <textarea class="form-control" rows="3" name="message"></textarea>
        <span class="help-block">
          Tell me more about the kind of photos you are looking for. For family session, please send more details about your family, whether you’d like at home or an outdoor shooting (or both), if there is special occasion or activity you’d like photographed.
        </span>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </fieldset>

  You can also reach me on Facebook: <a href='https://facebook.com/juliapaganophotography'>facebook.com/juliapaganophotography</a>
  or on Instagram: <a href="https://www.instagram.com/yuliapagano/">@yuliapagano</a>
  or directly by email: <a href='mailto:&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;'>&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;</a>
{% endblock %}

{% block bottomScripts %}
  <script>
    function toggleValidState(el, isValid) {
      if(isValid) {
        el.removeClass('has-error');
      } else {
        el.addClass('has-error');
      }
    }
    
    !function($) {
      $(function() {
        $('#contacts').submit(function(event) {
          event.preventDefault();
          
          const form = $(this);
          const required = form.find('[data-required]');
          let isValid = false;
          required.each(function(index, el) {
            el = $(el)
            const name = el.data('required');
            const target = el.find('[name=' + name + ']');
            isValid = !!target.val();
            toggleValidState(el, target.val());
          });
          
          $.ajax({
            type : 'POST',
            url : '/contacts',
            data : $(this).serialize()
          })
          .done(function() {
            console.log('email sent');
          })
          .fail(function() {
            console.log('Failed to send email.');
          });
        })
      });
    }(jQuery);
  </script>
{% endblock %}
