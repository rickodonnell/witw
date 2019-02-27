(function($) {

  const locationsUrl = 'data/locations.json';
  const questionsUrl = 'data/questions.json';

  let puzzleTemplate, locationButtonsTemplate;
  let locations, questions;
  let currentQuestion, currentQuestionIdx = 0;
  let currentLocation, currentLocationOptions;

  const fetchJSON = (url) => {
    return new Promise((resolve, reject) => {
      $.getJSON(url)
        .done((json) => resolve(json))
        .fail((xhr, status, err) => reject(status + err.message));
    });
  };

  let id = 0;
  const augmentLocations = (locs, parents) => {
    locs.forEach((loc) => {
      loc.id = ++id;
      loc.parents = parents;
      if (loc.children) {
        augmentLocations(loc.children, parents.concat(loc.id));
      }
    });
  };

  const getNewQuestion = (choice) => {
    if (choice === 'Previous') {
      currentQuestionIdx = (currentQuestionIdx - 1 + questions.length) % questions.length;
    } else if (choice === 'Next') {
      currentQuestionIdx = (currentQuestionIdx + 1) % questions.length;
    } else {
      currentQuestionIdx = Math.floor(Math.random() * questions.length);
    }
    currentQuestion = questions[currentQuestionIdx];
  };

  const findLocation = (locArr, locName) => {
    locArr.forEach((loc) => {
      if (loc.name === locName) {
        currentLocation = loc;
      } else if (loc.children) {
        findLocation(loc.children, locName);
      }
    });
  };

  window.witw = {

    initTemplates: function() {
      puzzleTemplate = Handlebars.compile($('#puzzleTemplate').html());
      locationButtonsTemplate = Handlebars.compile($('#locationButtonsTemplate').html());
    },

    showFirstPuzzle: function() {
      Promise.all([
        fetchJSON(locationsUrl),
        fetchJSON(questionsUrl)
      ]).then((data) => {
        locations = data[0];
        questions = data[1];
        augmentLocations(locations, []);
        this.renderNextPuzzle();
      });
    },

    renderNextPuzzle: function(chooseMethod) {
      getNewQuestion(chooseMethod);
      findLocation(locations, currentQuestion.location.name);
      currentLocationOptions = locations;
      $('#correctGuess').hide();
      $('#guesses ol.breadcrumb').empty().addClass('invisible');
      $('#puzzle').html(puzzleTemplate(currentQuestion));
      $('#locationButtons').html(locationButtonsTemplate({ locations }));
    },

    guessLocation: function(elId, locName) {
      const id = parseInt(elId.substr(6));
      if (currentLocation.id === id) { // they found it
        $('#correctGuess').show();
        $('#guesses ol.breadcrumb').removeClass('invisible').append($(`<li class="breadcrumb-item">${locName}</li>`));
        $('#locationButtons').empty();
        // TODO - change "reload button" to "load new" or put it in the alert or something
      } else if (currentLocation.parents.includes(id)) { // they are on the path
        $('#guesses ol.breadcrumb').removeClass('invisible').append($(`<li class="breadcrumb-item">${locName}</li>`));
        const guessedLoc = currentLocationOptions.find(l => l.id === id);
        currentLocationOptions = guessedLoc.children;
        $('#locationButtons').empty().html(locationButtonsTemplate({ locations: currentLocationOptions }));
      } else { // they're wrong
        $(`#${elId}`).removeClass("btn-primary").addClass("btn-danger");
      }
    }

  };


})(jQuery);