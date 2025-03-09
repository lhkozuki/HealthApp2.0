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

// Função para buscar medicamentos por userId e nome (name opcional conforme Swagger)
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

// Função para filtrar medicamentos por userId (usada com fetchAllMedications)
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
                    <label class="form-label">Data de início: ${new Date(med.startDate).toLocaleDateString('pt-BR')}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Horário de início: ${new Date(med.startDate).toLocaleTimeString('pt-BR')}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">Duração em dias: ${med.treatmentDurationDays || 'N/A'}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label"><a href="#">Acessar bula</a></label>
                </div>
            </form>
        `;
        medicationList.appendChild(medDiv);
    });
};

// Função para carregar os medicamentos do usuário
const loadUserMedications = async (searchTerm = '') => {
    const userId = parseInt(localStorage.getItem('loggedUserId')) || 3;
    let medications;

    if (searchTerm) {
        // Usa o endpoint de busca com o termo
        medications = await searchMedications(userId, searchTerm);
    } else {
        // Lista todos e filtra por userId no frontend
        const allMedications = await fetchAllMedications();
        medications = filterMedicationsByUser(allMedications, userId);
    }

    renderMedications(medications);
};

// Inicialização e eventos
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('lembrete.html')) {
        loadUserMedications(); // Carrega todos os medicamentos do usuário inicialmente

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.trim();
                loadUserMedications(searchTerm);
            });
        }
    }
});

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

// Lógica para create.html
const createForm = document.getElementById('createMedicationForm');
if (createForm && window.location.pathname.includes('create.html')) {
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createForm);
        const userId = parseInt(localStorage.getItem('loggedUserId')) || 3;

        // Combina data e horário em um único startDate
        const date = formData.get('startDate'); // Ex: "2025-03-20"
        const time = formData.get('startTime'); // Ex: "08:00"
        const startDate = new Date(`${date}T${time}:00`).toISOString(); // Ex: "2025-03-20T08:00:00Z"

        const medicationData = {
            name: formData.get('name'),
            dose: formData.get('dose'),
            frequencyHours: parseInt(formData.get('frequencyHours')),
            startDate: startDate,
            treatmentDurationDays: parseInt(formData.get('treatmentDurationDays')),
            userId: userId
        };

        try {
            await createMedication(medicationData);
            alert('Medicamento criado com sucesso!');
            window.location.href = 'lembrete.html'; // Redireciona para a lista
        } catch (error) {
            alert('Erro ao criar medicamento. Verifique os dados e tente novamente.');
        }
    });
}