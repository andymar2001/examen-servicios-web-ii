class Post {
  constructor() {
    // TODO inicializar firestore y settings

    this.db = firebase.firestore();
  }

  crearPost(uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    return this.db
      .collection("posts")
      .add({
        uid: uid,
        autor: emailUser,
        titulo: titulo,
        descripcion: descripcion,
        imagenLink: imagenLink,
        videoLink: videoLink,
        imagenLink: imagenLink,
      })
      .then((refDoc) => {
        console.log(`Id del post => ${refDoc.id}`);
        $(".modal").modal("hide");
      })
      .catch((error) => {
        console.error(`Error creando el post => ${error}`);
      });
  }

  consultarTodosPost() {
    this.db.collection(`posts`).onSnapshot((querySnapshot) => {
      $("#posts").empty();
      if (querySnapshot.empty) {
        $("#posts").append(this.obtenerTemplatePostVacio());
      } else {
        querySnapshot.forEach((post) => {
          let postHtml = this.obtenerPostTemplate(
            post.data().autor,
            post.data().titulo,
            post.data().descripcion,
            post.data().videoLink,
            post.data().imagenLink
          );
          $("#posts").append(postHtml);
        });
      }
    });
  }

  consultarPostxUsuario(emailUser) {
    this.db
      .collection(`posts`)
      .where("autor", "==", emailUser)
      .onSnapshot((querySnapshot) => {
        $("#posts").empty();
        if (querySnapshot.empty) {
          $("#posts").append(this.obtenerTemplatePostVacio());
        } else {
          querySnapshot.forEach((post) => {
            let postHtml = this.obtenerPostTemplatexUsuario(
              post.data().autor,
              post.data().titulo,
              post.data().descripcion,
              post.data().imagenLink
            );
            $("#posts").append(postHtml);
          });
        }
      });
  }

  subirImagenPost(file, uid) {
    const refStorage = firebase.storage().ref(`imgsPosts/${uid}/${file.name}`);

    const task = refStorage.post(file);
    task.on(
      "state_changed",
      (snapshot) => {
        const porcentaje =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $(".determinate").attr("style", `width: ${porcentaje}%`);
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: `Error subiendo el archivo ${err.message}`,
          text: "Ha ocurriddo un error mientras subia la imagen",
        });
      },
      () => {
        task.snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            sessionStorage.setItem("imgNewPost", url);
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: `Error obteniendo downloadURL ${err}`,
              text: "Ha ocurriddo al obtener la url de la imagen",
            });
          });
      }
    );
  }

  elimarPost(id) {
    this.db
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Post eliminado`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  obtenerTemplatePostVacio() {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`;
  }

  obtenerPostTemplate(
    autor,
    titulo,
    tituloDescripcion,
    descripcion,
    imagenLink
  ) {
    return ` <div class="col-md-6 content-main" >
     <input id="id" type="hidden">
     <div class="content-sec">                
         <div class="portfolio-container">
             <div class="portfolio-details">
                 <a href="#">
                    <h2>${titulo}</h2>
                 </a>
                 <a href="#">
                    <p>— Autor: ${autor}</p>
                 </a>
             </div> 
             <div>
                 <img  class="img-fluid img-content" src="${imagenLink}" alt="">
             </div>
             
         </div>
         <div>
             <h4>${tituloDescripcion}</h4>
             <p>${descripcion}</p>
         </div>    
     </div>
 </div>
 `;
  }

  obtenerPostTemplatexUsuario(autor, titulo, descripcion, imagenLink) {
    return ` <div class="col-md-6 content-main">
  <div class="content-sec">                
      <div class="portfolio-container">
          <div class="portfolio-details">
              <a href="#">
                 <h2>${titulo}</h2>
              </a>
              <a href="#">
                 <p>— Autor: ${autor}</p>
              </a>
          </div> 
          <div>
              <img  class="img-fluid img-content" src="${imagenLink}" alt="">
          </div>
          
      </div>
      <div>
          <p>${descripcion}</p>
      </div>
      <div class="content-miBoton">
      <button type="button" class="miBoton btn btn-outline-light btn-delete">Eliminar</button>
  </div>
      
  </div>
</div>
`;
  }

  obtenerPostPersonalizado() {}
}
