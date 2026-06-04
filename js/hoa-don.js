// JavaScript cho Hóa đơn thanh toán

// Hằng số
const TAX_RATE = 0.1; // 10% VAT
const DISCOUNT_RATE = 0; // Tỷ lệ giảm giá

// Dữ liệu sản phẩm bắt đầu trống; người dùng phải nhập dữ liệu
let products = [];

/**
 * Định dạng số tiền theo định dạng Việt Nam
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền đã định dạng
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Tính thành tiền cho một sản phẩm
 * @param {number} price - Đơn giá
 * @param {number} quantity - Số lượng
 * @returns {number} - Thành tiền
 */
function calculateLineTotal(price, quantity) {
    return price * quantity;
}

/**
 * Tính tổng tiền hàng
 * @returns {number} - Tổng tiền hàng
 */
function calculateSubtotal() {
    return products.reduce((sum, product) => {
        return sum + calculateLineTotal(product.price, product.quantity);
    }, 0);
}

/**
 * Tính tiền giảm giá
 * @returns {number} - Tiền giảm giá
 */
function calculateDiscount() {
    const subtotal = calculateSubtotal();
    return subtotal * DISCOUNT_RATE;
}

/**
 * Tính tiền thuế VAT
 * @returns {number} - Tiền thuế VAT
 */
function calculateTax() {
    const subtotal = calculateSubtotal();
    const afterDiscount = subtotal - calculateDiscount();
    return afterDiscount * TAX_RATE;
}

/**
 * Tính tổng cộng
 * @returns {number} - Tổng cộng
 */
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
}

/**
 * Cập nhật bảng hóa đơn
 */
function updateInvoiceTable() {
    const tbody = document.querySelector('.invoice-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr class="placeholder-row">
                <td colspan="6">Chưa có sản phẩm. Vui lòng nhập thông tin sản phẩm và bấm "Thêm sản phẩm".</td>
            </tr>
        `;
        return;
    }

    products.forEach((product, index) => {
        const lineTotal = calculateLineTotal(product.price, product.quantity);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>${product.unit}</td>
            <td>${formatCurrency(lineTotal)}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Cập nhật bảng tính tổng
 */
function updateSummary() {
    const summarySection = document.querySelector('.invoice-summary');
    const summaryTable = document.querySelector('.summary-table');
    if (!summarySection || !summaryTable) return;

    if (products.length === 0) {
        summarySection.style.display = 'none';
        return;
    }

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const total = calculateTotal();

    summaryTable.innerHTML = `
        <tr>
            <td class="label">Tổng tiền hàng:</td>
            <td class="amount">${formatCurrency(subtotal)}</td>
        </tr>
        ${discount > 0 ? `
        <tr>
            <td class="label">Giảm giá (${DISCOUNT_RATE * 100}%):</td>
            <td class="amount">-${formatCurrency(discount)}</td>
        </tr>
        ` : ''}
        <tr>
            <td class="label">Thuế VAT (${TAX_RATE * 100}%):</td>
            <td class="amount">${formatCurrency(tax)}</td>
        </tr>
        <tr class="total-row">
            <td class="label"><strong>TỔNG CỘNG:</strong></td>
            <td class="amount"><strong>${formatCurrency(total)}</strong></td>
        </tr>
    `;

    summarySection.style.display = 'flex';
}

/**
 * Thêm sản phẩm mới từ form
 */
function addProductFromForm() {
    const nameInput = document.getElementById('product-name');
    const priceInput = document.getElementById('product-price');
    const quantityInput = document.getElementById('product-quantity');
    const unitInput = document.getElementById('product-unit');

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const quantity = Number(quantityInput.value);
    const unit = unitInput.value.trim();

    if (!name) {
        alert('Vui lòng nhập tên sản phẩm.');
        nameInput.focus();
        return;
    }
    if (!price || price <= 0) {
        alert('Vui lòng nhập đơn giá hợp lệ.');
        priceInput.focus();
        return;
    }
    if (!quantity || quantity <= 0) {
        alert('Vui lòng nhập số lượng hợp lệ.');
        quantityInput.focus();
        return;
    }
    if (!unit) {
        alert('Vui lòng nhập đơn vị tính.');
        unitInput.focus();
        return;
    }

    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    products.push({ id: newId, name, price, quantity, unit });

    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
    unitInput.value = '';
    nameInput.focus();

    updateInvoiceTable();
}

/**
 * Tính hóa đơn khi người dùng đã nhập dữ liệu
 */
function calculateInvoice() {
    if (products.length === 0) {
        alert('Bạn phải nhập ít nhất một sản phẩm trước khi tính hóa đơn.');
        return;
    }
    updateInvoiceTable();
    updateSummary();
}

/**
 * In hóa đơn
 */
function printInvoice() {
    if (products.length === 0) {
        alert('Bạn cần nhập dữ liệu và tính hóa đơn trước khi in.');
        return;
    }
    window.print();
}

/**
 * Xuất hóa đơn dưới dạng PDF (giả lập)
 */
function exportPDF() {
    if (products.length === 0) {
        alert('Bạn cần nhập dữ liệu và tính hóa đơn trước khi xuất PDF.');
        return;
    }
    alert('Chức năng xuất PDF sẽ được triển khai trong tương lai!');
}

/**
 * Khởi tạo ứng dụng khi trang tải xong
 */
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-product-button');
    const calculateButton = document.getElementById('calculate-button');

    if (addButton) {
        addButton.addEventListener('click', addProductFromForm);
    }
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateInvoice);
    }

    updateInvoiceTable();
    updateSummary();
});
