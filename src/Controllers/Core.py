import os
from PyQt6.QtWidgets import QMainWindow, QVBoxLayout, QWidget, QMenu
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtWebEngineCore import QWebEnginePage, QWebEngineSettings
from PyQt6.QtWebChannel import QWebChannel
from PyQt6.QtCore import QUrl, Qt, QObject, pyqtSlot
from PyQt6.QtGui import QContextMenuEvent

# --- SETUP PATH & IMPORTS ---
current_dir = os.path.dirname(os.path.abspath(__file__))

# Try importing Bridge from src, if not available use internal fallback
try:
    from Controllers.Bridge import Bridge
except ImportError as e:
    print(f"[WARNING] Could not import Bridge: {e}. Using fallback.")
    class FallbackBridge(QObject):
        """
        Fallback Bridge class if src/Controllers/Bridge.py does not exist yet.
        Ensures the application keeps running (base working).
        """
        def __init__(self):
            super().__init__()

        @pyqtSlot(str)
        def log(self, msg):
            print(f"[Bridge Log]: {msg}")
    Bridge = FallbackBridge

# --- CUSTOM WEB ENGINE VIEW ---
class ProtonView(QWebEngineView):
    def __init__(self, parent=None):
        super().__init__(parent)
        
        # OPTION 1: DISABLE RIGHT CLICK COMPLETELY (Easiest & cleanest for App)
        # self.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)

        # OPTION 2: CUSTOM RIGHT CLICK (Only Copy, Paste, Reload - Remove navigation)
        # We leave the default policy, but we override the event below.

    # HANDLE POPUP / NEW WINDOW ISSUES
    def createWindow(self, type):
        # If there is a target="_blank" link, return 'self' to load in the same window
        return self

    # HANDLE RIGHT CLICK CONTENT (Remove Back, Forward, Save Page, etc.)
    def contextMenuEvent(self, a0: QContextMenuEvent):
        # Create custom menu
        menu = QMenu(self)
        
        # Get standard actions from page
        page = self.page()
        if not page:
            return

        action_copy = page.action(QWebEnginePage.WebAction.Copy)
        action_paste = page.action(QWebEnginePage.WebAction.Paste)
        action_cut = page.action(QWebEnginePage.WebAction.Cut)
        action_reload = page.action(QWebEnginePage.WebAction.Reload)

        # Add to menu ONLY if the action is enabled (e.g., text selected for copy)
        if action_cut and action_cut.isEnabled(): menu.addAction(action_cut)
        if action_copy and action_copy.isEnabled(): menu.addAction(action_copy)
        if action_paste and action_paste.isEnabled(): menu.addAction(action_paste)
        
        menu.addSeparator()
        if action_reload:
            menu.addAction(action_reload) # Optional, if you want user to be able to refresh

        # Show menu at mouse cursor position
        menu.exec(a0.globalPos())

# --- MAIN WINDOW ---
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Proton App")
        self.resize(1024, 768)

        # Setup Layout
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)
        self.main_layout.setContentsMargins(0, 0, 0, 0)

        # USE OUR CUSTOM CLASS (Not standard QWebEngineView)
        self.browser = ProtonView()
        
        # Addition: Enable Developer Tools (Inspect element) if debug is needed
        settings = self.browser.settings()
        if settings:
            settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptCanAccessClipboard, True)
            settings.setAttribute(QWebEngineSettings.WebAttribute.LocalStorageEnabled, True)
            settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessRemoteUrls, True)
            settings.setAttribute(QWebEngineSettings.WebAttribute.LocalContentCanAccessFileUrls, True)
        
        # --- FRAMEWORK: PERSISTENT STORAGE ---
        storage_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'storage')
        page = self.browser.page()
        if page:
            profile = page.profile()
            if profile:
                profile.setPersistentStoragePath(storage_path)

        # --- SETUP BRIDGE (FRAMEWORK) ---
        self.channel = QWebChannel()
        self.bridge = Bridge() # Instantiate Controller
        self.channel.registerObject("bridge", self.bridge) # Register with name "bridge"
        if page:
            page.setWebChannel(self.channel)
        # --------------------------------

        self.main_layout.addWidget(self.browser)

        # Load HTML
        current_dir = os.path.dirname(os.path.abspath(__file__))
        html_path = os.path.join(os.path.dirname(current_dir), 'UI', 'index.html')

        if os.path.exists(html_path):
            with open(html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            base_url = QUrl.fromLocalFile(os.path.dirname(html_path) + '/')
            self.browser.setHtml(html_content, base_url)
        else:

            self.browser.setHtml(f"<h1>Error</h1><p>File not found: {html_path}</p>")
