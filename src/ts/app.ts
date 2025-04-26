// EPUBリーダーの型定義
interface EPUBBook {
  renderTo: (id: string, options: EPUBRenderOptions) => EPUBRendition;
  loaded: {
    navigation: Promise<{ toc: EPUBChapter[] }>;
  };
  ready: Promise<void>;
  locations: {
    generate: (size: number) => Promise<void>;
    total: number;
  };
}

interface EPUBRenderOptions {
  width: string;
  height: string;
  spread: string;
}

interface EPUBRendition {
  display: (href?: string) => void;
  prev: () => void;
  next: () => void;
  on: (event: string, callback: (location: EPUBLocation) => void) => void;
  currentLocation: () => EPUBLocation | null;
}

interface EPUBLocation {
  start: {
    displayed: {
      page: number;
    };
  };
}

interface EPUBChapter {
  label: string;
  href: string;
  subitems?: EPUBChapter[];
}

// メインコード
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const fileInput = document.getElementById("book-file") as HTMLInputElement;
  const viewer = document.getElementById("viewer") as HTMLDivElement;
  const prevButton = document.getElementById("prev") as HTMLButtonElement;
  const nextButton = document.getElementById("next") as HTMLButtonElement;
  const currentPageElement = document.getElementById("current-page") as HTMLSpanElement;
  const tocElement = document.getElementById("toc") as HTMLDivElement;
  const sidebar = document.getElementById("sidebar") as HTMLDivElement;
  const sidebarToggle = document.getElementById("sidebar-toggle") as HTMLDivElement;
  const readerContainer = document.querySelector(".reader-container") as HTMLDivElement;

  // Book instance
  let book: EPUBBook | null = null;
  let rendition: EPUBRendition | null = null;

  // Event listeners
  fileInput.addEventListener("change", openBook);
  prevButton.addEventListener("click", prevPage);
  nextButton.addEventListener("click", nextPage);
  sidebarToggle.addEventListener("click", toggleSidebar);

  // Toggle sidebar function
  function toggleSidebar(): void {
    sidebar.classList.toggle("open");
    sidebarToggle.classList.toggle("open");
    readerContainer.classList.toggle("sidebar-open");
  }

  // Keyboard navigation
  document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (!book) return;

    if (e.key === "ArrowLeft") {
      prevPage();
    } else if (e.key === "ArrowRight") {
      nextPage();
    }
  });

  // Open book when file is selected
  function openBook(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Clear previous book if any
    if (book) {
      book = null;
      rendition = null;
      viewer.innerHTML = "";
      tocElement.innerHTML = "";
    }

    // Create book object
    // ePub関数はwindowオブジェクトに追加されているため、型アサーションが必要
    const ePubWindow = window as unknown as { ePub: (file: File) => EPUBBook };
    book = ePubWindow.ePub(file);

    // Initialize rendition
    rendition = book.renderTo("viewer", {
      width: "100%",
      height: "100%",
      spread: "none",
    });

    // Display the first page
    rendition.display();

    // Update buttons state
    updateButtonState();

    // Load and display table of contents
    book?.loaded.navigation.then((nav) => {
      displayTableOfContents(nav.toc);
    });

    // Track page changes
    rendition?.on("relocated", (location) => {
      const currentPage = location.start.displayed.page;
      const totalPages = book?.locations.total || 0;
      currentPageElement.textContent = `ページ: ${currentPage} / ${totalPages}`;
      updateButtonState();
    });

    // Generate locations for better page navigation
    book?.ready.then(() => {
      book?.locations.generate(1024).then(() => {
        // Update page info once locations are generated
        const currentLocation = rendition?.currentLocation();
        if (currentLocation && book) {
          const currentPage = currentLocation.start.displayed.page;
          const totalPages = book.locations.total;
          currentPageElement.textContent = `ページ: ${currentPage} / ${totalPages}`;
        }
      });
    });
  }

  // Display table of contents
  function displayTableOfContents(toc: EPUBChapter[]): void {
    tocElement.innerHTML = "";

    // forEachの代わりにfor...ofを使用
    for (const chapter of toc) {
      const item = document.createElement("div");
      item.className = "toc-item";
      item.textContent = chapter.label;

      item.addEventListener("click", () => {
        rendition?.display(chapter.href);
      });

      tocElement.appendChild(item);

      // Handle nested chapters if any
      if (chapter.subitems && chapter.subitems.length > 0) {
        const subItems = document.createElement("div");
        subItems.style.paddingLeft = "15px";

        // forEachの代わりにfor...ofを使用
        for (const subChapter of chapter.subitems) {
          const subItem = document.createElement("div");
          subItem.className = "toc-item";
          subItem.textContent = subChapter.label;

          subItem.addEventListener("click", () => {
            rendition?.display(subChapter.href);
          });

          subItems.appendChild(subItem);
        }

        tocElement.appendChild(subItems);
      }
    }
  }

  // Navigate to previous page
  function prevPage(): void {
    if (rendition) {
      rendition.prev();
      updateButtonState();
    }
  }

  // Navigate to next page
  function nextPage(): void {
    if (rendition) {
      rendition.next();
      updateButtonState();
    }
  }

  // Update navigation buttons state
  function updateButtonState(): void {
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
  viewer.innerHTML =
    '<div style="text-align: center; padding: 20px;">EPUBファイルを選択して読書を始めてください。</div>';
});
