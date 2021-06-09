$(() => {
  $("#btnModalPost").click(() => {
    const user = firebase.auth().currentUser;

    if (user == null) {
      Swal.fire({
        title: "No estas Registrado",
        text: `Debes estar autenticado para añadir un Servicio`,
        icon: "warning",
      });

      $("#btnRegistroPost").attr("id", "btnModalPost");
      return;
    } else {
      $("#tituloNewPost").val("");
      $("#descripcionNewPost").val("");
      $("#linkVideoNewPost").val("");
      $("#btnUploadFile").val("");
      $(".determinate").attr("style", `width: 0%`);
      /*sessionStorage.setItem("imgNewPost", null);*/

      $("#modalPost").modal("show");
    }
  });

  $("#btnRegistroPost").click(() => {
    const post = new Post();

    const user = firebase.auth().currentUser;
    const titulo = $("#tituloNewPost").val();
    const descripcion = $("#descripcionNewPost").val();
    const videoLink = $("#linkVideoNewPost").val();
    const imagenLink =
      sessionStorage.getItem("imgNewPost") == "null"
        ? null
        : sessionStorage.getItem("imgNewPost");

    post
      .crearPost(
        user.uid,
        user.email,
        titulo,
        descripcion,
        imagenLink,
        videoLink
      )
      .then((resp) => {
        // Materialize.toast(`Post creado correctamente`, 2000)
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Post creado correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
        $(".modal").modal("close");
        $("#modalPost").removeClass("show");
      })
      .catch((err) => {
        //  Materialize.toast(`Error => ${err}`, 4000)
      });
  });

  $("#btnUploadFile").on("change", (e) => {
    const file = e.target.files[0];

    const user = firebase.auth().currentUser;

    const post = new Post();
    post.subirImagenPost(file, user.uid);
  });
});
