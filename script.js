
let cart = []; // مصفوفة السلة

// دالة لإضافة الباقة
function addPackage() {
    const title = document.getElementById('package-title').value;
    const description = document.getElementById('package-description').value;
    const price = document.getElementById('package-price').value;

    if (title && description && price) {
        getCurrency(price, title, description); // نحدد العملة قبل إضافة الباقة
    } else {
        alert('يرجى تعبئة جميع الحقول.');
    }
}

// دالة للحصول على العملة المحلية من خلال IP الزائر
function getCurrency(price, title, description) {
    fetch('https://ipinfo.io?token=bbe73fe02e73f7')
    .then(response => response.json())
    .then(data => {
        const country = data.country; // تحديد الدولة
        const currency = getCurrencyCode(country); // الحصول على العملة بناءً على الدولة
        convertCurrency(price, currency, (convertedPrice) => {
            addPackageToPage(title, description, convertedPrice, currency); // إضافة الباقة بالعملة المحلية
        });
    });
}

// دالة لتحويل العملة
function convertCurrency(price, currency, callback) {
    const apiKey = '5ef5576514ddfb9929de7197c14cebe9'; // أدخل مفتاح API الخاص بك
    fetch(`https://v6.exchangeratesapi.io/latest?base=USD&symbols=${currency}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[currency];
            const convertedPrice = (price * rate).toFixed(2);
            callback(convertedPrice);
        });
}

// دالة لتحديد العملة بناءً على الدولة
function getCurrencyCode(country) {
    const currencyMapping = {
        'US': 'USD',
        'GB': 'GBP',
        'AE': 'AED',
        // إضافة المزيد من الدول هنا
    };
    return currencyMapping[country] || 'USD'; // إذا لم تكن الدولة معروفة، نستخدم الدولار الأمريكي
}

// دالة لإضافة الباقة إلى الصفحة بعد تحويل العملة
function addPackageToPage(title, description, convertedPrice, currency) {
    const packageDiv = document.createElement('div');
    packageDiv.classList.add('package');
    packageDiv.style.backgroundImage = 'url("https://via.placeholder.com/600x400/000000/ffffff?text=Bounty+Rush+Image")';
    packageDiv.innerHTML = `
        <img src="https://via.placeholder.com/300" alt="باقه اكستريم">
        <h3>${title}</h3>
        <p>${description}</p>
        <p>السعر: ${convertedPrice} ${currency}</p>
        <a href="#" class="button" onclick="addToCart('${title}', ${convertedPrice})">إضافة إلى السلة</a>
    `;
    document.querySelector('.container').appendChild(packageDiv);

    // مسح المدخلات بعد إضافة الباقة
    document.getElementById('package-title').value = '';
    document.getElementById('package-description').value = '';
    document.getElementById('package-price').value = '';
}

// دالة لإضافة الباقة إلى السلة
function addToCart(title, price) {
    cart.push({ title, price });
    updateCart();
}

// دالة لتحديث السلة
function updateCart() {
    const cartButton = document.querySelector('.cart');
    cartButton.textContent = `سلة المشتريات (${cart.length})`;
}

// دالة لعرض السلة
function viewCart() {
    let cartDetails = 'السلة:
';
    cart.forEach(item => {
        cartDetails += `${item.title} - ${item.price} ريال
`;
    });
    alert(cartDetails);
}
