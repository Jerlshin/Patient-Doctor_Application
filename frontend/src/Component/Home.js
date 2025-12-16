import "./styles.css"

export function Home(){
    return(
        <div>
            <header class="header">
        <div class="content">
          <h1><span>Get Quick</span><br />Medical Services</h1>
          <p>
            In today's fast-paced world, access to prompt and efficient medical
            services is of paramount importance. When faced with a medical
            emergency or seeking immediate medical attention, the ability to
            receive quick medical services can significantly impact the outcome
            of a situation.
          </p>
          <button class="btn">Get Services</button>
        </div>
        <div class="image">
          <span class="image__bg"></span>
          <img src="/assets/header-bg.png" alt="header image" />
          <div class="image__content image__content__1">
            <span><i class="ri-user-3-line"></i></span>
            <div class="details">
              <h4>1+</h4>
              <p>Active Clients</p>
            </div>
          </div>
          <div class="image__content image__content__2">
            <ul>
              <li>
                <span><i class="ri-check-line"></i></span>
                Seemless Interface
              </li>
              <li>
                <span><i class="ri-check-line"></i></span>
                Expert Doctors
              </li>
            </ul>
          </div>
        </div>
      </header>
        </div>
    )
}