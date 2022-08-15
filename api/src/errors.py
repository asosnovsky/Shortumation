class ErrorSet(Exception):
    """An exception collection exception"""

    def __init__(self, *errors: Exception) -> None:
        self.errors = errors
        super().__init__(self.gen_message())

    def gen_message(self):
        if len(self.errors) > 1:
            return "Encountered multiple errors:\n >" + "\n >".join(map(repr, self.errors))
        else:
            return str(self.errors[0].args)
