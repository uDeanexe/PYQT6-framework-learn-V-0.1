import sys
import os
from PyQt6.QtWidgets import QApplication
from Controllers.Core import MainWindow

if __name__ == "__main__":

    os.environ["QTWEBENGINE_REMOTE_DEBUGGING_PORT"] = "9222"

    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())