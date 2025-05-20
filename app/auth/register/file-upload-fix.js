// This script fixes the language of file input elements
// to display in English instead of the browser's default language

export function fixFileInputLanguage() {
  // Run after component mount to ensure DOM is ready
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const fileInputs = document.querySelectorAll('input[type="file"]');
      
      fileInputs.forEach(input => {
        // Create a wrapper and hide the original input
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-file-upload';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        
        const parent = input.parentNode;
        parent.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        // Create custom button elements
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'file-upload-button';
        button.innerText = 'Choose File';
        button.style.marginRight = '0.5rem';
        button.style.padding = '0.5rem 1rem';
        button.style.borderRadius = '9999px';
        button.style.border = '0';
        button.style.fontWeight = '600';
        button.style.backgroundColor = 'rgba(16, 188, 105, 0.1)';
        button.style.color = '#10bc69';
        
        const fileNameSpan = document.createElement('span');
        fileNameSpan.className = 'file-name';
        fileNameSpan.innerText = 'No file chosen';
        fileNameSpan.style.color = '#6b7280';
        
        // Add click handler
        button.addEventListener('click', () => {
          input.click();
        });
        
        // Update filename on change
        input.addEventListener('change', () => {
          const fileName = input.files.length > 0 ? 
            input.files[0].name : 
            'No file chosen';
          fileNameSpan.innerText = fileName;
        });
        
        // Hide the original input but keep it functional
        input.style.opacity = '0';
        input.style.position = 'absolute';
        input.style.width = '0.1px';
        input.style.height = '0.1px';
        
        wrapper.appendChild(button);
        wrapper.appendChild(fileNameSpan);
      });
    }, 500);
  }
}
