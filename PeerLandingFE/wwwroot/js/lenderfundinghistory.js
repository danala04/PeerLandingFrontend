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
        let repaidStatusClass = '';
        switch (funding.repaidStatus.toLowerCase()) {
            case 'on_repay':
                repaidStatusClass = 'badge bg-danger';
                break;
            default:
                repaidStatusClass = 'badge bg-success';
                break;
        }

        row.innerHTML = `
          <td>${funding.borrower.name}</td>
          <td>${formatCurrency(funding.amount)}</td>
          <td>${formatCurrency(funding.repaidAmount)}</td>
          <td>${formatCurrency(funding.balanceAmount)}</td>
          <td><span class="${repaidStatusClass}">${funding.repaidStatus}</span></td>
          <td>${formatDateTime(funding.paidAt)}</td>
        `;
        loansHistoryTableBody.appendChild(row);
    });

    if (!$.fn.DataTable.isDataTable("#loansHistoryTable")) {
        $('#loansHistoryTable').DataTable({
            "paging": true,
            "ordering": true,
            "info": false,
            "responsive": true,
            "searching": true,
            "autoWidth": false
        });
    } else {
        $('#loansHistoryTable').DataTable().clear().rows.add(loans).draw();
    }
}

function formatCurrency(amount) {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        throw new Error("Invalid amount");
    }

    return numericAmount.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2
    });
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date-time string");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

window.onload = fetchFundingsByLenderId;