import "./css/animate.css"
import "./css/icomoon.css"
import "./css/bootstrap.css"
import "./css/flexslider.css"
import "./css/style.css"

import fondoBanner from "./images/hero_1.jpeg"
import imagen from "./images/gallery_1.jpeg"

// Plantilla tomada de https://themewagon.com/themes/free-bootstrap-templates-food-restaurant-cafe-websites-design/

export const LandingPage = props => {
  return (
    <div className="LandingPage">

      <header id="fh5co-header" class="fh5co-cover js-fullheight" role="banner"
        style={{
          backgroundImage: `url(${fondoBanner})`,
          height: "522px",
        }}
        data-stellar-background-ratio="0.5"
      >
        <div class="overlay"></div>
        <div class="container">
          <div class="row">
            <div class="col-md-12 text-center">
              <div class="display-t js-fullheight" style={{ height: "522px" }}>
                <div class="display-tc js-fullheight animate-box fadeIn animated-fast"
                  data-animate-effect="fadeIn" style={{ height: "522px" }}
                >
                  <h1>Finca <em>Lolita</em></h1>
                  <h2>Sistema de Control de Asistencias</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div id="fh5co-about" class="fh5co-section">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-md-pull-4 img-wrap animate-box fadeInLeft animated-fast" data-animate-effect="fadeInLeft">
              <img src={imagen} alt="Free Restaurant Bootstrap Website Template by FreeHTML5.co"
              />
            </div>
            <div class="col-md-5 col-md-push-1 animate-box fadeInUp animated-fast">
              <div class="section-heading">
                <h2>The Restaurant</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae neque quisquam at deserunt ab praesentium architecto tempore saepe animi voluptatem molestias, eveniet aut laudantium alias, laboriosam excepturi, et numquam? Atque tempore iure tenetur perspiciatis, aliquam, asperiores aut odio accusamus, unde libero dignissimos quod aliquid neque et illo vero nesciunt. Sunt!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam iure reprehenderit nihil nobis laboriosam beatae assumenda tempore, magni ducimus abentey.</p>
                <p><a href="#" class="btn btn-primary btn-outline">Our History</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer id="fh5co-footer" role="contentinfo" class="fh5co-section">
        <div class="container">
          <div class="row row-pb-md">
            <div class="col-md-4 fh5co-widget">
              <h4>Tasty</h4>
              <p>Facilis ipsum reprehenderit nemo molestias. Aut cum mollitia reprehenderit. Eos cumque dicta adipisci architecto culpa amet.</p>
            </div>
            <div class="col-md-2 col-md-push-1 fh5co-widget">
              <h4>Links</h4>
              <ul class="fh5co-footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Menu</a></li>
                <li><a href="#">Gallery</a></li>
              </ul>
            </div>

            <div class="col-md-2 col-md-push-1 fh5co-widget">
              <h4>Categories</h4>
              <ul class="fh5co-footer-links">
                <li><a href="#">Landing Page</a></li>
                <li><a href="#">Real Estate</a></li>
                <li><a href="#">Personal</a></li>
                <li><a href="#">Business</a></li>
                <li><a href="#">e-Commerce</a></li>
              </ul>
            </div>

            <div class="col-md-4 col-md-push-1 fh5co-widget">
              <h4>Contact Information</h4>
              <ul class="fh5co-footer-links">
                <li>198 West 21th Street, <br /> Suite 721 New York NY 10016</li>
                <li><a href="tel://1234567920">+ 1235 2355 98</a></li>
                <li><a href="mailto:info@yoursite.com">info@yoursite.com</a></li>
                <li><a href="http://https://freehtml5.co">freehtml5.co</a></li>
              </ul>
            </div>

          </div>

          <div class="row copyright">
            <div class="col-md-12 text-center">
              <p>
                <small class="block">© 2016 Free HTML5. All Rights Reserved.</small>
                <small class="block">Designed by <a href="http://freehtml5.co/" target="_blank">FreeHTML5.co</a> Demo Images: <a href="http://unsplash.co/" target="_blank">Unsplash</a></small>
              </p>
              <p>
              </p><ul class="fh5co-social-icons">
                <li><a href="#"><i class="icon-twitter2"></i></a></li>
                <li><a href="#"><i class="icon-facebook2"></i></a></li>
                <li><a href="#"><i class="icon-linkedin2"></i></a></li>
                <li><a href="#"><i class="icon-dribbble2"></i></a></li>
              </ul>
              <p></p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
