import traceback
from typing import NamedTuple


class ErrorSet(Exception):
    """An exception collection exception"""

    def __init__(self, *errors: Exception) -> None:
        self.errors = errors
        super().__init__(self.gen_message())

    def gen_message(self):
        if len(self.errors) > 1:
            return "Encountered multiple errors:\n >" + "\n >".join(
                map(FormattedError.from_error, self.errors)
            )
        else:
            return str(self.errors[0].args)


class FormattedError(NamedTuple):
    error_name: str
    error_message: str
    error_traceback: str
    original_error: Exception

    @classmethod
    def from_error(cls, err: Exception):
        return cls(
            error_name=str(err.__class__.__name__),
            error_message=str(err.args),
            error_traceback="\n\n".join(traceback.format_tb(err.__traceback__)),
            original_error=err,
        )
