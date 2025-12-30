# PYQT6-framework-learn-V-0.1 (PyQt6 + HTML/JS)

## Description

This is a lightweight framework for building desktop applications using Python (PyQt6) for the backend and HTML/CSS/JavaScript for the frontend (UI). It leverages `QWebEngineView` to render the UI and `QWebChannel` for seamless bidirectional communication between Python and JavaScript.

## Features

- **Hybrid UI**: Combines the power of web technologies (HTML5, CSS3, JavaScript) with desktop application capabilities for modern, responsive interfaces.
- **Python-JavaScript Bridge**: Enables bidirectional communication using signals and slots, allowing data exchange and event handling between backend and frontend.
- **Custom Context Menu**: Provides a tailored right-click menu for enhanced user interaction.
- **Persistent Storage**: Supports saving application settings and data.
- **Developer Tools**: Includes remote debugging support for easier development and troubleshooting.

## Requirements

- Python 3.8 or newer
- PyQt6 and PyQt6-WebEngine libraries

## Installation

Follow these steps to download, set up, and run the framework on your machine.

### Step 1: Download the Source Code

You have two options to obtain the source code: using Git (recommended for version control and updates) or downloading a ZIP file.

#### Option 1: Clone with Git

Git allows you to easily update the code, contribute changes, and manage versions.

1. **Install Git**: If you don't have Git installed, download it from [git-scm.com](https://git-scm.com/) and follow the installation instructions for your operating system.

2. **Open Terminal**: Launch Command Prompt (Windows), Terminal (macOS/Linux), or PowerShell.

3. **Clone the Repository**:
   ```bash
   git clone https://github.com/uDeanexe/PYQT6-framework-learn-V-0.1.git
   ```

4. **Navigate to Project Directory**:
   ```bash
   cd PYQT6-framework-learn-V-0.1
   ```
   This changes your terminal's working directory to the project folder.

#### Option 2: Download ZIP File

If you prefer not to use Git:

1. Go to the repository page on GitHub: [https://github.com/uDeanexe/PYQT6-framework-learn-V-0.1](https://github.com/uDeanexe/PYQT6-framework-learn-V-0.1).
2. Click the **"Code"** button, then select **"Download ZIP"**.
3. Save the ZIP file to your desired location (e.g., `C:\Users\YourName\Downloads` on Windows or `~/Downloads` on macOS/Linux).
4. Extract the ZIP file using your system's built-in extractor or a tool like 7-Zip.
5. Open the extracted folder (named `PYQT6-framework-learn-V-0.1`) in your file explorer.

### Step 2: Import to Text Editor/IDE

1. Open your preferred code editor or IDE, such as:
   - Visual Studio Code (free and recommended)
   - PyCharm
   - Sublime Text
   - Any text editor with Python support

2. **Open the Project Folder**:
   - In VS Code: Go to File > Open Folder, then select the `PYQT6-framework-learn-V-0.1` directory.
   - In other editors: Use the equivalent "Open Folder" or "Open Directory" option.

3. The project structure should now be visible in your editor's file explorer.

### Step 3: Install Dependencies

1. **Check Python Version**:
   Open a terminal and run:
   ```bash
   python --version
   ```
   or
   ```bash
   python3 --version
   ```
   Ensure it's Python 3.8 or higher. If not, download the latest version from [python.org](https://www.python.org/downloads/).

2. **Install Required Packages**:
   In the terminal, navigate to the project directory (if not already there):
   ```bash
   cd path/to/PYQT6-framework-learn-V-0.1
   ```
   Then install the dependencies:
   ```bash
   pip install PyQt6 PyQt6-WebEngine
   ```
   If you encounter permission issues on Windows, try:
   ```bash
   pip install --user PyQt6 PyQt6-WebEngine
   ```
   Or use a virtual environment (recommended for Python projects):
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   pip install PyQt6 PyQt6-WebEngine
   ```

   If a `requirements.txt` file exists in the project, you can install all dependencies at once:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Running the Application

1. **Open Terminal**: Ensure you're in the project directory (`PYQT6-framework-learn-V-0.1`).

2. **Run the Application**:
   ```bash
   python src/main.py
   ```
   or
   ```bash
   python3 src/main.py
   ```

3. The application window should appear. If it doesn't, check for error messages in the terminal.

### Understanding the Interface

- The UI is rendered using web technologies, so it looks and behaves like a modern web app but runs as a desktop application.
- Interact with the interface as you would with a web page.
- Right-click for the custom context menu.

### Development and Customization

- **Frontend**: Edit files in `src/UI/` (HTML in `index.html`, styles in `css/styles.css`, logic in `js/app.js`).
- **Backend**: Modify Python files in `src/Controllers/` for business logic.
- **Communication**: Use the bridge in `Bridge.py` to send data between Python and JavaScript.
- **Debugging**: The framework supports remote debugging. Check the code for developer tool settings.

### Troubleshooting

- **Import Errors**: Ensure all dependencies are installed correctly.
- **Path Issues**: Make sure you're running commands from the correct directory.
- **Python Version**: Confirm you're using Python 3.8+.
- **Qt Issues**: On some systems, you may need additional Qt dependencies. Refer to PyQt6 documentation.

## Project Structure

- **`src/main.py`**: Entry point that initializes the Qt application and launches the main window.
- **`src/Controllers/Core.py`**: Defines the main window (`MainWindow`) and custom browser view (`ProtonView`). Handles UI loading, web channel setup, context menu, storage, and developer tools.
- **`src/Controllers/Bridge.py`**: Communication layer with slots (callable from JS), signals (events to JS), and properties (shared state).
- **`src/Controllers/Controller.py`**: Additional controller logic (if present).
- **`src/Controllers/DataBase.py`**: Database handling (if applicable).
- **`src/Controllers/Loggers.py`**: Logging utilities.
- **`src/UI/index.html`**: Main HTML file for the frontend.
- **`src/UI/css/styles.css`**: Stylesheets for the UI.
- **`src/UI/js/app.js`**: JavaScript logic for the frontend.
- **`src/UI/js/qwebchannel.js`**: Qt WebChannel JavaScript library.
- **`src/UI/assets/`**: Static assets like images or fonts.
- **`src/UI/components/`**: Reusable UI components.
- **`src/logs/`**: Log files generated by the application.
- **`src/utils/`**: Utility functions and helpers.
- **`requirements.txt`**: List of Python dependencies.
- **`README.md`**: This file.

## Contributing

If you'd like to contribute:
1. Fork the repository on GitHub.
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## License

[Specify license if applicable, e.g., MIT License]

## Support

For issues or questions, open an issue on the GitHub repository or contact the maintainers.
