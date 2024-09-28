async function fetchFundingsByLenderId() {
    const token = localStorage.getItem("jwtToken");
    const id = localStorage.getItem("userId")

    const response = await fetch(`/ApiFunding/GetFundingsByLenderId?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch fundings');
        return;
    }

    const jsonData = await response.json();

    console.log(jsonData);
    if (jsonData.success) {
        populateFundingsTable(jsonData.data)
    } else {
        alert(jsonData.message);
    }
}

async function populateFundingsTable(fundings) {
    const loansHistoryTableBody = document.querySelector("#loansHistoryTable tbody");
    loansHistoryTableBody.innerHTML = "";

    fundings.forEach(funding => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${funding.borrower.name}</td>
          <td>${funding.amount}</td>
          <td>${funding.repaidAmount}</td>
          <td>${funding.balanceAmount}</td>
          <td>${funding.repaidStatus}</td>
          <td>${funding.paidAt}</td>
        `;
        loansHistoryTableBody.appendChild(row);
    });
}

window.onload = fetchFundingsByLenderId;