class IDNotFoundException(Exception):
    status_code = 400

    def __init__(self, msg, status_code=None, payload=None):
        self.message = msg
        if status_code:
            self.status_code = status_code
        self.payload = payload

    def to_fail_response(self):
        pass

