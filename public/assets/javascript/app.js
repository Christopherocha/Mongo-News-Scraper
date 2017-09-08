  // Whenever someone clicks a p tag
  $(document).on("click", ".note-modal", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {

        // The title of the article
        $("#notes").append("<h4>" + data.title + "</h4>");

        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");

        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");

        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {

          // Place the title of the note in the title input
            for (var i = 0; i < data.note.length; i++){
                
                $("#notes").append("<hr>")
                $("#notes").append("<div><div><p><b>Name: " + data.note[i].name + "</b></p></div><div>" + data.note[i].body + "</div></div>");
                // Place the body of the note in the body textarea
                // $("#bodyinput").val(data.note[i].body);
            }
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {

    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        name: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {

        // Log the response
        console.log(data);

        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  