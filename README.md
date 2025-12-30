# Proton App Framework (PyQt6 + HTML/JS)

This is a lightweight framework for building desktop applications using Python (PyQt6) for the backend and HTML/CSS/JavaScript for the frontend (UI). It leverages `QWebEngineView` to render the UI and `QWebChannel` for seamless bidirectional communication.

## Project Structure

- **`src/main.py`**: The application entry point. It initializes the `QApplication`, sets up remote debugging, and launches the main window.
- **`src/Controllers/Core.py`**: Contains the core logic for the main window (`MainWindow`) and the custom browser view (`ProtonView`). It handles:
    - Loading the HTML UI.
    - Setting up the `QWebChannel`.
    - Customizing the context menu (right-click behavior).
    - Managing persistent storage and developer tool settings.
- **`src/Controllers/Bridge.py`**: The communication bridge between Python and JavaScript. It defines:
    - **Slots**: Functions callable from JavaScript (e.g., `log_to_python`, `process_data`).
    - **Signals**: Events sent from Python to JavaScript (e.g., `dataProcessed`, `counterChanged`).
    - **Properties**: Shared state variables (e.g., `counter`).
- **`src/UI/`**: Directory containing the frontend assets (HTML, CSS, JS).

## Requirements

- Python 3.8 or newer.
- PyQt6 and PyQt6-WebEngine.

## Installation & Setup (Download & Import)

1.  **Download Source Code**:
    - Clone this repository or download the ZIP file and extract it to your local machine.

2.  **Import to Text Editor/IDE**:
    - Open the `ProtonFramework` folder using Visual Studio Code, PyCharm, or your favorite editor.

3.  **Navigate to Project Directory**:
    - Open a terminal (Command Prompt or PowerShell).
    - Navigate to the project directory:
    ```bash
    cd d:\python\ProtonFramework
    ```

4.  **Install Dependencies**:
    - Install the required Python libraries:
    ```bash
    pip install PyQt6 PyQt6-WebEngine
    ```

## How to Run

After installation, execute the following command in your terminal to start the application:

```bash
python src/main.py
```

## Fitur Utama


- **Hybrid UI**: Menggunakan teknologi web (HTML5/CSS3) untuk tampilan desktop.
- **Python Bridge**: Komunikasi dua arah antara Python dan JavaScript (Signal/Slot).
- **Custom Context Menu**: Menu klik kanan yang disesuaikan.
