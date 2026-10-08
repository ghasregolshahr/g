tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#f2ca50",
            "primary-container": "#d4af37",
            "on-primary": "#241a00",
            "surface": "#0c0f17",
            "surface-container": "#151922",
            "surface-container-high": "#1e2330",
            "surface-container-highest": "#282e3f",
            "surface-container-low": "#10141d",
            "surface-container-lowest": "#080a0f",
            "on-surface": "#dfe2ee",
            "on-surface-variant": "#9ba3b8",
            "outline": "#454c5e",
            "error": "#ff6b6b"
          },
          fontFamily: {
            sans: ['Vazirmatn', 'Plus Jakarta Sans', 'sans-serif'],
            display: ['Bodoni Moda', 'serif']
          }
        }
      }
    };

/* ---- original inline script ---- */

// System Constants as strictly required
    const AUTH_USERNAME = "samane8787";
    const AUTH_PASSWORD = "Ss@mm13891389";

    // Application State
    let currentAuthUser = null;
    let registeredProperties = [];
    let currentActiveFilter = "همه";
    let selectedImageBase64 = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

    // MODAL CONTROLS
    function openLoginModal() {
      const modal = document.getElementById('loginModal');
      const userInput = document.getElementById('adminUsernameInput');
      const passInput = document.getElementById('adminPasswordInput');
      const errBox = document.getElementById('loginErrorAlert');

      // Ensure fields are completely empty on open
      userInput.value = '';
      passInput.value = '';
      errBox.classList.add('hidden');

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      userInput.focus();
    }

    function closeLoginModal() {
      const modal = document.getElementById('loginModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    // AUTHENTICATION LOGIC
    function handleLoginSubmit(event) {
      event.preventDefault();
      const userInput = document.getElementById('adminUsernameInput').value.trim();
      const passInput = document.getElementById('adminPasswordInput').value.trim();
      const errBox = document.getElementById('loginErrorAlert');
      const errText = document.getElementById('loginErrorText');

      if (userInput === AUTH_USERNAME && passInput === AUTH_PASSWORD) {
        // Success
        currentAuthUser = userInput;
        errBox.classList.add('hidden');
        closeLoginModal();
        activateAdminView();
      } else {
        // Failure
        errText.textContent = 'نام کاربری یا رمز عبور اشتباه است! لطفا دوباره تلاش کنید.';
        errBox.classList.remove('hidden');
      }
    }

    function activateAdminView() {
      // Toggle Header View
      document.getElementById('headerLoginBtn').classList.add('hidden');
      document.getElementById('headerAdminLogged').classList.remove('hidden');
      document.getElementById('headerAdminLogged').classList.add('flex');

      // Reveal Dashboard Section
      const dash = document.getElementById('adminDashboardSection');
      dash.classList.remove('hidden');
      dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function logoutAdmin() {
      currentAuthUser = null;
      document.getElementById('headerLoginBtn').classList.remove('hidden');
      document.getElementById('headerAdminLogged').classList.add('hidden');
      document.getElementById('headerAdminLogged').classList.remove('flex');
      document.getElementById('adminDashboardSection').classList.add('hidden');
    }

    // IMAGE UPLOAD HANDLER
    function handleImageFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          selectedImageBase64 = evt.target.result;
          document.getElementById('imagePreviewElement').src = selectedImageBase64;
        };
        reader.readAsDataURL(file);
      }
    }

    function setDefaultLuxuryImage() {
      selectedImageBase64 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
      document.getElementById('imagePreviewElement').src = selectedImageBase64;
    }

    // PROPERTY REGISTRATION HANDLER
    function handlePropertySubmit(event) {
      event.preventDefault();

      // Gather form data
      const dealCategory = document.querySelector('input[name="dealCategory"]:checked')?.value || "فروش";
      let propCode = document.getElementById('formPropCode').value.trim();
      if (!propCode) {
        propCode = "QG-" + (Math.floor(100 + Math.random() * 900));
      }
      const price = document.getElementById('formPropPrice').value.trim();
      const address = document.getElementById('formPropAddress').value.trim();
      const details = document.getElementById('formPropDetails').value.trim();
      const rooms = document.getElementById('formPropRooms').value;
      const parking = document.querySelector('input[name="parkingOption"]:checked')?.value || "دارد";
      const yard = document.querySelector('input[name="yardOption"]:checked')?.value || "ندارد";
      const elevator = document.querySelector('input[name="elevatorOption"]:checked')?.value || "دارد";

      const newProperty = {
        id: Date.now(),
        category: dealCategory,
        code: propCode,
        price: price,
        address: address,
        details: details,
        rooms: rooms,
        parking: parking,
        yard: yard,
        elevator: elevator,
        image: selectedImageBase64
      };

      // Push to in-memory list
      registeredProperties.unshift(newProperty);

      // Reset form instantly
      document.getElementById('propertyRegisterForm').reset();
      // Keep sensible defaults
      document.querySelector('input[name="dealCategory"][value="رهن و اجاره"]').checked = true;
      document.getElementById('imagePreviewElement').src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
      selectedImageBase64 = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

      // Show Success Alert
      const alertBox = document.getElementById('formSuccessAlert');
      const alertMsg = document.getElementById('formSuccessMsg');
      alertMsg.textContent = `ملک با کد «${propCode}» و دسته «${dealCategory}» با موفقیت ثبت شد و در ویترین قرار گرفت.`;
      alertBox.classList.remove('hidden');

      setTimeout(() => {
        alertBox.classList.add('hidden');
      }, 5000);

      // Re-render properties
      renderPropertiesList();

      // Smooth scroll to property section to show the new card
      document.getElementById('featured-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // TABS AND FILTERING
    function filterTab(category) {
      currentActiveFilter = category;

      // Update Tab Styles
      const buttons = document.querySelectorAll('.tab-btn');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
          btn.className = "tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary text-on-primary transition-all shadow-sm";
        } else {
          btn.className = "tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container text-on-surface-variant hover:text-white transition-all";
        }
      });

      renderPropertiesList();
    }

    // Delete a property (admins only)
    function deleteProperty(code) {
      if (!currentAuthUser) {
        alert('برای حذف آگهی ابتدا وارد حساب ادمین شوید.');
        return;
      }
      const target = registeredProperties.find(item => String(item.code) === String(code));
      if (!target) {
        alert('آگهی موردنظر پیدا نشد.');
        return;
      }
      if (!confirm(`آیا از حذف آگهی با کد «${code}» مطمئن هستید؟ این کار قابل بازگشت نیست.`)) return;
      registeredProperties = registeredProperties.filter(item => String(item.code) !== String(code));
      renderPropertiesList();
      alert('آگهی با موفقیت حذف شد.');
    }

    // RENDER PROPERTY CARDS OR SHOW EMPTY PLACEHOLDER
    function renderPropertiesList() {
      const placeholder = document.getElementById('emptyPropertiesPlaceholder');
      const grid = document.getElementById('propertiesGrid');

      // Filtered properties
      const filtered = registeredProperties.filter(item => {
        if (currentActiveFilter === "همه") return true;
        return item.category === currentActiveFilter;
      });

      if (filtered.length === 0) {
        // Show empty placeholder
        placeholder.classList.remove('hidden');
        grid.classList.add('hidden');
        grid.innerHTML = '';
        return;
      }

      // Hide empty state, reveal grid
      placeholder.classList.add('hidden');
      grid.classList.remove('hidden');
      grid.innerHTML = '';

      filtered.forEach(item => {
        const card = document.createElement('article');
        card.className = "bg-surface-container rounded-2xl border border-outline/30 overflow-hidden hover:border-primary/50 transition-all flex flex-col group shadow-lg";

        // Badges styling depending on category
        let badgeColor = "bg-primary text-on-primary";
        if (item.category === "رهن و اجاره") badgeColor = "bg-blue-500 text-white";
        if (item.category === "خرید") badgeColor = "bg-emerald-500 text-white";
        if (item.category === "فروش") badgeColor = "bg-amber-500 text-slate-950";

        card.innerHTML = `
          <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container-lowest">
            <img src="${item.image}" alt="${item.details}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
            
            <div class="absolute top-3 right-3 flex items-center gap-2">
              <span class="px-3 py-1 rounded-lg ${badgeColor} text-xs font-bold shadow-md">
                ${item.category}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-primary font-mono text-xs border border-primary/30">
                کد: ${item.code}
              </span>
            </div>

            <div class="absolute bottom-2 right-3 left-3 flex items-center justify-between">
              <span class="text-xs bg-black/70 px-2.5 py-1 rounded-md text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-primary text-xs">bed</span>
                ${item.rooms}
              </span>
            </div>
          </div>

          <div class="p-5 flex flex-col flex-grow justify-between gap-4">
            <div>
              <div class="flex items-center gap-1 text-on-surface-variant text-xs mb-2">
                <span class="material-symbols-outlined text-primary text-sm">location_on</span>
                <span class="line-clamp-1">${item.address}</span>
              </div>
              <p class="text-sm font-semibold text-white line-clamp-2 leading-relaxed">
                ${item.details}
              </p>
            </div>

            <!-- Amenities Badges -->
            <div class="flex flex-wrap items-center gap-2 py-2 border-y border-outline/20 text-xs text-on-surface-variant">
              <span class="flex items-center gap-1 ${item.parking === 'دارد' ? 'text-primary' : 'opacity-40'}">
                <span class="material-symbols-outlined text-sm">local_parking</span>
                <span>پارکینگ: ${item.parking}</span>
              </span>
              <span class="text-outline/40">•</span>
              <span class="flex items-center gap-1 ${item.yard === 'دارد' ? 'text-primary' : 'opacity-40'}">
                <span class="material-symbols-outlined text-sm">yard</span>
                <span>حیاط: ${item.yard}</span>
              </span>
              <span class="text-outline/40">•</span>
              <span class="flex items-center gap-1 ${item.elevator === 'دارد' ? 'text-primary' : 'opacity-40'}">
                <span class="material-symbols-outlined text-sm">elevator</span>
                <span>آسانسور: ${item.elevator}</span>
              </span>
            </div>

            <!-- Price and Contact -->
            <div class="flex items-center justify-between pt-1">
              <div>
                <span class="block text-[11px] text-on-surface-variant">قیمت / شرایط</span>
                <span class="text-sm sm:text-base font-bold text-primary">${item.price}</span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick="deleteProperty('${String(item.code).replace(/'/g, "\\'")}')" class="${currentAuthUser ? 'inline-flex' : 'hidden'} items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors" title="حذف آگهی">
                  <span class="material-symbols-outlined text-base">delete</span>
                  حذف آگهی
                </button>
                <a href="tel:09104784166" class="p-2.5 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary transition-colors flex items-center justify-center border border-primary/20" title="تماس مستقیم">
                  <span class="material-symbols-outlined text-lg">phone_in_talk</span>
                </a>
              </div>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    }

    // INITIALIZATION
    document.addEventListener('DOMContentLoaded', () => {
      // By default no properties exist; empty placeholder will show.
      renderPropertiesList();
    });
