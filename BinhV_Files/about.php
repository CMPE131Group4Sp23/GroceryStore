<!DOCTYPE html>
<?php
  session_start();
  include('db_conn.php');
  ?>
<html>
  <head>
    <title>Add Map</title>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKblPBimQUF-jQTgFwwuYXKYTcoG3hbE0&callback=initMap&libraries=&v=weekly"
      defer
    ></script>


    <!-- OWN CSS -->
    <link rel="stylesheet" href="css/style.css">

    <style type="text/css">
      /* Set the size of the div element that contains the map */
      #map {
        height: 300px;
        /* The height is 400 pixels */
        width: 300px;
        /* The width is the width of the web page */
      }
    </style>

  </head>

  <body>
    <?php include('header.php') ?>

    <div class="small-container about-container">
      <h2 class = "about-us"><b>About Us</b></h2>
      <br>
      <hr>
        <div class="row">

          <br><br>
          <hr>
          <hr>
        </div>

      <div class="row">
          <div class="col-2">
              <p>Welcome to Baymart, the website for the San Jose-based OFS supermarket. We aspire to be your go-to place for groceries! 
 We're committed to giving you the finest possible service and products, with a focus on timely delivery, your satisfaction, and the welfare of society.</p>
                <br>
              <p>Founded in 2023, We are a tiny firm that specializes in delivering groceries to your home while upholding the highest standards of quality and freshness.
 By providing you with the most excellent services and fiercely competitive prices, we work to end the monopoly held by a select few grocery store behemoths.
              </p>
                <br>
              <p>We sincerely hope you love our offerings as much as we do! Do not hesitate to contact us if you have any inquiries or suggestions.</p>
                <br>
              <p>Sincerely,</p>
              <p><em>Baymart Team</em></p>
          </div>

          <div class ="col-2">
              <p><b> &nbsp;  &nbsp; &nbsp;   Our location:</b></p>
              <div id="map"></div>
          </div>


      </div>
    </div>

    <?php include('footer.php')?>
  </body>
</html>
