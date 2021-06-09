class Autenticacion {
  autEmailPass(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified) {
          $("#avatar").attr("src", "imagenes/usuario_auth.png");
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Bienvenido ${result.user.displayName}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          firebase.auth().signOut();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `¡Debes realizar el proceso de verificación!`,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Email inválido",
          text: error.code,
        });
      });
  }

  crearCuentaEmailPass(email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user.updateProfile({
          displayName: nombres,
        });

        const configuracion = {
          url: "http://localhost/public/",
        };

        result.user.sendEmailVerification(configuracion).catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error al enviar el email de verificación",
            text: "error.message",
          });
        });

        firebase.auth().signOut();

        Swal.fire(
          "Usuario Registrado!",
          `Bienvenido ${nombres}, debes realizar el proceso de verificación!`,
          "success"
        );

        $(".modal").modal("hide");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Usuario no Registrado",
          text: error.message,
        });
      });
  }

  authCuentaGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        $("#avatar").attr("src", result.user.photoURL);
        $(".modal").modal("hide");
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Bienvenido ${result.user.displayName}`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: `Error al autenticarse con Google: ${error}`,
          text: "error.message",
        });
      });
  }

  authCuentaFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        $("#avatar").attr("src", result.user.photoURL);
        $(".modal").modal("hide");
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Bienvenido ${result.user.displayName}`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: `Error al autenticarse con Facebook: ${error}`,
          text: "error.message",
        });
      });
  }

  authTwitter() {}
}
