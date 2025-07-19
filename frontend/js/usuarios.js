// 📁 ../js/usuarios.js

let usuarios = [];
const API_URL = "http://localhost:4000";

async function cargarAsignaturas() {
  try {
    const res = await fetch(`${API_URL}/api/asignaturas`);
    const asignaturas = await res.json();

    const select = document.getElementById("asignatura");
    select.innerHTML = '<option disabled selected value="">Selecciona una asignatura</option>';

    asignaturas.forEach(asig => {
      const option = document.createElement("option");
      option.value = asig.nombre;
      option.textContent = `${asig.nombre} (${asig.codigo})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Error al cargar asignaturas:", error);
  }
}

async function cargarCentrosEducativos() {
  try {
    const res = await fetch(`${API_URL}/api/centros`);
    const centros = await res.json();

    const select = document.getElementById("centroEducativo");
    select.innerHTML = '<option disabled selected value="">Selecciona un centro</option>';

    centros.forEach(centro => {
      const option = document.createElement("option");
      option.value = centro._id; // ✅ Usar el ID correcto
      option.textContent = centro.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Error al cargar centros educativos:", error);
  }
}

async function verUsuario(id) {
  const usuario = usuarios.find(u => u._id === id);
  if (!usuario) return;

  // Crear el modal si no existe
  if (!document.getElementById("modalVerUsuario")) {
    const modalHTML = `
      <div class="modal fade" id="modalVerUsuario" tabindex="-1" aria-labelledby="modalVerUsuarioLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title" id="modalVerUsuarioLabel">Información del Usuario</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body row g-3" id="datosUsuarioVer">
              <!-- Se llena dinámicamente -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const datos = [
  { label: "Nombre", valor: usuario.nombre },
  { label: "Apellidos", valor: usuario.apellidos },
  { label: "Usuario", valor: usuario.usuario },
  { label: "Correo", valor: usuario.correo },
  { label: "Correo Institucional", valor: usuario.correoInstitucional },
  { label: "Cédula", valor: usuario.cedula },
  { label: "Teléfono", valor: usuario.telefono },
  { label: "Dirección", valor: usuario.direccion },
  { label: "Área", valor: usuario.area },
  { label: "Título Académico", valor: usuario.titulo_academico },
  { label: "Asignatura", valor: usuario.asignatura },
  { label: "Rol", valor: usuario.rol },
  { label: "Departamento", valor: usuario.departamento_id?.nombre || '-' },
  { label: "Centro Educativo", valor: usuario.centroEducativo?.nombre || '-' }
];

  const container = document.getElementById("datosUsuarioVer");
  container.innerHTML = datos.map(d => `
    <div class="col-md-6">
      <label class="form-label fw-semibold">${d.label}</label>
      <input type="text" class="form-control" value="${d.valor || ''}" readonly />
    </div>
  `).join("");

  const modal = new bootstrap.Modal(document.getElementById("modalVerUsuario"));
  modal.show();
}



// 🔁 Cargar departamentos en select (crear o editar)
async function cargarDepartamentosEnSelect(selectId, seleccionado = "") {
  try {
    const res = await fetch(`${API_URL}/api/departamentos`);
    const departamentos = await res.json();

    const select = document.getElementById(selectId);
    select.innerHTML = `<option disabled selected value="">Selecciona un departamento</option>`;

    departamentos.forEach(dep => {
      const option = document.createElement("option");
      option.value = dep._id;
      option.textContent = dep.nombre;
      if (dep._id === seleccionado) option.selected = true;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Error al cargar departamentos:", error);
  }
}

// 🔄 Renderizar usuarios en tabla
function renderizarUsuarios() {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = "";

  usuarios.forEach((usuario, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.usuario}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.departamento_id?.nombre || "-"}</td>
      <td>
  <button class="btn btn-sm btn-info me-1" onclick="verUsuario('${usuario._id}')">Ver</button>
  <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario('${usuario._id}')">Editar</button>
  <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
</td>
    `;

    tbody.appendChild(fila);
  });
}

// 🔄 Obtener usuarios desde el backend
async function cargarUsuariosDesdeDB() {
  try {
    const res = await fetch(`${API_URL}/api/usuarios`);
    const contentType = res.headers.get("content-type");

    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      usuarios = data;
      renderizarUsuarios();
    } else {
      throw new Error("Respuesta no válida del servidor");
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("❌ No se pudieron cargar los usuarios.");
  }
}

// ✅ Crear nuevo usuario
document.getElementById("formCrearUsuario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const datos = {
  nombre: document.getElementById("nombre").value.trim(),
  apellidos: document.getElementById("apellidos").value.trim(),
  usuario: document.getElementById("usuario").value.trim(),
  cedula: document.getElementById("cedula").value.trim(),
  correo: document.getElementById("correo").value.trim(),
  correoInstitucional: document.getElementById("correoInstitucional").value.trim(),
  telefono: document.getElementById("telefono").value.trim(),
  direccion: document.getElementById("direccion").value.trim(),
  area: document.getElementById("area").value.trim(),
  titulo_academico: document.getElementById("titulo").value.trim(),
  asignatura: document.getElementById("asignatura").value.trim(),
  rol: document.getElementById("rol").value,
  contrasena: document.getElementById("contrasena").value,
  departamento_id: document.getElementById("departamento").value,
  centroEducativo: document.getElementById("centroEducativo").value.trim()
};


  if (!datos.nombre || !datos.usuario || !datos.correo || !datos.rol || !datos.contrasena) {
    alert("❌ Por favor completa todos los campos obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Usuario creado correctamente.");
      this.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalNuevoUsuario")).hide();
      cargarUsuariosDesdeDB();
    } else {
      alert("❌ Error: " + (data.error || "No se pudo registrar el usuario."));
    }
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    alert("❌ Error en el servidor al registrar.");
  }
});

// ✅ Cargar departamentos al abrir el modal de creación
document.getElementById("modalNuevoUsuario").addEventListener("show.bs.modal", () => {
  cargarDepartamentosEnSelect("departamento");
});

// ✅ Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (res.ok) {
      alert("🗑️ Usuario eliminado.");
      cargarUsuariosDesdeDB();
    } else {
      alert("❌ No se pudo eliminar: " + (data.error || "Error desconocido"));
    }
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    alert("❌ Error en el servidor.");
  }
}

// ✅ Editar usuario
// ✅ Editar usuario
async function editarUsuario(id) {
  const usuario = usuarios.find(u => u._id === id);
  if (!usuario) return;

  // Crear modal si no existe
  if (!document.getElementById("modalEditarUsuario")) {
    const modalHTML = `
      <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="modalEditarUsuarioLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <form id="formEditarUsuario">
              <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="modalEditarUsuarioLabel">Editar Usuario</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body row g-3">
                <input type="hidden" id="editId">

                <div class="col-md-6">
                  <label for="editNombre" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="editNombre" required>
                </div>
                <div class="col-md-6">
                  <label for="editApellidos" class="form-label">Apellidos</label>
                  <input type="text" class="form-control" id="editApellidos">
                </div>
                <div class="col-md-6">
                  <label for="editUsuario" class="form-label">Usuario</label>
                  <input type="text" class="form-control" id="editUsuario" required>
                </div>
                <div class="col-md-6">
                  <label for="editCedula" class="form-label">Cédula</label>
                  <input type="text" class="form-control" id="editCedula">
                </div>
                <div class="col-md-6">
                  <label for="editCorreo" class="form-label">Correo</label>
                  <input type="email" class="form-control" id="editCorreo" required>
                </div>
                <div class="col-md-6">
                  <label for="editCorreoInst" class="form-label">Correo Institucional</label>
                  <input type="email" class="form-control" id="editCorreoInst">
                </div>
                <div class="col-md-6">
                  <label for="editTelefono" class="form-label">Teléfono</label>
                  <input type="text" class="form-control" id="editTelefono">
                </div>
                <div class="col-md-6">
                  <label for="editDireccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control" id="editDireccion">
                </div>
                <div class="col-md-6">
                  <label for="editArea" class="form-label">Área</label>
                  <input type="text" class="form-control" id="editArea">
                </div>
                <div class="col-md-6">
                  <label for="editTitulo" class="form-label">Título Académico</label>
                  <input type="text" class="form-control" id="editTitulo">
                </div>
                <div class="col-md-6">
                  <label for="editAsignatura" class="form-label">Asignatura</label>
                  <input type="text" class="form-control" id="editAsignatura">
                </div>

                <div class="col-md-6">
                  <label for="editCentroEducativo" class="form-label">Centro Educativo</label>
                  <select class="form-select" id="editCentroEducativo">
                    <option disabled selected value="">Cargando centros...</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label for="editRol" class="form-label">Rol</label>
                  <select class="form-select" id="editRol" required>
                    <option value="Administrador">Administrador</option>
                    <option value="sub-admin">Sub-Administrador</option>
                    <option value="Coordinador">Coordinador</option>
                    <option value="Docente">Docente</option>
                    <option value="Evaluador">Evaluador</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="editDepartamento" class="form-label">Departamento</label>
                  <select class="form-select" id="editDepartamento">
                    <option disabled selected value="">Cargando...</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer mt-4">
                <button type="submit" class="btn btn-success">Guardar Cambios</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Submit del formulario editar
    document.getElementById("formEditarUsuario").addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = document.getElementById("editId").value;

      const datosActualizados = {
        nombre: document.getElementById("editNombre").value.trim(),
        apellidos: document.getElementById("editApellidos").value.trim(),
        usuario: document.getElementById("editUsuario").value.trim(),
        correo: document.getElementById("editCorreo").value.trim(),
        rol: document.getElementById("editRol").value,
        cedula: document.getElementById("editCedula").value.trim(),
        telefono: document.getElementById("editTelefono").value.trim(),
        direccion: document.getElementById("editDireccion").value.trim(),
        titulo_academico: document.getElementById("editTitulo").value.trim(),
        area: document.getElementById("editArea").value.trim(),
        correoInstitucional: document.getElementById("editCorreoInst").value.trim(),
        asignatura: document.getElementById("editAsignatura").value.trim(),
        departamento_id: document.getElementById("editDepartamento").value,
        centroEducativo: document.getElementById("editCentroEducativo").value
      };

      try {
        const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados)
        });

        const data = await res.json();

        if (res.ok) {
          alert("✅ Usuario actualizado.");
          bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
          cargarUsuariosDesdeDB();
        } else {
          alert("❌ Error al actualizar: " + (data.error || "Error desconocido"));
        }
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        alert("❌ Error en el servidor.");
      }
    });
  }

  // Llenar los campos del formulario
  document.getElementById("editId").value = usuario._id;
  document.getElementById("editNombre").value = usuario.nombre || '';
  document.getElementById("editApellidos").value = usuario.apellidos || '';
  document.getElementById("editUsuario").value = usuario.usuario || '';
  document.getElementById("editCedula").value = usuario.cedula || '';
  document.getElementById("editCorreo").value = usuario.correo || '';
  document.getElementById("editCorreoInst").value = usuario.correoInstitucional || '';
  document.getElementById("editTelefono").value = usuario.telefono || '';
  document.getElementById("editDireccion").value = usuario.direccion || '';
  document.getElementById("editTitulo").value = usuario.titulo_academico || '';
  document.getElementById("editArea").value = usuario.area || '';
  document.getElementById("editAsignatura").value = usuario.asignatura || '';
  document.getElementById("editRol").value = usuario.rol || '';

  await cargarDepartamentosEnSelect("editDepartamento", usuario.departamento_id?._id || "");
  await cargarCentrosEnSelect("editCentroEducativo", usuario.centroEducativo?._id || "");


  const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
  modalEditar.show();
}

// Cargar centros educativos en select
async function cargarCentrosEnSelect(selectId, seleccionado = "") {
  try {
    const res = await fetch(`${API_URL}/api/centros`);
    const centros = await res.json();

    const select = document.getElementById(selectId);
    select.innerHTML = `<option disabled selected value="">Selecciona un centro</option>`;

   centros.forEach(centro => {
  const option = document.createElement("option");
  option.value = centro._id; // ✅ Enviamos el ID como se espera en el backend
  option.textContent = centro.nombre;
  if (centro._id === seleccionado) option.selected = true;
  select.appendChild(option);
});

  } catch (error) {
    console.error("❌ Error al cargar centros educativos:", error);
  }
}



// 🔄 Inicializar
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuariosDesdeDB();
  cargarAsignaturas(); // ✅ Agrega esto
  cargarCentrosEducativos(); // ✅ Cargar centros educativos

});

