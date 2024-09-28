﻿async function fetchLoans() {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`/ApiLoan/GetAllLoans?status=${""}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch loans');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        populateLoansTable(jsonData.data)
    } else {
        alert(jsonData.message);
    }
}

async function populateLoansTable(loans) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`/ApiMstUser/GetUserById/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch user data');
    }

    const data = await response.json();

    if (data.success) {
        const user = data.data;

        const loanTableBody = document.querySelector("#loansTable tbody");
        loanTableBody.innerHTML = "";

        loans.forEach(loan => {
            const row = document.createElement("tr");
            const isBalanceValid = user.balance >= loan.amount

            let actionButton = '';
            if (loan.status === "requested" && isBalanceValid) {
                actionButton = `<button class="btn btn-primary btn-sm" onClick="fundingLoan('${loan.loanId}')">Beri Pinjaman</button>`;
            } else if (loan.status === "requested" && !isBalanceValid) {
                actionButton = `<button class="btn btn-danger btn-sm" disabled>Insufficient Balance</button>`;
            } else {
                actionButton = `<button class="btn btn-warning btn-sm" disabled>Loan already funded</button>`;
            }

            row.innerHTML = `
          <td>${loan.user.name}</td>
          <td>${loan.amount}</td>
          <td>25%</td>
          <td>${loan.duration} Bulan</td>
          <td>${loan.status}</td>
          <td>${actionButton}</td>
        `;

            loanTableBody.appendChild(row);
        });
    } else {
        alert(data.message);
    }
    
}

window.onload = fetchLoans;

async function fundingLoan(loanId) {
    const lenderId = localStorage.getItem('userId');

    const reqAddFundingDto = {
        lenderId: lenderId,
        loanId: loanId
    }

    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`/ApiFunding/AddFunding`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddFundingDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add funding');
            }
            return response.json();
        })
        .then(data => {
            alert('funding added successfully');
            fetchLoans();
        })
        .catch(error => {
            alert('Error adding funding: ' + error.message);
        });
}