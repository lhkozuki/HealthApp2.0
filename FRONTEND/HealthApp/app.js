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


// Função para registrar um novo usuário
const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        const user = await response.json();
        localStorage.setItem('loggedUser', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        throw error;
    }
};

// Função para login
const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        const user = await response.json();
        localStorage.setItem('loggedUser', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        throw error;
    }
};

// Função para verificar se o usuário está logado
const isUserLoggedIn = () => {
    return !!localStorage.getItem('loggedUser');
};



// Função para logout
const logoutUser = () => {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('editMedicationId');
    window.location.href = 'index.html';
};

// Função para mostrar o conteúdo da página protegida
const showProtectedPageContent = () => {
    document.body.classList.add('visible');
};

// Pré-verificação de autenticação para páginas protegidas
(function () {
    const path = window.location.pathname;
    if (path.includes('create.html') || path.includes('lembrete.html') || path.includes('user.html')) {
        if (!isUserLoggedIn()) {
            window.location.href = 'login.html';
        } else {
            showProtectedPageContent(); // Exibe o conteúdo se autenticado
        }
    }
})();

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

// Função para buscar um medicamento específico por ID
const fetchMedicationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Medications/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar medicamento por ID:', error.message);
        throw error;
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

// Função para atualizar um usuário
const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
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
        medicationList.innerHTML = '<div class="contentlist"><p>Nenhum medicamento encontrado.</p></div>';
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
                <div class="userOptions">
                        <a href="#" class="first-link">Ver Bula</a> |
                        <a href="#" class="edit-link" data-id="${med.id}">Editar</a> |
                        <a href="#" class="delete-link" data-id="${med.id}">Excluir</a>
                </div>
            </form>
        `;
        medicationList.appendChild(medDiv);
    });

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
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    const userId = user.id;
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
    console.log('Editando medicamento com ID:', id);
    localStorage.setItem('editMedicationId', id);
    window.location.href = 'create.html';
};

// Função para excluir um medicamento
const deleteMedicationHandler = async (id) => {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
        try {
            await deleteMedication(id);
            alert('Medicamento excluído com sucesso!');
            loadUserMedications();
        } catch (error) {
            alert('Erro ao excluir medicamento.');
        }
    }
};

// Função para limpar o estado de edição
const resetCreateForm = (form) => {
    console.log('Resetando formulário para modo criação');
    form.querySelector('h2').textContent = 'Criar Lembrete';
    form.querySelector('button[type="submit"]').textContent = 'Adicionar';
    form.reset();
};

// Função para preencher o formulário com dados do medicamento
const populateEditForm = async (form, id) => {
    try {
        console.log('Buscando dados do medicamento ID:', id);
        const med = await fetchMedicationById(id);
        console.log('Dados recebidos:', med);

        form.querySelector('h2').textContent = 'Editar Lembrete';
        form.querySelector('button[type="submit"]').textContent = 'Salvar';
        form.querySelector('[name="name"]').value = med.name || '';
        form.querySelector('[name="dose"]').value = med.dose || '';
        form.querySelector('[name="frequencyHours"]').value = med.frequencyHours || '';
        const startDate = new Date(med.startDate);
        form.querySelector('[name="startDate"]').value = startDate.toISOString().split('T')[0];
        form.querySelector('[name="startTime"]').value = startDate.toTimeString().slice(0, 5);
        form.querySelector('[name="treatmentDurationDays"]').value = med.treatmentDurationDays || '';
    } catch (error) {
        console.error('Erro ao preencher formulário:', error);
        resetCreateForm(form);
    }
};

// Função para renderizar opções do index.html
const renderIndexOptions = () => {
    const userOptions = document.getElementById('userOptions');
    if (!userOptions) return;

    if (isUserLoggedIn()) {
        userOptions.innerHTML = `
            <a href="lembrete.html">Ver Lembretes</a> |
            <a href="user.html" class="perfil-link">Perfil</a> |
            <a href="#" id="logoutLink">Sair</a>
        `;
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }
        const logoutNavLink = document.getElementById('logoutNavLink');
        if (logoutNavLink) {
            logoutNavLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }
    } else {
        userOptions.innerHTML = `
            <a href="login.html">Acessar Conta</a> |
            <a href="register.html">Criar Conta</a>
        `;
    }
};

// Função para renderizar e gerenciar o user.html
const renderUserProfile = () => {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('loggedUser'));
    const userProfile = document.getElementById('userProfile');
    const changeEmailForm = document.getElementById('changeEmailForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const updateEmailForm = document.getElementById('updateEmailForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const logoutLink = document.getElementById('logoutLink');
    const logoutNavLink = document.getElementById('logoutNavLink');

    if (userProfile) {
        userProfile.innerHTML = `
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <div class="userOptions">
                <p><a href="#" id="changeEmailLink">Alterar Email</a> |
                <a href="#" id="changePasswordLink">Alterar Senha</a> |
                <a href="#" id="logoutLink">Sair</a></p>
            </div>
        `;

        document.getElementById('changeEmailLink').addEventListener('click', (event) => {
            event.preventDefault();
            changeEmailForm.style.display = 'block';
            changePasswordForm.style.display = 'none';
        });

        document.getElementById('changePasswordLink').addEventListener('click', (event) => {
            event.preventDefault();
            changePasswordForm.style.display = 'block';
            changeEmailForm.style.display = 'none';
        });

        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }
    }

    if (updateEmailForm) {
        updateEmailForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(updateEmailForm);
            const updatedUser = {
                name: user.name,
                email: formData.get('email'),
                password: user.password
            };

            try {
                const newUserData = await updateUser(user.id, updatedUser);
                localStorage.setItem('loggedUser', JSON.stringify({ ...user, ...newUserData }));
                alert('Email atualizado com sucesso!');
                window.location.reload();
            } catch (error) {
                alert('Erro ao atualizar email.');
            }
        });

        document.getElementById('cancelEmail').addEventListener('click', () => {
            changeEmailForm.style.display = 'none';
        });
    }

    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(updatePasswordForm);
            const updatedUser = {
                name: user.name,
                email: user.email,
                password: formData.get('password')
            };

            try {
                const newUserData = await updateUser(user.id, updatedUser);
                localStorage.setItem('loggedUser', JSON.stringify({ ...user, ...newUserData }));
                alert('Senha atualizada com sucesso!');
                window.location.reload();
            } catch (error) {
                alert('Erro ao atualizar senha.');
            }
        });

        document.getElementById('cancelPassword').addEventListener('click', () => {
            changePasswordForm.style.display = 'none';
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        });
    }

    if (logoutNavLink) {
        logoutNavLink.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        });
    }
};

// Inicialização e eventos
document.addEventListener('DOMContentLoaded', () => {
    // Lógica para register.html
    const registerForm = document.getElementById('registerForm');
    if (registerForm && window.location.pathname.includes('register.html')) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                await registerUser(name, email, password);
                alert('Cadastro realizado com sucesso! Você está logado.');
                window.location.href = 'index.html';
            } catch (error) {
                alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
            }
        });
    }

    
    const logoutNavLink = document.getElementById('logoutNavLink');
        if (logoutNavLink) {
            logoutNavLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }

    // Lógica para login.html
    const loginForm = document.getElementById('loginForm');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                await loginUser(email, password);
                alert('Login realizado com sucesso!');
                window.location.href = 'index.html';
            } catch (error) {
                alert('Erro ao fazer login. Verifique suas credenciais.');
            }
        });
    }

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

        document.querySelector('a[href="user.html"]').addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'user.html';
        });

        const logoutNavLink = document.getElementById('logoutNavLink');
        if (logoutNavLink) {
            logoutNavLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }
    }

 // Lógica para create.html
 const createForm = document.getElementById('createMedicationForm');
 if (createForm && window.location.pathname.includes('create.html')) {
     const editMedicationId = localStorage.getItem('editMedicationId');
     console.log('ID do medicamento para edição:', editMedicationId);
     console.log('Referrer:', document.referrer);

     if (editMedicationId && document.referrer.includes('lembrete.html')) {
         populateEditForm(createForm, editMedicationId);
     } else {
         localStorage.removeItem('editMedicationId');
         resetCreateForm(createForm);
     }

     createForm.addEventListener('submit', async (event) => {
         event.preventDefault();

         const formData = new FormData(createForm);
         const user = JSON.parse(localStorage.getItem('loggedUser'));
         const userId = user.id;
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

     const logoutNavLink = document.getElementById('logoutNavLink');
        if (logoutNavLink) {
            logoutNavLink.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
            });
        }

 }

    // Lógica para index.html
    if (window.location.pathname.includes('index.html')) {
        renderIndexOptions();

        
    }

    // Lógica para user.html
    if (window.location.pathname.includes('user.html')) {
        renderUserProfile();
    }

    // Garantir modo criação nos links de "Criar +"
    document.querySelectorAll('a[href="create.html"]').forEach(link => {
        link.addEventListener('click', (event) => {
            localStorage.removeItem('editMedicationId');
        });
    });
});