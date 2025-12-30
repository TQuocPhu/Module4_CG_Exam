const API_URL = "http://localhost:2634/api/products";

let currentPage = 0;

/* =========================
   LOAD KHI TRANG ĐƯỢC MỞ
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    if (document.getElementById("productBody")) {
        loadProducts();
    }
});

/* =========================
   LOAD DANH MỤC
========================= */
function loadCategories() {
    axios.get(API_URL + "/categories")
        .then(res => {
            let html = '<option value="">-- Tất cả --</option>';
            res.data.forEach(c => {
                html += `<option value="${c.id}">${c.name}</option>`;
            });

            if (document.getElementById("searchCategory")) {
                document.getElementById("searchCategory").innerHTML = html;
            }

            if (document.getElementById("category")) {
                document.getElementById("category").innerHTML =
                    '<option value="">-- Chọn loại --</option>' + html;
            }
        });
}

/* =========================
   LOAD SẢN PHẨM + TÌM KIẾM
========================= */
function loadProducts(page = 0) {
    currentPage = page;

    const params = {
        page: page,
        name: document.getElementById("searchName")?.value || null,
        price: document.getElementById("searchPrice")?.value || null,
        categoryId: document.getElementById("searchCategory")?.value || null
    };

    axios.get(API_URL, { params })
        .then(res => {
            renderTable(res.data.content);
            renderPagination(res.data);
        });
}

/* =========================
   HIỂN THỊ TABLE
========================= */
function renderTable(data) {
    let html = "";

    if (data.length === 0) {
        html = `<tr><td colspan="6" class="text-center">Không có dữ liệu</td></tr>`;
    } else {
        data.forEach((p, index) => {
            html += `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">
                        <input type="checkbox" class="chkItem" value="${p.id}">
                    </td>
                    <td>${p.name}</td>
                    <td>${p.price.toLocaleString()}</td>
                    <td>${p.category.name}</td>
                    <td>${p.status || ""}</td>
                </tr>
            `;
        });
    }

    document.getElementById("productBody").innerHTML = html;

    // Check all
    const checkAll = document.getElementById("checkAll");
    if (checkAll) {
        checkAll.onclick = () => {
            document.querySelectorAll(".chkItem")
                .forEach(cb => cb.checked = checkAll.checked);
        };
    }
}

/* =========================
   PHÂN TRANG
========================= */
function renderPagination(page) {
    let html = "";

    if (page.totalPages > 1) {
        if (!page.first) {
            html += `
                <li class="page-item">
                    <a class="page-link" onclick="loadProducts(${page.number - 1})">«</a>
                </li>
            `;
        }

        for (let i = 0; i < page.totalPages; i++) {
            html += `
                <li class="page-item ${i === page.number ? "active" : ""}">
                    <a class="page-link" onclick="loadProducts(${i})">${i + 1}</a>
                </li>
            `;
        }

        if (!page.last) {
            html += `
                <li class="page-item">
                    <a class="page-link" onclick="loadProducts(${page.number + 1})">»</a>
                </li>
            `;
        }
    }

    document.getElementById("pagination").innerHTML = html;
}

/* =========================
   RESET TÌM KIẾM
========================= */
function resetSearch() {
    document.getElementById("searchName").value = "";
    document.getElementById("searchPrice").value = "";
    document.getElementById("searchCategory").value = "";
    loadProducts(0);
}

/* =========================
   XÓA NHIỀU
========================= */
function deleteSelected() {
    const ids = Array.from(document.querySelectorAll(".chkItem:checked"))
        .map(cb => cb.value);

    if (ids.length === 0) {
        alert("Vui lòng chọn sản phẩm cần xóa");
        return;
    }

    if (confirm("Bạn có muốn xóa tất cả sản phẩm đã chọn?")) {
        axios.delete(API_URL, { data: ids })
            .then(() => {
                alert("Xóa thành công");
                loadProducts(currentPage);
            });
    }
}

/* =========================
   THÊM SẢN PHẨM
========================= */
function addProduct() {
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value;
    const categoryId = document.getElementById("category").value;
    const status = document.getElementById("status").value;

    let valid = true;

    if (!name) {
        showError("errName", "Tên sản phẩm không được để trống");
        valid = false;
    } else if (name.length < 5 || name.length > 50) {
        showError("errName", "Tên sản phẩm từ 5 đến 50 ký tự");
        valid = false;
    }

    if (!price) {
        showError("errPrice", "Giá không được để trống");
        valid = false;
    } else if (price < 100000) {
        showError("errPrice", "Giá tối thiểu là 100.000 VND");
        valid = false;
    }

    if (!categoryId) {
        showError("errCategory", "Vui lòng chọn loại sản phẩm");
        valid = false;
    }

    if (!valid) return;

    const product = {
        name: name,
        price: price,
        status: status,
        category: { id: categoryId }
    };

    axios.post(API_URL, product)
        .then(() => {
            alert("Thêm sản phẩm thành công");
            window.location.href = "index.html";
        })
        .catch(err => {
            alert(err.response?.data || "Lỗi thêm sản phẩm");
        });
}

/* =========================
   HỖ TRỢ VALIDATE
========================= */
function showError(id, msg) {
    document.getElementById(id).innerText = msg;
}

function clearErrors() {
    ["errName", "errPrice", "errCategory"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "";
        });
}
