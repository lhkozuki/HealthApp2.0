// Lógica do menu
const nav = document.querySelector(".nav");
const btnMenu = document.querySelector(".btn-menu");
const menu = document.querySelector(".menu");

function handleButtonClick(event) {
    if (event.type === "touchstart") event.preventDefault();
    event.stopPropagation();
    nav.classList.toggle("active");
    handleClickOutside(menu, () => {
        nav.classList.remove("active");
        setAria();
    });
    setAria();
}

function handleClickOutside(targetElement, callback) {
    const html = document.documentElement;
    function handleHTMLClick(event) {
        if (!targetElement.contains(event.target)) {
            targetElement.removeAttribute("data-target");
            html.removeEventListener("click", handleHTMLClick);
            html.removeEventListener("touchstart", handleHTMLClick);
            callback();
        }
    }
    if (!targetElement.hasAttribute("data-target")) {
        html.addEventListener("click", handleHTMLClick);
        html.addEventListener("touchstart", handleHTMLClick);
        targetElement.setAttribute("data-target", "");
    }
}

function setAria() {
    const isActive = nav.classList.contains("active");
    btnMenu.setAttribute("aria-expanded", isActive);
    if (isActive) {
        btnMenu.setAttribute("aria-label", "Fechar Menu");
    } else {
        btnMenu.setAttribute("aria-label", "Abrir Menu");
    }
}

btnMenu.addEventListener("click", handleButtonClick);
btnMenu.addEventListener("touchstart", handleButtonClick);

// Configuração da API
const API_BASE_URL = 'http://localhost:5153/api';

// Função para buscar todos os medicamentos
const fetchAllMedications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Medications`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar todos os medicamentos:', error.message);
        return [];
    }
};

// Função para buscar medicamentos por userId e nome
const searchMedications = async (userId, searchTerm = '') => {
    try {
        const url = `${API_BASE_URL}/Medications/${userId}/search${searchTerm ? `?name=${encodeURIComponent(searchTerm)}` : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar medicamentos por nome:', error.message);
        return [];
    }
};

// Função para criar um novo medicamento
const createMedication = async (medicationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Medications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicationData)
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar medicamento:', error.message);
        throw error;
    }
};

// Função para atualizar um medicamento
const updateMedication = async (id, medicationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Medications/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicationData)
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    } catch (error) {
        console.error('Erro ao atualizar medicamento:', error.message);
        throw error;
    }
};

// Função para excluir um medicamento
const deleteMedication = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Medications/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    } catch (error) {
        console.error('Erro ao excluir medicamento:', error.message);
        throw error;
    }
};

// Função para filtrar medicamentos por userId
const filterMedicationsByUser = (medications, userId) => {
    return medications.filter(med => med.userId === userId);
};

// Função para renderizar os medicamentos
const renderMedications = (medications) => {
    const medicationList = document.getElementById('medicationList');
    if (!medicationList) {
        console.warn('Elemento medicationList não encontrado.');
        return;
    }

    medicationList.innerHTML = '';

    if (medications.length === 0) {
        medicationList.innerHTML = '<p>Nenhum medicamento encontrado.</p>';
        return;
    }

    medications.forEach(med => {
        const medDiv = document.createElement('div');
        medDiv.className = 'contentlist';
        medDiv.innerHTML = `
            <form method="POST">
                <input type="hidden" name="id" value="${med.id}" />
                <div class="mb-3">
                    <label class="form-label">Nome do medicamento: ${med.name || 'N/A'}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Dose: ${med.dose || 'N/A'}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Frequência (h): ${med.frequencyHours}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Data de Início: ${new Date(med.startDate).toLocaleDateString('pt-BR')}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Primeiro horário: ${new Date(med.startDate).toLocaleTimeString('pt-BR')}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Duração em dias: ${med.treatmentDurationDays || 'N/A'}</label>
                </div>
                <div class="mb-3">
                    <a href="#" class = "acessar-bula-link">Acessar bula</a>
                    <a href="#" class="edit-link" data-id="${med.id}">Editar</a>
                    <a href="#" class="delete-link" data-id="${med.id}">Excluir</a>
                </div>                
            </form>
        `;
        medicationList.appendChild(medDiv);
    });

    // Adicionar eventos aos links de editar e excluir
    document.querySelectorAll('.edit-link').forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          const id = event.target.getAttribute('data-id');
          editMedication(id);
      });
  });

  document.querySelectorAll('.delete-link').forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          const id = event.target.getAttribute('data-id');
          deleteMedicationHandler(id);
      });
  });
};

// Função para carregar os medicamentos do usuário
const loadUserMedications = async (searchTerm = '') => {
    const userId = parseInt(localStorage.getItem('loggedUserId')) || 3;
    let medications;

    if (searchTerm) {
        medications = await searchMedications(userId, searchTerm);
    } else {
        const allMedications = await fetchAllMedications();
        medications = filterMedicationsByUser(allMedications, userId);
    }

    renderMedications(medications);
};

// Função para editar um medicamento
const editMedication = (id) => {
    localStorage.setItem('editMedicationId', id); // Armazena o ID para edição
    window.location.href = 'create.html'; // Redireciona para o formulário de edição
};

// Função para excluir um medicamento
const deleteMedicationHandler = async (id) => {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
        try {
            await deleteMedication(id);
            alert('Medicamento excluído com sucesso!');
            loadUserMedications(); // Recarrega a lista
        } catch (error) {
            alert('Erro ao excluir medicamento.');
        }
    }
};

// Função para limpar o estado de edição
const resetCreateForm = (form) => {
  form.querySelector('h1').textContent = 'Criar Lembrete';
  form.querySelector('button[type="submit"]').textContent = 'Adicionar';
  form.reset(); // Limpa os campos do formulário
};

// Inicialização e eventos
document.addEventListener('DOMContentLoaded', () => {
  // Lógica para lembrete.html
  if (window.location.pathname.includes('lembrete.html')) {
      loadUserMedications();

      const searchInput = document.getElementById('search-input');
      if (searchInput) {
          searchInput.addEventListener('input', (event) => {
              const searchTerm = event.target.value.trim();
              loadUserMedications(searchTerm);
          });
      }
  }

  // Lógica para create.html (criar e editar)
  const createForm = document.getElementById('createMedicationForm');
  if (createForm && window.location.pathname.includes('create.html')) {
      const editMedicationId = localStorage.getItem('editMedicationId');

      // Se não há editMedicationId ou estamos entrando diretamente, força modo criação
      if (!editMedicationId || !document.referrer.includes('lembrete.html')) {
          localStorage.removeItem('editMedicationId'); // Remove qualquer estado de edição
          resetCreateForm(createForm);
      } else {
          // Modo edição apenas se vier de "Editar" em lembrete.html
          createForm.querySelector('h1').textContent = 'Editar Lembrete';
          createForm.querySelector('button[type="submit"]').textContent = 'Salvar';

          fetch(`${API_BASE_URL}/Medications/${editMedicationId}`)
              .then(response => response.json())
              .then(med => {
                  createForm.querySelector('[name="name"]').value = med.name || '';
                  createForm.querySelector('[name="dose"]').value = med.dose || '';
                  createForm.querySelector('[name="frequencyHours"]').value = med.frequencyHours || '';
                  const startDate = new Date(med.startDate);
                  createForm.querySelector('[name="startDate"]').value = startDate.toISOString().split('T')[0];
                  createForm.querySelector('[name="startTime"]').value = startDate.toTimeString().slice(0, 5);
                  createForm.querySelector('[name="treatmentDurationDays"]').value = med.treatmentDurationDays || '';
              })
              .catch(error => {
                  console.error('Erro ao carregar dados para edição:', error);
                  resetCreateForm(createForm); // Volta para criação se falhar
              });
      }

      createForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const formData = new FormData(createForm);
          const userId = parseInt(localStorage.getItem('loggedUserId')) || 3;
          const date = formData.get('startDate');
          const time = formData.get('startTime');
          const startDate = new Date(`${date}T${time}:00`).toISOString();

          const medicationData = {
              name: formData.get('name'),
              dose: formData.get('dose'),
              frequencyHours: parseInt(formData.get('frequencyHours')),
              startDate: startDate,
              treatmentDurationDays: parseInt(formData.get('treatmentDurationDays')),
              userId: userId
          };

          try {
              if (editMedicationId && document.referrer.includes('lembrete.html')) {
                  await updateMedication(editMedicationId, medicationData);
                  alert('Medicamento atualizado com sucesso!');
                  localStorage.removeItem('editMedicationId');
              } else {
                  await createMedication(medicationData);
                  alert('Medicamento criado com sucesso!');
              }
              window.location.href = 'lembrete.html';
          } catch (error) {
              alert('Erro ao salvar medicamento. Verifique os dados e tente novamente.');
          }
      });
  }

  // Garantir que links de "Criar +" sempre levem ao modo criação
  document.querySelectorAll('a[href="create.html"]').forEach(link => {
      link.addEventListener('click', (event) => {
          localStorage.removeItem('editMedicationId'); // Força modo criação
      });
  });
});