from PyQt6.QtCore import QObject, pyqtSlot, pyqtSignal
from PyQt6.QtCore import pyqtProperty  # type: ignore
from .Loggers import Logger

class Bridge(QObject):
    # Define signals
    dataProcessed = pyqtSignal(str)  # Signal emitted when data is processed
    counterChanged = pyqtSignal(int)  # Signal for counter property change

    def __init__(self):
        super().__init__()
        self.logger = Logger()
        self.logger.info("Bridge Controller Initialized")
        self._counter = 0  # Private variable for counter property

    @pyqtSlot(str)
    def log_to_python(self, message):
        """This function is called from JavaScript to log in Python"""
        self.logger.info(f"[JS CLIENT] {message}")
        print(f"Message from UI: {message}")

    @pyqtSlot(result=str)  # type: ignore
    def get_app_info(self):
        """Returns data from Python to JavaScript"""
        return "Proton App Framework v1.0"

    @pyqtSlot(str, result=str)  # type: ignore
    def process_data(self, data):
        """Example data processing: Receive string, return string"""
        processed = f"Processed by Python: {data.upper()}"
        self.dataProcessed.emit(processed)  # Emit signal
        return processed

    @pyqtSlot()
    def increment_counter(self):
        """Increment the counter and emit signal"""
        self.counter += 1

    @pyqtSlot()
    def decrement_counter(self):
        """Decrement the counter and emit signal"""
        self.counter -= 1

    # Property for counter
    def _get_counter(self):
        return self._counter

    def _set_counter(self, value):
        if self._counter != value:
            self._counter = value
            self.counterChanged.emit(self._counter)
            self.logger.info(f"Counter changed to: {self._counter}")

    counter = pyqtProperty(int, fget=_get_counter, fset=_set_counter, notify=counterChanged)