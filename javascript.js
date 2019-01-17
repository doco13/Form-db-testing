
$(document).ready(function () {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBpCmiWPAvycd03vRNUfPt-cPMVL-c5q5Y",
      authDomain: "train-manager-test.firebaseapp.com",
      databaseURL: "https://train-manager-test.firebaseio.com",
      projectId: "train-manager-test",
      storageBucket: "train-manager-test.appspot.com",
      messagingSenderId: "14506570153"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Initial Values
    var trainName;
    var destination;
    var frequency;
    var firstTime;


    // Function to get the values from the entry form storage them in variables
    $("#submitBtn").on("click", function (event) {
        event.preventDefault();

        // Assigning the entry values to variables
        trainName = $("#trainName").val().trim();
        destination = $("#trainDestination").val().trim();
        frequency = $("#departureFrequency").val().trim();
        firstTime = $("#firstDeparture").val();

        // Creating fields in the database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });

    });

        // Firebase watcher and Initial loader

        database.ref().on("child_added", function (childSnapshot) {


            // Getting the information from the database
            trainName = childSnapshot.val().trainName;
            destination = childSnapshot.val().destination;
            firstTime = childSnapshot.val().firstTime;
            frequency = childSnapshot.val().frequency;

            var firstTimeMoment = moment(firstTime, "hh:mm");

            // Now moment

            var currentTime = moment();

            var minuteArrival = currentTime.diff(firstTimeMoment, "minutes");
            var minuteLast = minuteArrival % frequency;
            var awayTrain = frequency - minuteLast;

            // Next Arrival
            var nextArrival = currentTime.add(awayTrain, "minutes");
            var arrivalTime = nextArrival.format("HH:mm")

            // Addind values to train schedule table
            $("#resultsTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
                frequency + "</td><td>" + arrivalTime + "</td><td>" + awayTrain + "</td></tr>");

        });

});
