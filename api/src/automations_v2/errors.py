class AutomationLoaderException(Exception):
    def __init__(self, *args: object, **kwargs) -> None:
        super().__init__(
            "".join(map(str, args)) + ",".join((f"{k}={v}" for k, v in kwargs.items())),
        )


class InvalidAutomationFile(AutomationLoaderException):
    pass


class FailedDeletion(AutomationLoaderException):
    pass


class DBError(Exception):
    pass


class DBDataError(DBError):
    pass
