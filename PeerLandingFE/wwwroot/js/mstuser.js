async function fetchUser() {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch("ApiMstUser/GetAllUsers", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        populateUserTable(jsonData.data);
    } else {
        alert(jsonData.message);
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector("#userTable tbody");
    userTableBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.balance}</td>
          <td>
            <button class="btn btn-primary btn-sm" onClick="editUser('${user.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onClick="deleteUser('${user.id}')">Delete</button>
          </td>
        `;
        userTableBody.appendChild(row);
    });
}

window.onload = fetchUser;

async function editUser(id) {
    const token = localStorage.getItem("jwtToken");

    try {
        const response = await fetch(`ApiMstUser/GetUserById/${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        if (data.success) {
            const user = data.data;

            document.getElementById("userName").value = user.name;
            document.getElementById("userRole").value = user.role;
            document.getElementById("userBalance").value = user.balance;

            // For User ID
            document.getElementById("userId").value = id;

            $('#editUserModal').modal('show');
        } else {
            alert('User not found');
        }
    } catch (error) {
        alert('Error fetching user data: ' + error.message);
    }
}

async function updateUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    }
    const token = localStorage.getItem("jwtToken")

    const response = await fetch(`/ApiMstUSer/UpdateUser?id=${id}`, {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqMstUserDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        })
        .then(data => {
            alert('User updated succesfully')
            $('#editUserModal').modal('hide');
            fetchUser();
        })
        .catch(error => {
            alert('Error updating user: ', error.message)
        })
}

async function deleteUser(id) {
    const token = localStorage.getItem("jwtToken");
    const response = await fetch(`/ApiMstUSer/DeleteUser?id=${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.json();
        })
        .then(data => {
            alert('User Deleted Succesfully')
            $('#editUserModal').modal('hide');
            fetchUser();
        })
        .catch(error => {
            alert('Error deleting user: ', error.message)
        })
    
}

async function addUser() {
    const name = document.getElementById('addUserName').value;
    const password = document.getElementById('addUserPassword').value;
    const email = document.getElementById('addUserEmail').value;
    const role = document.getElementById('addUserRole').value;
    const balance = document.getElementById('addUserBalance').value;

    const reqAddMstUserDto = {
        name: name,
        password: password,
        email: email,
        role: role,
        balance: parseFloat(balance)
    }

    const token = localStorage.getItem("jwtToken")
    const response = await fetch(`/ApiMstUSer/AddUser`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddMstUserDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add user');
            }
            return response.json();
        })
        .then(data => {
            alert('User added succesfully')
            $('#addUserModal').modal('hide');
            fetchUser();
        })
        .catch(error => {
            alert('Error adding user: ', error.message)
        })
}

