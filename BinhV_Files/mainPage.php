<?php
    include('mainPageHeader.php');
?>


<?php
    //require functions.php file
    include('functions.php');
      include "db_conn.php";
?>


    <!-- FEATURES CATEGORIES SECTION -->
    <div class = "features">
        <div class="container">
            <h2><b>How are We Different?</b></h2>
            <hr>
            <div class="row">
                <div class="col-3">
                    <i class="fa fa-truck"></i>
                    <p>We deliver your items within 24 hours!</p>
                </div>
                <div class="col-3">
                    <i class="fa fa-archive"></i>
                    <p>Fresh picked from local farms!</p>
                </div>
                <div class="col-3">
                    <i class="fa fa-money" ></i>
                    <p>10% of our earnings are donated to local charity!</p>
                </div>
            </div>

            <div class="row">
                <div class="col-3">
                    <p>We offer free shipping for orders that weigh less than 20lbs!</p>
                </div>
                <div class="col-3">
                    <p>We have most of the grocery items you need!</p>
                </div>
                <div class="col-3">
                    <p>Empowering small local business!</p>
                </div>
            </div>

        </div>


    </div>

    <!-- CATEGORIES SECTION -->
    <div class="categories">

        <div class="small-container">
            <h2> <b>Product Categories </b></h2>
            <hr>
            <div class = "row">
                <div class="col-4">
                    <!-- Fruits -->
                    <a href= "category-Fruits.php"><img src="images/fruit-banana.jpg"></a>
                    <br>
                    <h3> Fruits</h3>
                </div>

                <div class="col-4">
                    <!-- Beverages -->
                   <a href = "category-beverages.php"><img src = "images/beverage-applejuice.jpg"></a>
                    <h3>Beverages</h3>
                </div>

                <div class="col-4">
                    <!-- Vegetables -->
                    <a href = "category-vegetables.php"><img src = "images/vegetable-cabbage.jpg"></a>
                    <h3>Vegetables</h3>
                </div>

                <div class="col-4">
                    <!-- Dairy and Eggs -->
                    <a href = "category-dairy & eggs.php"><img src="images/dairy-eggland.jpg"></a>
                    <h3>Dairy & Eggs</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- TEAM MEMBERS -->
    <div class="team-members">
        <!-- add a carousel possibly -->
        <h2><b>Team Members</b></h2>
        <hr>

        <div class="row">
        <!-- CAROUSEL -->
            <div id="myCarousel" class="carousel slide" data-ride="carousel">
             
                <!-- Wrapper for carousel items -->
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <h3 style="padding-top: 10px;">Elayna Seguin</h3>
                        
                        <div class="carousel-caption">
                          
                          </div>
                    </div>
                    <div class="carousel-item">
                        <h3 style="padding-top: 10px;">Charlyn Lagpacan</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                    <div class="carousel-item">
                       <h3 style="padding-top: 10px;">Caden King</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                    <div class="carousel-item">
                        <h3 style="padding-top: 10px;">Vinh Nguyen</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                    <div class="carousel-item">
                     <h3 style="padding-top: 10px;">Krishna Babani</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                    <div class="carousel-item">
                       <h3 style="padding-top: 10px;">Binh Vu</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                    <div class="carousel-item">
                     <h3 style="padding-top: 10px;">Arlexy Angulo</h3>
                        
                        <div class="carousel-caption">
                          </div>
                    </div>
                </div>
             
            </div>
        </div>

    </div>

    <?php
        include("footer.php");
    ?>
