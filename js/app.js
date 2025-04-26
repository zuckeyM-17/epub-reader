document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const fileInput = document.getElementById('book-file');
    const viewer = document.getElementById('viewer');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const currentPageElement = document.getElementById('current-page');
    const tocElement = document.getElementById('toc');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const readerContainer = document.querySelector('.reader-container');
    
    // Book instance
    let book = null;
    let rendition = null;
    
    // Event listeners
    fileInput.addEventListener('change', openBook);
    prevButton.addEventListener('click', prevPage);
    nextButton.addEventListener('click', nextPage);
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Toggle sidebar function
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarToggle.classList.toggle('open');
        readerContainer.classList.toggle('sidebar-open');
    }
    
    // Keyboard navigation
    document.addEventListener('keyup', function(e) {
        if (!book) return;
        
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    });
    
    // Open book when file is selected
    function openBook(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Clear previous book if any
        if (book) {
            book = null;
            rendition = null;
            viewer.innerHTML = '';
            tocElement.innerHTML = '';
        }
        
        // Create book object
        book = ePub(file);
        
        // Initialize rendition
        rendition = book.renderTo('viewer', {
            width: '100%',
            height: '100%',
            spread: 'none'
        });
        
        // Display the first page
        rendition.display();
        
        // Update buttons state
        updateButtonState();
        
        // Load and display table of contents
        book.loaded.navigation.then(function(toc) {
            displayTableOfContents(toc.toc);
        });
        
        // Track page changes
        rendition.on('relocated', function(location) {
            const currentPage = location.start.displayed.page;
            const totalPages = book.locations.total;
            currentPageElement.textContent = `ページ: ${currentPage} / ${totalPages}`;
            updateButtonState();
        });
        
        // Generate locations for better page navigation
        book.ready.then(() => {
            book.locations.generate(1024).then(() => {
                // Update page info once locations are generated
                const currentLocation = rendition.currentLocation();
                if (currentLocation) {
                    const currentPage = currentLocation.start.displayed.page;
                    const totalPages = book.locations.total;
                    currentPageElement.textContent = `ページ: ${currentPage} / ${totalPages}`;
                }
            });
        });
    }
    
    // Display table of contents
    function displayTableOfContents(toc) {
        tocElement.innerHTML = '';
        
        toc.forEach(function(chapter) {
            const item = document.createElement('div');
            item.className = 'toc-item';
            item.textContent = chapter.label;
            
            item.addEventListener('click', function() {
                rendition.display(chapter.href);
            });
            
            tocElement.appendChild(item);
            
            // Handle nested chapters if any
            if (chapter.subitems && chapter.subitems.length > 0) {
                const subItems = document.createElement('div');
                subItems.style.paddingLeft = '15px';
                
                chapter.subitems.forEach(function(subChapter) {
                    const subItem = document.createElement('div');
                    subItem.className = 'toc-item';
                    subItem.textContent = subChapter.label;
                    
                    subItem.addEventListener('click', function() {
                        rendition.display(subChapter.href);
                    });
                    
                    subItems.appendChild(subItem);
                });
                
                tocElement.appendChild(subItems);
            }
        });
    }
    
    // Navigate to previous page
    function prevPage() {
        if (rendition) {
            rendition.prev();
            updateButtonState();
        }
    }
    
    // Navigate to next page
    function nextPage() {
        if (rendition) {
            rendition.next();
            updateButtonState();
        }
    }
    
    // Update navigation buttons state
    function updateButtonState() {
        if (!book || !rendition) {
            prevButton.disabled = true;
            nextButton.disabled = true;
            return;
        }
        
        // This is a simplified approach - epub.js doesn't provide a direct way to check if we're at the start/end
        // For a more accurate implementation, you'd need to track the current location and compare with book bounds
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
    
    // Display initial message
    viewer.innerHTML = '<div style="text-align: center; padding: 20px;">EPUBファイルを選択して読書を始めてください。</div>';
});
