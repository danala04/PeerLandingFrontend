async function fetchLoan() {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    const response = await fetch(`/ApiLoan/GetAllLoansByUserId?userId=${userId}`, {
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
        populateLoanTable(jsonData.data)
    } else {
        alert(jsonData.message);
    }
}

function populateLoanTable(loans) {
    const loanTableBody = document.querySelector("#loanTable tbody");
    loanTableBody.innerHTML = "";

    loans.forEach(loan => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${loan.amount}</td>
          <td>${(loan.interestRate * 100).toFixed(2)}%</td>
          <td>${loan.duration} Bulan</td>
          <td>${loan.status}</td>
        `;
        loanTableBody.appendChild(row);
    });
}

async function addRequestLoan() {
    const amount = document.getElementById('requestLoanAmount').value;
    const borrowerId = localStorage.getItem("userId");

    const reqAddLoanDto = {
        amount: parseFloat(amount),
        borrowerId: borrowerId,
        interestRate: 0.25,
        duration: 12
    }


    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`/ApiLoan/AddLoanRequest`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan request');
            }
            return response.json();
        })
        .then(data => {
            alert('Loan request added successfully');
            $('#addRequestLoanModal').modal('hide');
            fetchLoan();
        })
        .catch(error => {
            alert('Error adding loan request: ' + error.message);
        });
}



window.onload = fetchLoan;