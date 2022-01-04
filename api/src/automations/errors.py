class AutomationLoaderException(Exception):
    pass


class InvalidAutomationFile(AutomationLoaderException):
    pass


class FailedDeletion(AutomationLoaderException):
    pass
