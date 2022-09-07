class AutomationLoaderException(Exception):
    def __init__(self, *args: object, **kwargs) -> None:
        super().__init__(
            "".join(map(str, args)) + ",".join((f"{k}={v}" for k, v in kwargs.items())),
        )


class AttemptingToOverwriteAnIncompatibleFileError(AutomationLoaderException):
    pass


class InvalidAutomationFile(AutomationLoaderException):
    pass


class FailedDeletion(AutomationLoaderException):
    pass


class InvalidPackage(AutomationLoaderException):
    pass


class DBError(Exception):
    pass


class DBDataError(DBError):
    pass


class RepeatedAutomationId(DBDataError):
    pass


class DBNoAutomationFound(DBError):
    pass
