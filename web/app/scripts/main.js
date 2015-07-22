//handlebar helper

Handlebars.registerHelper('trimString50', function(passedString) {
  var theString = passedString.substring(0,50);
  return new Handlebars.SafeString(theString)
});



