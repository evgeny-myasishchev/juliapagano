{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.name}}</h1>
  <form id='contacts' action="index.html" method="post">
    <fieldset id='contacts-container'>
      <legend>I would love to hear from you.</legend>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="control-label">Shoot type</label>
            <select class="form-control" name='shotType'>
              <option value=''>Please select shoot type</option>
              <option>portrait session</option>
              <option>baby or family session</option>
            </select>
            <span class="help-block validation-message">Please select shoot type or please provide additional details</span>
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
        <span class="help-block error-hidden">
          Tell me more about the kind of photos you are looking for. For family session, please send more details about your family, whether you’d like at home or an outdoor shooting (or both), if there is special occasion or activity you’d like photographed.
        </span>
        <span class="help-block validation-message">Please select shoot type or please provide additional details</span>
      </div>
    </fieldset>
    <div class="form-group">
      <button autocomplete='off' id="submit" type="submit" class="btn btn-primary" data-loading-text="Sending...">Send</button>
      <div class="success-container alert alert-success">
        <h4>Your message has been sent successfully!</h4>
        <p>Thank you for you message. I will get back to you shortly.</p>
        <p>
          <button autocomplete='off' id="send-another" type="button" class="btn btn-success">Send another message</button>
        </p>
      </div>
      <div class="failure-container alert alert-danger">
        <h4>Your message has not been sent!</h4>
        <p>I am sorry but your message has not been sent this time. Please try again.</p>
        <p>
          <button autocomplete='off' id="try-again" type="button" class="btn btn-danger">Try again now</button>
        </p>
      </div>
    </div>
  </form>

  You can also reach me on <a href='https://facebook.com/juliapaganophotography'><i class="fa fa-facebook-official" aria-hidden="true"></i> Facebook</a>
  or on <a href="https://www.instagram.com/yuliapagano/"><i class="fa fa-instagram" aria-hidden="true"></i> Instagram</a>
  or directly by email: <a href='mailto:&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;'>&#105;&#110;&#102;&#111;&#064;&#106;&#117;&#108;&#105;&#097;&#112;&#097;&#103;&#097;&#110;&#111;&#046;&#099;&#111;&#046;&#117;&#107;</a>
{% endblock %}

{% block bottomScripts %}
  <script>
    !function($) {
      function toggleValidState(el, isValid) {
        if(isValid) {
          el.removeClass('has-error');
        } else {
          el.addClass('has-error');
        }
      }

      function validateShotType() {
        const isValid = shotType.val() || message.val();
        toggleValidState(shotType.parent('.form-group'), isValid);
        toggleValidState(message.parent('.form-group'), isValid);
        return !!isValid;
      }

      const sendButton = $('#submit')
      const form = $('#contacts');
      const shotType = $('[name=shotType]');
      const message = $('[name=message]');

      $('#send-another').on('click', function() {
        sendButton.button('reset');
        form.removeClass('message-sent');
        shotType.val('');
        message.val('');
      });

      $('#try-again').on('click', function() {
        sendButton.button('reset');
        form.removeClass('message-sending-failed');
        form.submit();
      });

      $(function() {
        $('#contacts').submit(function(event) {
          event.preventDefault();
          const required = form.find('[data-required]');
          let isValid = validateShotType();
          required.each(function(index, el) {
            el = $(el)
            const name = el.data('required');
            const target = el.find('[name=' + name + ']');
            if(isValid) {
              isValid = !!target.val();
            }
            toggleValidState(el, target.val());
          });

          if(!isValid) return;

          sendButton.button('loading');

          $.ajax({
            type : 'POST',
            url : '/contacts',
            data : $(this).serialize()
          })
          .done(function() {
            form.addClass('message-sent');
          })
          .fail(function() {
            form.addClass('message-sending-failed');
          });
        })
      });
    }(jQuery);
  </script>
{% endblock %}
