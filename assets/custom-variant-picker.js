// class CustomVariantPicker extends HTMLElement{
//     constructor(){
//         super();

//         console.log('variant-picker')
//     }
//     get sectionId(){
//         return this.dataset.sectionId
//     }
//     connectedCallback(){
//         this.variantPicker = this.querySelector('select[name=id]');
//         this.variantPicker.addEventListener('change', this.handleChange.bind(this));
//     }
//     handleChange(event){
//         console.log('variant-picker','2')
//         const select = event.currentTarget;
//         const url = `${window.location.pathname}?variant=${select.value}&section_id=${this.sectionId}`;
//         console.log(url)
//         fetch(url)
//         .then((response)=>{
//             return response.text();
//         })
//         .then((html)=>{
//             console.log(html);
//             const tempDiv = document.createElement("div");
//             tempDiv.innerHTML = html;

//             document.querySelector('.custom-product-wrapper').innerHTML = tempDiv.querySelector('.custom-product-wrapper').innerHTML;
//         })
//     }

// }
// customElements.define("custom-variant-picker",CustomVariantPicker)


class CustomVariantPicker extends HTMLElement {
    constructor() {
      super();
    }
  
    get sectionId() {
      return this.dataset.sectionId;
    }
  
    connectedCallback() {
      this.variantPicker = this.querySelectorAll('input[type=radio]');
      this.handleChange = this.handleChange.bind(this)
      this.variantPicker.forEach((selector)=>{
         selector.addEventListener('change',this.handleChange)
      })
    }
    disconnectedCallback(){
        this.variantPicker.forEach((selector)=>{
            selector.removeEventListener('change',this.handleChange)
         })
    }
    handleChange(event) {
        const input = event.currentTarget;
        const wrapper = document.querySelector('.custom-product-wrapper');
      
        // Determine which option changed (Color or Size)
        const optionName = input.getAttribute('name');
      
        // If it's a color change → reload section with new images
        if (optionName.toLowerCase() === 'color') {
          const url = `${window.location.pathname}?variant=${input.value}&section_id=${this.sectionId}`;
      
          fetch(url)
            .then(response => response.text())
            .then(html => {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = html;
      
              const newContent = tempDiv.querySelector('.custom-product-wrapper');
              
              if (newContent) {
                wrapper.innerHTML = newContent.innerHTML;
              }
              const newUrl = new URL(url,window.location.origin);
              newUrl.searchParams.delete('section_id');
              window.history.pushState({},"",newUrl.toString())
            });
      
        } else {
          // If it's a size change → just update hidden input + price, no image reload
          const form = document.querySelector('form[action^="/cart/add"]');
          const hiddenInput = form.querySelector('input[name="id"]');
          hiddenInput.value = input.value;
      
          // Update price dynamically (optional)
        //   const selectedVariant = window?.Shopify?.product?.variants?.find(v => v.id == input.value);
        //   if (selectedVariant) {
        //     const priceEl = document.querySelector('.custom-product-price-box span');
        //     if (priceEl) priceEl.textContent = Shopify.formatMoney(selectedVariant.price);
        //   }
        }
      }
      
  }
  
customElements.define("custom-variant-picker", CustomVariantPicker);
  