$(document).ready(function() {
  // load landing page
  landingPage();

  // function for recipe ajax query.
  function getRecipeDetails(queryId) {
    // build query
    var query = sQueryStr + queryId + "/information";
    sSettings.url = query;

    $.ajax(sSettings).done(function(response) {
      console.log(response);
      $("#recipeModalIngredients").empty();
      $("#recipeModalTitle").text(response.title);
      $("#recipeModalImg").attr("src", response.image);
      for (var i = 0; i < response.extendedIngredients.length; i++) {
        $("#recipeModalIngredients").append(
          $("<li>", {
            class: "recipeModalIngredient",
            html: response.extendedIngredients[i].name
          })
        );
        console.log(response.extendedIngredients[i].name);
      }
      $("#recipeModalUrl").attr("href", response.sourceUrl);
    });
  }

  // Get recipe options from selected ingredients
  function getRecipes() {
    // build query
    var query =
      sQueryStr +
      "search?intolerances=gluten&number=" +
      $("#returnsSelect")
        .find(":selected")
        .text() +
      "&cuisine=" +
      sQueryObject.queryCuisine +
      "&type=" +
      sQueryObject.queryCourse +
      "&instructionsRequired=true&query=" +
      sQueryObject.queryIngredients;
    sSettings.url = query;

    $.ajax(sSettings).done(function(response) {
      if (response.totalResults == 0) {
        $("#results").text(
          "Sorry! I couldn't find a gluten free recipe that matched the search terms."
        );
      } else {
        // iterate through results
        for (var i = 0; i < response.results.length; i++) {
          $("#results").append(getRecipeCard(response.results[i]));
        }
      }
    });
  }

  // EVENT HANDLERS
  //$("#recipeFind").on("click", function() {
  $(document).on("click", "#recipeFind", function() {
    $("#root").empty();
    // resultsPage: create results page from template and fill in with ingredients sidebar
    resultsPage(getIngredientsSidebar(sQueryObject.queryIngredients));
    // getRecipes: fill #results div with query results
    getRecipes();
  });

  $("#restaurantFind").on("click", function() {
    $("#root").empty();
    resultsPage(getRestaurantSidebar());
    getRestaurants();
  });

  $(document).on("keypress", "#mainInput", function(e) {
    if (e.which == 13) {
      // add new ingredient to array
      sQueryObject.queryIngredients.push($("#mainInput").val());
      // clear input
      $("#mainInput").val("");
      $("#ingredient-pill-box").empty();
      for (var i = 0; i < sQueryObject.queryIngredients.length; i++) {
        $("#ingredient-pill-box").append(
          $("<div>", {
            class: "ingredient-pill",
            html: sQueryObject.queryIngredients[i]
          })
        );
      }
    }
  });

  $(document).on("click", ".recipeCard", function() {
    $("#results").append(getRecipeModal());
    getRecipeDetails($(this).attr("id"));
    $("#recipeModal").show();
  });
});
