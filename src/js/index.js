const API_ENDPOINT = process.env.API_ENDPOINT;
const CATEGORIES_ENDPOINT = `${API_ENDPOINT}/categories`;
const SUBCATEGORIES_ENDPOINT = `${API_ENDPOINT}/subcategories`;

const sltCategory = document.getElementById('category');
const sltSubCategory = document.getElementById('subCategory');
const slcMovementType = document.getElementById('movementType');
const slcPaymentType = document.getElementById('paymentType');
const txtDate = document.getElementById('date');
const txtPrice = document.getElementById('price');
const txtDescription = document.getElementById('description');
const btnSave = document.getElementById('save');

const fetchAPI = async (url) => {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    const response = await fetch(url);
    return response.json();
}

function disableSelects() {
    sltSubCategory.disabled = true;
    slcMovementType.disabled = true;
    btnSave.disabled = true;
}


addEventListener('DOMContentLoaded', async () => {

    disableSelects();

    // Load categories
    let categories = await fetchAPI(CATEGORIES_ENDPOINT);
    if (categories && categories.hasOwnProperty('data') && categories.data.length > 0) {
        categories = categories.data;

        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.bi_id;
            option.textContent = category.vc_category
            sltCategory.appendChild(option);
        });
    }

    // Load Movement Types
    let movementTypes = await fetchAPI(`${API_ENDPOINT}/movementstype`);
    if (movementTypes && movementTypes.hasOwnProperty('data') && movementTypes.data.length >  0) {
        movementTypes = movementTypes.data;

        movementTypes.forEach(movementType => {
            let option = document.createElement('option');
            option.value = movementType.in_id;
            option.textContent = movementType.vc_movement_type
            slcMovementType.appendChild(option);
        });
    }

    // Load Payment Types
    let paymentTypes = await fetchAPI(`${API_ENDPOINT}/paymentstype`);
    if (paymentTypes && paymentTypes.hasOwnProperty('data') && paymentTypes.data.length >  0) {
        paymentTypes = paymentTypes.data;

        paymentTypes.forEach(paymentType => {
            let option = document.createElement('option');
            option.value = paymentType.in_id;
            option.textContent = paymentType.vc_payment_type
            slcPaymentType.appendChild(option);
        });
    }
});


sltCategory.addEventListener('change', async () => {
    const categoryId = sltCategory.value;
    sltSubCategory.innerHTML = null;
    let subCategories = await fetchAPI(`${SUBCATEGORIES_ENDPOINT}?idCategory=${categoryId}`); 

    if (subCategories && subCategories.hasOwnProperty('data') && subCategories.data.length >  0) {
        subCategories = subCategories.data;

        subCategories.forEach(subCategory => {
            let option = document.createElement('option');
            option.value = subCategory.bi_id;
            option.textContent = subCategory.vc_sub_category
            sltSubCategory.appendChild(option);
        });
    }

    sltSubCategory.disabled = false;

    slcMovementType.disabled = false;
});


txtDescription.addEventListener('keyup', () => {
    if ((txtDescription.value.trim()).length > 0) {
        btnSave.disabled = false;
    } else {
        btnSave.disabled = true;
    }
});


btnSave.addEventListener('click', async (e) => {
    e.preventDefault();
    btnSave.textContent = 'Saving...';

    try {

        const data = {
            idCategory: sltCategory.value,
            idSubCategory: sltSubCategory.value,
            idMovementType: slcMovementType.value,
            idPaymentType: slcPaymentType.value,
            date: txtDate.value,
            price: txtPrice.value,
            description: txtDescription.value,
        };

        const response = await fetch(`${API_ENDPOINT}/movements`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.status == 201) {
            const result = await response.json();
            console.log(result);
            alert('Movement created successfully');
            sltCategory.value = 0;
            slcMovementType.value = 0;
            slcPaymentType.value = 0;
            txtDate.value = '';
            txtPrice.value = '';
            txtDescription.value = '';
        }
        
    } catch (error) {
        console.log(error);
    }

    btnSave.textContent = 'Save';
});