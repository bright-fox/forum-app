import React from "react";
import PostList from "../PostList";
import "../../stylesheets/index.css";

const HomePage = () => {
  return (
    <div className="ui stackable grid centered">
      <div className="row">
        <div className="ten wide column">
          <PostList />
        </div>

        <div className="ui segment four wide column">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ipsam deserunt dolorem voluptas eveniet corporis
          ratione aspernatur nisi exercitationem ipsum enim quibusdam saepe odio, ducimus laboriosam neque omnis fugit
          dolore. Voluptatibus facere, nulla eligendi ipsum illo tenetur dolore, nobis ducimus fuga doloribus maxime
          asperiores id quos maiores, dolorem ipsa! Porro error fugiat eius suscipit accusantium sequi corporis et
          libero praesentium! Dolore et, libero sit porro fuga suscipit blanditiis reprehenderit distinctio molestias,
          mollitia similique nobis assumenda explicabo. Facere unde placeat sunt nihil ea ipsa eum enim, praesentium rem
          doloremque, impedit non. Nam, nisi perspiciatis, nesciunt velit facilis incidunt repellendus rerum deleniti,
          consequuntur asperiores quia quod eligendi maxime error. Autem blanditiis voluptas totam rem repellendus, ad
          sequi, optio nisi debitis deserunt dolor. Eligendi rerum omnis dicta iste facere cum ex commodi eius
          voluptatum in nulla doloribus ullam ipsa dolorum nihil quam perferendis sequi, repudiandae est dolores illum?
          Deleniti fugit soluta ipsa cum.
        </div>
      </div>
    </div>
  );
};

export default HomePage;
