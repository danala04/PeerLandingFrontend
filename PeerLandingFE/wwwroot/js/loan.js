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

        let statusClass = '';
        switch (loan.status.toLowerCase()) {
            case 'repaid':
                statusClass = 'badge bg-success';
                break;
            case 'funded':
                statusClass = 'badge bg-warning';
                break;
            default:
                statusClass = 'badge bg-danger';
                break;
        }

        row.innerHTML = `
          <td>${loan.amount}</td>
          <td>${(loan.interestRate * 100).toFixed(2)}%</td>
          <td>${loan.duration} Bulan</td>
          <td><span class="${statusClass}">${loan.status}</span></td>
          <td>            
            ${loan.status === "funded" ? `<button class="btn btn-success btn-sm" onClick="populatePaymentsModal('${loan.loanId}')">Pay</button>` : `<button class="btn btn-primary btn-sm" onClick="">Details</button>`}
          </td>
        `;
        loanTableBody.appendChild(row);
    });
}

async function populatePaymentsModal(loanId) {
    const token = localStorage.getItem("jwtToken");
    console.log(token);

    const response1 = await fetch(`/ApiRepayment/GetRepaymentDetailByLoanId?loanId=${loanId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response1.ok) {
        alert('Failed to fetch repayment');
        return;
    }

    const jsonData1 = await response1.json();
    console.log(jsonData1);

    if (jsonData1.success) {
        console.log(jsonData1.data);
        var repaymentId = jsonData1.data.id;

        const response2 = await fetch(`/ApiMothlyPayment/GetMonthlyPaymentByRepaymentId?repaymentId=${repaymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response2.ok) {
            alert('Failed to fetch payment');
            return;
        }

        const jsonData2 = await response2.json();

        if (jsonData2.success) {
            console.log(jsonData2.data);
            const paymentRows = document.getElementById('paymentRows');
            paymentRows.innerHTML = '';

            let totalAmount = 0;

            jsonData2.data.forEach((payment, index) => {
                const row = document.createElement('tr');
                row.setAttribute('data-payment-id', payment.id);

                const monthCell = document.createElement('td');
                monthCell.textContent = `Bulan ${index + 1}`;

                const amountCell = document.createElement('td');
                amountCell.textContent = `${formatCurrency(payment.amount)}`;

                const payCell = document.createElement('td');
                const checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = payment.status;
                checkBox.disabled = payment.status;

                if (!payment.status) {
                    checkBox.addEventListener('change', function () {
                        if (checkBox.checked) {
                            totalAmount += payment.amount;
                        } else {
                            totalAmount -= payment.amount;
                        }
                        document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
                    });
                }

                payCell.appendChild(checkBox);

                row.appendChild(monthCell);
                row.appendChild(amountCell);
                row.appendChild(payCell);

                paymentRows.appendChild(row);
            });

            document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

            $('#viewPaymentsModal').modal('show');
        } else {
            alert(jsonData2.message);
        }
    } else {
        alert(jsonData1.message);
    }
}



async function submitPayment() {
    const token = localStorage.getItem("jwtToken");
    const selectedPayments = [];

    const paymentRows = document.querySelectorAll('#paymentRows tr');

    paymentRows.forEach(row => {
        const checkBox = row.querySelector('input[type="checkbox"]');

        const paymentId = row.getAttribute('data-payment-id');

        if (checkBox.checked && !checkBox.disabled) {
            selectedPayments.push({
                paymentId: paymentId,
            });
        }
    });

    if (selectedPayments.length === 0) {
        alert('Please select at least one payment to proceed.');
        return;
    }

    const payload = selectedPayments;
    console.log(payload);

    const response = await fetch('/ApiMothlyPayment/PayMonthlyPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert('Payments submitted successfully!');
        $('#viewPaymentsModal').modal('hide');
        fetchLoan();
        location.reload();
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
}

async function addRequestLoan() {
    const amount = document.getElementById('requestLoanAmount').value;
    const bunga = document.getElementById('requestLoanInterest').value;
    const borrowerId = localStorage.getItem("userId");

    const reqAddLoanDto = {
        amount: parseFloat(amount),
        borrowerId: borrowerId,
        interestRate: bunga/100,
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


window.onload = fetchLoan;