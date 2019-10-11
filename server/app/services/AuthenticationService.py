import jwt
from app.exceptions.RequestNotAuthenticated import RequestNotAuthenticated


class AuthenticationService:
    token = None
    token_dict = None

    def __init__(self, headers):
        """
        Constructor that takes token

        :param token: Firebase authentication header
        """
        try:
            self.token = headers['Authorization']
            self.token_dict = jwt.decode(self.token, verify=False)
        except KeyError:
            raise RequestNotAuthenticated

    def get_token_uuid(self):
        """
        Tries to get UUID ('sub' key) from token

        :return: string representing UUID passed in authorization token
        """
        if self.token is None:
            raise RequestNotAuthenticated("No Authentication header found")
        try:
            return self.token_dict['sub']
        except KeyError:
            raise RequestNotAuthenticated('Unable to find sub key in decoded token')

    def token_user_owns_entity(self, uuid):
        """
        returns True if the passed UUID matches the UUID within the authorization token
        :param uuid:
        :return:
        """
        if uuid == self.get_token_uuid():
            return True
        return False
